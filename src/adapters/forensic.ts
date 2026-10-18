/**
 * OffSec by True Hacking — Adapter: Forensic.
 *
 * Runs forensic (data from local, YARA, memory dump, file ops).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync, existsSync, createReadStream } from "node:fs";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";

import type { ExploitResult, ScanResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Forensic (data from local, YARA, memory dump, file ops).
 *
 * @param options - Forensic options (actions: dataFromLocal, yara, memory, fileOps).
 */
export function forensic(options: {
  actions?: string[];
  target?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const actions = options.actions || [];
  const target = options.target || "";

  // Build the results (actions: dataFromLocal, YARA, memory, fileOps).
  const results: Record<string, any> = {};

  // Data from local (find sensitive files).
  if (actions.includes("dataFromLocal")) {
    const dataPath = findBinary("find") || findBinary("find");
    if (dataPath) {
      const child = spawnSync(dataPath, ["/home", "-type", "f", "-name", "*.txt"], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.dataFromLocal = String(child.stdout ?? "");
    } else {
      results.dataFromLocal = `{stub: no 'find' binary (install: brew install findutils or apt install findutils).}`;
    }
  }

  // YARA (run YARA rules).
  if (actions.includes("yara")) {
    const yaraPath = findBinary("yara");
    if (yaraPath) {
      const yaraFile = `${tmpdir()}/${randomUUID()}.yar`;
      writeFileSync(yaraFile, "rule dummy {strings: $a = \"$(echo abc)" + "}");  // dummy rule.
      const child = spawnSync(yaraPath, [yaraFile, "/home"], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.yara = String(child.stdout ?? "");
    } else {
      results.yara = `{stub: no 'yara' binary (install: brew install yara or apt install yara).}`;
    }
  }

  // Memory (dump).
  if (actions.includes("memory")) {
    results.memory = `{stub: memory dump requires root (run as root).}`;
  }

  // File ops (read/write/transfer).
  if (actions.includes("fileOps")) {
    const fileOpsPath = findBinary("cat");
    if (fileOpsPath) {
      const child = spawnSync(fileOpsPath, ["/home/user/test.txt"], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.fileOps = String(child.stdout ?? "");
    } else {
      results.fileOps = `{stub: no 'cat' binary (install: brew install coreutils or apt install coreutils).}`;
    }
  }

  return {
    target,
    payload: `forensic/${actions.join(",")}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("forensic", `forensic://${target}/${actions.join(",")}`),
  };
}

/** Find the binary (find/strings/yara/file/sha256sum/md5sum). */
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
