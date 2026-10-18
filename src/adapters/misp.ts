/**
 * OffSec by True Hacking — Adapter: MISP (Connect to MISP: Import/export indicators).
 *
 * Connects to MISP (Import/export IOCs, indicators, events).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Connect to MISP (Import/export indicators, IOCs, events).
 *
 * @param options - MISP options (action, indicator, server, apiKey).
 */
export function misp(options: {
  action: string;  // import, export, search, alert
  indicator?: string;  // IOC string (IP, domain, hash)
  server?: string;  // MISP server URL
  apiKey?: string;  // MISP API key
  options?: Record<string, string>;
}): ExploitResult {
  const action = options.action;
  const indicator = options.indicator || "";
  const server = options.server || "http://localhost:8080";
  const apiKey = options.apiKey || "";
  const results: Record<string, any> = {};

  // Import (import indicators to MISP).
  if (action === "import") {
    const curlPath = findBinary("curl");
    if (curlPath) {
      const commands = [`curl -X POST "${server}/events/add" -H "Authorization: ${apiKey}" -H "Content-Type: application/json" -d '{"title":"Imported IOC","values":[{"value":"${indicator}","type":"ip"}]}'`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(curlPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.import = String(child.stdout ?? "");
    } else {
      results.import = `{stub: no 'curl' binary (install: brew install curl).}`;
    }
  }

  // Export (export indicators from MISP).
  if (action === "export") {
    const curlPath = findBinary("curl");
    if (curlPath) {
      const commands = [`curl -X GET "${server}/events/export" -H "Authorization: ${apiKey}"`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(curlPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.export = String(child.stdout ?? "");
    } else {
      results.export = `{stub: no 'curl' binary (install: brew install curl).}`;
    }
  }

  // Search (search MISP for indicators).
  if (action === "search") {
    const curlPath = findBinary("curl");
    if (curlPath) {
      const commands = [`curl -X GET "${server}/events/search/${indicator}" -H "Authorization: ${apiKey}"`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(curlPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.search = String(child.stdout ?? "");
    } else {
      results.search = `{stub: no 'curl' binary (install: brew install curl).}`;
    }
  }

  return {
    target: server,
    payload: `misp/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("misp", `misp://${server}/${action}`),
  };
}

/** Find the binary (curl). */
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
