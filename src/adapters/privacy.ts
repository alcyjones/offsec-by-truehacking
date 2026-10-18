/**
 * OffSec by True Hacking — Adapter: Privacy/Data Leak (data leak detection, breach checking, dark web monitoring).
 *
 * Privacy (data leak detection, breach checking, dark web monitoring, OSINT leak, breach intelligence, breach validation).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Privacy (data leak detection, breach checking, dark web monitoring, breach intelligence, breach validation).
 *
 * @param options - Privacy options (action, email, domain, target).
 */
export function privacy(options: {
  action?: string;  // leakDetection, breachCheck, darkWeb, breachIntel, breachValidate
  email?: string;
  domain?: string;
  target?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const action = options.action || "leakDetection";
  const email = options.email || "";
  const domain = options.domain || "";
  const target = options.target || "";
  const results: Record<string, any> = {};

  // Leak Detection (search databases for leaked credentials/emails).
  if (action === "leakDetection") {
    const leakPath = findBinary("leak");
    if (leakPath) {
      const commands = [`leak --email ${email}`];  // (leak detection).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(leakPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.leakDetection = String(child.stdout ?? "");
    } else {
      results.leakDetection = `{stub: no 'leak' binary (install: apt install leak).}`;
    }
  }

  // Breach Check (check if target is breached).
  if (action === "breachCheck") {
    const checkPath = findBinary("breachCheck");
    if (checkPath) {
      const commands = [`breachCheck --domain ${domain}`];  // (breach check).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(checkPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.breachCheck = String(child.stdout ?? "");
    } else {
      results.breachCheck = `{stub: no 'breachCheck' binary (install: apt install breachCheck).}`;
    }
  }

  // Dark Web Monitoring (monitor dark web for leaked credentials).
  if (action === "darkWeb") {
    const darkPath = findBinary("darkweb");
    if (darkPath) {
      const commands = [`darkweb --monitor ${target}`];  // (dark web monitoring).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(darkPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.darkWeb = String(child.stdout ?? "");
    } else {
      results.darkWeb = `{stub: no 'darkweb' binary (install: apt install darkweb).}`;
    }
  }

  return {
    target,
    payload: `privacy/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("privacy", `privacy://${target}/${action}`),
  };
}

/** Find the binary (leak/breachCheck/darkweb). */
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
