/**
 * OffSec by True Hacking — Adapter: Metasploit (Client/Tool Boundaries).
 *
 * Mirrors REA's adapter/ida.ts pattern:
 *   - launches msfconsole, runs commands, returns results (JSON).
 *   - handles: missing binary, no target, no session.
 * See: https://github.com/morluto/rea/blob/main/src/adapter/ida.ts
 */

import { execFile, spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, SessionResult, ScanResult, Provenance } from "../domain/analysisResultProjection.js";

const MSF_VERSION = "msfconsole 7.0+";  // latest msfconsole version.
const COMMAND_FILE = "msf_commands";  // default msf file (intermediate).
const TIMEOUT_SEC = 600;  // max 10 minutes (msfconsole).

/**
 * Execute Metasploit (msfconsole) via a file of commands.
 *
 * @param options - Metasploit options (module, target, payloads, args).
 */
export function metasploit(options: {
  module: string;
  target: string;
  payload?: string;
  ports?: string;
  lport?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const msfconsole = findBinary("msfconsole");
  if (!msfconsole) {
    return createMissingError(target: target, module: module);
  }

  // Build the intermediate file (msf file).
  const commands = [
    `setg LHOST ${options.lport || "0.0.0.0"}`,
    `set LPORT ${options.lport || "4444"}`,
    `set RHOSTS ${target}`,
    `use ${options.module}`,
    `set RHOSTS ${target}`,
  ];

  if (options.payload) {
    commands.push(`set PAYLOAD ${options.payload}`);
  }

  if (options.ports) {
    commands.push(`set PORT ${options.ports}`);
  }

  // Add any user-specified options.
  if (options.options) {
    for (const [key, value] of Object.entries(options.options)) {
      commands.push(`set ${key} ${value}`);
    }
  }

  commands.push("exploit -j");  // run exploit in background (JSON output).

  // Write the commands to a file.
  const file = `${tmpdir()}/${randomUUID()}.${COMMAND_FILE}`;
  writeFileSync(file, commands.join("\n"));

  // Execute msfconsole (limited timeout).
  const timeout = Date.now() + TIMEOUT_SEC * 1000;
  let output = "";

  try {
    const child = spawnSync(msfconsole, [file], {
      timeout: TIMEOUT_SEC * 1000,
      maxBuffer: 1024 * 1024,
    });

    if (child.status !== 0 && child.status !== null) {
      output = String(child.stdout ?? "") + "\n" + String(child.stderr ?? "");
    } else {
      output = String(child.stdout ?? "");
    }
  } catch (e: unknown) {
    output = `msfconsole timeout (${TIMEOUT_SEC}s exceeded)`;
  }

  return parseResult(output, target: target, module: options.module);
}

/** Execute a custom payload (payload). */
export function payload(options: {
  type: string;
  target: string;
  lport?: string;
  rport?: string;
}): ExploitResult {
  const target = options.target;
  const payloadName = `exploit/multi/handler`;
  const payloadType = options.type || "reverse_tcp";

  const msfconsole = findBinary("msfconsole");
  if (!msfconsole) {
    return createMissingError(target: target, module: payloadName);
  }

  // Build the commands (use multi/handler for reverse/bind shell).
  const commands = [
    `use ${payloadName}`,
    `set PAYLOAD ${payloadType}`,
    `set LPORT ${options.lport || "4444"}`,
    `set RHOSTS ${target}`,
    `exploit -j`,
  ];

  // Write and execute.
  const file = `${tmpdir()}/${randomUUID()}.${COMMAND_FILE}`;
  writeFileSync(file, commands.join("\n"));

  const child = spawnSync(msfconsole, [file], {
    timeout: TIMEOUT_SEC * 1000,
    maxBuffer: 1024 * 1024,
  });

  const output = String(child.stdout ?? "");
  return parseResult(output, target: target, module: payloadName);
}

/** Find the msfconsole binary. */
function findBinary(name: string): string | undefined {
  const candidates = [
    "/usr/local/bin/msfconsole",
    "/usr/bin/msfconsole",
    "/opt/metasploit-framework/bin/msfconsole",
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

/** Create a missing-msfconsole error. */
function createMissingError(target: string, module: string): ExploitResult {
  return {
    target,
    payload: module,
    success: false,
    output: `[!] ${module} (msfconsole) not found. Install it: brew install metasploit (macOS) or apt install metasploit-framework (Linux).`,
    provenance: createProvenance("metasploit", `${target}/${module}`),
  };
}

/** Parse msfconsole output (find sessions, sessions, results). */
function parseResult(output: string, target: string, module: string): ExploitResult {
  // If the output contains "session_id" or "session":
  const sessions = output.match(/session.*?id[= :] *(\d+)/g);
  if (sessions) {
    const sessionId = parseInt(sessions[0].match(/\d+/)?.[0] || "0");
    return {
      target,
      payload: module,
      success: true,
      output: `[+] Exploit succeeded. session_id: ${sessionId}.`,
      provenance: createProvenance("metasploit", `${target}/${module}`),
    };
  }

  // Check if the output contains "failed" or "error" (exploit failed).
  if (output.includes("failed") || output.includes("failure") || output.includes("error")) {
    return {
      target,
      payload: module,
      success: false,
      output: output.substring(0, 1024),
      provenance: createProvenance("metasploit", `${target}/${module}`),
    };
  }

  // Partial (no session was opened): exploit returned partial (not no session).
  return {
    target,
    payload: module,
    success: false,
    output: output.substring(0, 1024),
    provenance: createProvenance("metasploit", `${target}/${module}`),
  };
}
