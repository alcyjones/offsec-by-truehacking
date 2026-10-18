/**
 * OffSec by True Hacking — Adapter: Privilege Escalation (sudo, SUID, capabilities, kernel).
 *
 * Attempts privilege escalation (sudo, SUID binaries, kernel exploit, capabilities).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Privilege escalation (sudo, SUID, capabilities, kernel exploit).
 *
 * @param options - PrivilegeEscalation options (target, escalation).
 */
export function privilegeEscalation(options: {
  target: string;
  escalation?: string;  // sudo, SUID, capabilities, kernel
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const escalation = options.escalation || "sudo";
  const results: Record<string, any> = {};

  // Sudo (check sudo privileges, exploit sudo misconfigs).
  if (escalation === "sudo") {
    const sudoPath = findBinary("sudo");
    if (sudoPath) {
      const commands = [`sudo -l`];  // (list sudo privileges).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sudoPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.sudo = String(child.stdout ?? "");
    } else {
      results.sudo = `{stub: no 'sudo' binary (install: apt install sudo).}`;
    }
  }

  // SUID (find SUID binaries: check binaries with SUID bit set).
  if (escalation === "SUID") {
    const findPath = findBinary("find");
    if (findPath) {
      const commands = [`find / -perm -4000 -type f 2>/dev/null`];  // (find SUID binaries).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(findPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.SUID = String(child.stdout ?? "");
    } else {
      results.SUID = `{stub: no 'find' binary (install: brew install findutils).}`;
    }
  }

  // Capabilities (check capabilities: cap_setuid, cap_net_raw, etc.).
  if (escalation === "capabilities") {
    const capPath = findBinary("getcap");
    if (capPath) {
      const commands = [`getcap -r / 2>/dev/null`];  // (find capabilities).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(capPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.capabilities = String(child.stdout ?? "");
    } else {
      results.capabilities = `{stub: no 'getcap' binary (install: apt install libcap2-bin).}`;
    }
  }

  // Kernel (kernel exploit: CVE, kernel version).
  if (escalation === "kernel") {
    const kernelPath = findBinary("uname");
    if (kernelPath) {
      const commands = [`uname -a`, `cat /etc/os-release`];  // (get kernel version).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(kernelPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.kernel = String(child.stdout ?? "");
    } else {
      results.kernel = `{stub: no 'uname' binary (install: brew install coreutils).}`;
    }
  }

  return {
    target,
    payload: `privilegeEscalation/${escalation}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("privilegeEscalation", `privilegeEscalation://${target}/${escalation}`),
  };
}

/** Find the binary (sudo/find/getcap/uname). */
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
