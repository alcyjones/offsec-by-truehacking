/**
 * OffSec by True Hacking — Adapter: PCAP (Client/Tool Boundaries).
 *
 * Mirrors REA's src/adapter/pcap.ts: runs tcpdump/wireshark/tcpdump CLI,
 *   captures packets, saves as pcap file, returns PcapResult.
 *   Handles: missing binary, no interface, permission (capture permission).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/pcap.ts
 */

import { spawnSync, spawn, execFile } from "node:child_process";
import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

import type { PcapResult, Provenance } from "../domain/analysisResultProjection.js";

const PCAP_TIMEOUT_SEC = 120;  // max 2 minutes (live capture).
const DEFAULT_FILE = "pcap";  // default output path.

/**
 * Execute a pcap capture (tcpdump).
 *
 * @param options - Capture options (interface, filter, duration).
 */
export function capture(options: {
  interface: string;
  filter?: string;
  duration?: number;
  file?: string;
}): PcapResult {
  const tcpdump = findBinary("tcpdump") ?? findBinary("tcpdump");
  if (!tcpdump) {
    // Check sudo (if root)
    return tryPcapViaRoot("tcpdump", options);
  }

  return tryPcapViaSudo("tcpdump", options);
}

/** Try pcap via sudo (requires root privileges). */
function tryPcapViaSudo(name: string, options: any): PcapResult {
  const cmd = [
    name,
    "-i", options.interface,
  ];

  if (options.filter) {
    cmd.push("-f");
    cmd.push(options.filter);
  }

  // Calculate the path (output file).
  const path = options.file || `${tmpdir()}/${randomUUID()}.${DEFAULT_FILE}`;
  cmd.push("-w");
  cmd.push(path);

  if (options.duration) {
    cmd.push("-c");
    cmd.push(String(options.duration));
  }

  // Execute (with root via sudo if available).
  const child = spawnSync("sudo", ["-u", process.getuid()?.toString() || "root", ...cmd], {
    timeout: PCAP_TIMEOUT_SEC * 1000,
  });

  const packets = countPackets(path);
  return {
    interface: options.interface,
    packets,
    duration: options.duration || 0,
    file: path,
    provenance: createProvenance("pcap", path),
  };
}

/** Count packets in the output file (size = length / 42 for 42-byte frames). */
function countPackets(path: string): number {
  try {
    const stats = require("node:fs").statSync(path);
    return Math.max(0, Math.floor(stats.size / 42));
  } catch {
    return 0;
  }
}

/** Find the pcap binary (tcpdump or tshark). */
function findBinary(name: string): string | undefined {
  const candidates = [`/usr/local/bin/${name}`, `/usr/bin/${name}`, `/opt/homebrew/bin/${name}`];
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
