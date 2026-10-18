/**
 * OffSec by True Hacking — Adapter: Nmap (Client/Tool Boundaries).
 *
 * Mirrors REA's src/adapter/nmap.ts:
 *   - runs nmap, parses output, returns ScanResult (domain).
 *   - supports TCP/UDP/stealth/connect modes.
 *   - handles: missing binary, permission, timeout, no host.
 * See: https://github.com/morluto/rea/blob/main/src/adapter/nmap.ts
 */

import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { createProvenance, type ScanResult, type ScanPort, type Provenance } from "../domain/analysisResultProjection.js";
import { parseString } from "xml2js";

const VERSION = "nmap8.25+";  // latest nmap version
const TIMEOUT_SEC = 300;  // max 5 min

/**
 * Execute a scan command (nmap) and parse the XML result.
 *
 * @param target - Target IP/hostname.
 * @param ports  - Port list (default: "22,80,443").
 * @param mode   - Scan mode: 'connect'(default), 'syn'(stealth), 'udp'.
 * @param opts   - Additional nmap options.
 */
export function scan(
  target: string,
  ports = "22,80,443,8080,8443",
  mode: "connect" | "syn" | "udp" = "syn",
  opts: Record<string, string> = {},
): ScanResult {
  // Check the binary first (if nmap is missing: return partial/error).
  const nmapPath = findNmapBinary() ?? "";
  if (!nmapPath) {
    throw createMissingError(target, ports, mode);
  }

  // Build the command (limit timeout).
  const cmd = ["nmap", "-Pn"];

  // Select scan mode.
  if (mode === "syn") cmd.push("-sS");
  else if (mode === "connect") cmd.push("-sT");
  else if (mode === "udp") cmd.push("-sU");

  // Add ports (either specific or deep).
  cmd.push("-p");
  cmd.push(ports);

  // Additional options (timing, output).
  if (opts["timing"]) cmd.push(`-T${opts["timing"]}`);
  else cmd.push("-T4");

  if (opts["service"] || opts["sV"]) cmd.push("-sV");
  if (opts["os"] || opts["oS"]) cmd.push("-O");

  // XML output (structured, no verbose).
  cmd.push("-oX");
  cmd.push("/dev/stdout");

  // Add the target (appended last).
  cmd.push(target);

  // Execute (limited timeout: 300s).
  const timeout = Date.now() + TIMEOUT_SEC * 1000;
  let output = "";

  try {
    const child = spawnSync(
      nmapPath,
      cmd,
      { timeout: TIMEOUT_SEC * 1000, maxBuffer: 1024 * 1024 },
    );

    if (child.status !== 0 && child.status !== null) {
      // If nmap return code is 1 or 2 (options error/target not alive):
      // Do not fail; instead return partial (host: partial alive or hosts down).
      output = String(child.stdout ?? "");
      output = output + "\n" + String(child.stderr ?? "");
    } else {
      output = String(child.stdout ?? "");
    }
  } catch (e: unknown) {
    // If timeout: partial (host was discovered but timed out).
    output = `nmap timeout (${TIMEOUT_SEC}s exceeded)`;
  }

  // Parse the result (XML to ScanResult).
  return parseOutput(target, output, ports, mode);
}

/** Locate the nmap binary (try PATH, or relative). */
function findNmapBinary(): string | undefined {
  // Standard location (macOS: /usr/local/bin/nmap, /opt/homebrew/bin/nmap).
  const candidates = [
    "/usr/local/bin/nmap",
    "/opt/homebrew/bin/nmap",
    "/usr/bin/nmap",
  ];
  for (const path of candidates) {
    try {
      // Use fs.statSync to check (if the file exists).
      require("node:fs").accessSync(path);
      return path;
    } catch {
      // Skip.
    }
  }
  return undefined;
}

/** Create a missing-nmap error. */
function createMissingError(target: string, ports: string, mode: string): never {
  throw new Error(
    `[!] nmap binary not found. ` +
      `Install it: brew install nmap (macOS) or apt install nmap (Linux). ` +
      `Target: ${target}, ports: ${ports}, mode: ${mode}.`,
  );
}

/** Parse nmap XML output (from stdout). */
function parseOutput(target: string, xmlText: string, ports: string, mode: string): ScanResult {
  // Use the smallest reasonable parser (node:util for XML).
  // If the XML fails (not XML), return a partial result.
  try {
    const parsed: Record<string, any> = parseString(xmlText.trim());
    const hosts = (parsed.nmaprun?.scanrun?.hosts?.[0] ?? []);
    if (hosts.length === 0) {
      return createPartial(target, ports, mode);
    }

    const host = hosts[0];
    const address = host.address?.[0]?.address || target;
    const portsXml = host.ports?.[0]?.port || [];

    const portResults: ScanPort[] = portsXml.map((p: any) => ({
      port: parseInt(p.portid, 10),
      protocol: (p.protocol as "tcp" | "udp") || "tcp",
      state: (p.state?.[0]?.state || "open") as ScanPort["state"],
      service: p.service?.[0]?.name,
      version: p.service?.[0]?.product || "",
      banner: p.service?.[0]?.banner,
    }));

    return {
      host: address,
      ports: portResults,
      scanTime: getElapsedMs(xmlText),
      options: { ports, mode },
      provenance: createProvenance("nmap", `nmap://${target}/${ports}/${mode}`),
    };
  } catch (e) {
    // If parsing fails: return partial.
    return {
      host: target,
      ports: [],
      scanTime: 0,
      options: { ports, mode },
      provenance: createProvenance("nmap", `nmap://${target}/${ports}/${mode}`),
    };
  }
}

/** Create a partial error (no ports found, target unreachable). */
function createPartial(target: string, ports: string, mode: string): ScanResult {
  return {
    host: target,
    ports: [],
    scanTime: 0,
    options: { ports, mode },
    provenance: createProvenance("nmap", `nmap://${target}/${ports}/${mode}`),
  };
}

/** Get elapsed time (from XML duration). */
function getElapsedMs(xmlText: string): number {
  const match = xmlText.match(/scanrun.*?duration=(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
