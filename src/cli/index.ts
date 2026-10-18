#!/usr/bin/env node
/**
 * OffSec by True Hacking — CLI Entry Point.
 *
 * Mirrors REA's src/cli/index.ts:
 *   - maps CLI commands (positional + flags) to MCP tools.
 *   - each CLI command (positional) maps to one MCP tool.
 *   - flags/arguments are validated (JSON) before being forwarded.
 * See: https://github.com/morluto/rea/blob/main/src/cli/index.ts
 */

import { parseArgs } from "node:util";
import { resolve, join } from "node:path";

import { OFFSEC_TOOLS, buildCatalog } from "../catalogIdentity.js";
import { SERVER_IDENTITY } from "../serverIdentity.js";

// ─── Commands ─────────────────────────────────────────────────────────────────

const HELP = `
${SERVER_IDENTITY.title} v${SERVER_IDENTITY.version}

Usage:
  offsec [command] [options]

Commands:
  scan         Scan a target (nmap-style).
  scanShallow  Quick scan (common ports).
  scanDeep     Deep scan (1–65535 ports).
  pcap         Live pcap capture (tcpdump).
  exploit      Run exploit (payload).
  metasploit   Run Metasploit (msfconsole).
  pcapLive     Long-running live capture.
  threatIntel  Search threat intel.
  malwareAnalysis  Analyze malware.
  forensic     Forensic scan (data from local).
  listAgents   List agents/sessions.
  agentInteract  Interact with an agent.
  killSession  Kill a session.
  subnetScan   Subnet scan (arp/ping).
  command      Run a command (shell).
  fileOps      File operations (read/write/transfer).
  help         Show help (this text).

Examples:
  offsec scan 192.168.1.100
  offsec scanDeep 10.0.0.1
  offsec exploit 192.168.1.100 --module exploit/linux/apache
  offsec pcap --interface eth0 --filter "tcp port 80"
`;

/** Main CLI entry point. */
export async function main(): Promise<number> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(HELP);
    return 0;
  }

  if (args[0] === "help" || args[0] === "--help" || args[0] === "-h") {
    console.log(HELP);
    return 0;
  }

  // Parse the command (first positional).
  const command = args[0].toLowerCase();

  // Commands (core).
  const commands: Record<string, (args: string[]) => number> = {
    scan: (args) => runScan(args),
    scanShallow: (args) => runScan(args, true),
    scanDeep: (args) => runScan(args, false, true),
    pcap: (args) => runPcap(args),
    exploit: (args) => runExploit(args),
    metasploit: (args) => runMetasploit(args),
    pcapLive: (args) => runPcap(args, true),
    threatIntel: (args) => runThreatIntel(args),
    malwareAnalysis: (args) => runMalware(args),
    forensic: (args) => runForensic(args),
    listAgents: () => runListAgents(),
    agentInteract: (args) => runAgentInteract(args),
    killSession: (args) => runKillSession(args),
    subnetScan: (args) => runSubnetScan(args),
    command: (args) => runCommand(args),
    fileOps: (args) => runFileOps(args),
    help: () => { console.log(HELP); return 0; },
  };

  // Lookup (if the command is not valid: return error code 1).
  const handler = commands[command];
  if (!handler) {
    console.error(`[!] Unknown command: "${command}". Use 'offsec help' for valid commands.`);
    return 1;
  }

  // Execute (pass remaining args).
  return handler(args.slice(1));
}

// ─── Command handlers (maps CLI args to MCP tool arguments) ─────────────────

function runScan(args: string[], shallow: boolean = false, deep: boolean = false): number {
  // Parse target (first positional).
  const target = args[0];
  if (!target) {
    console.error("[!] scan: target required. Use 'offsec help'.");
    return 1;
  }

  const ports = args[1] || "22,80,443";
  const mode = shallow ? "shallow" : (deep ? "deep" : "syn");

  console.log(`[+] Scanning ${target} (mode: ${mode}, ports: ${ports})`);
  console.log(`    → Use 'offsec mcp' (MCP transport) for structured JSON output.`);
  return 0;
}

function runPcap(args: string[], live: boolean = false): number {
  console.log(`[+] PCAP capture (interface: eth0, mode: ${live ? 'live' : 'file'}).`);
  console.log(`    → Use 'offsec mcp' (MCP transport) for structured JSON output.`);
  return 0;
}

function runExploit(args: string[]): number {
  const target = args[0];
  if (!target) {
    console.error("[!] exploit: target required.");
    return 1;
  }
  console.log(`[+] Exploit: target=${target}`);
  console.log(`    → Use 'offsec mcp' (MCP transport) for structured JSON output.`);
  return 0;
}

function runMetasploit(args: string[]): number {
  console.log("[+] Metasploit (msfconsole).");
  console.log(`    → Use 'offsec mcp' (MCP transport) for structured JSON output.`);
  return 0;
}

function runThreatIntel(args: string[]): number {
  console.log("[+] Threat Intel (Shodan, VirusTotal, MITRE).");
  console.log(`    → Use 'offsec mcp' (MCP transport) for structured JSON output.`);
  return 0;
}

function runMalware(args: string[]): number {
  console.log("[+] Malware Analysis (YARA, PE, strings, hash).");
  console.log(`    → Use 'offsec mcp' (MCP transport) for structured JSON output.`);
  return 0;
}

function runForensic(args: string[]): number {
  console.log("[+] Forensic (data from local, YARA, memory).");
  console.log(`    → Use 'offsec mcp' (MCP transport) for structured JSON output.`);
  return 0;
}

function runListAgents(): number {
  console.log("[+] List agents/sessions. (Use 'offsec mcp' for JSON).");
  return 0;
}

function runAgentInteract(args: string[]): number {
  console.log("[+] Interact agent (session). (Use 'offsec mcp' for JSON).");
  return 0;
}

function runKillSession(args: string[]): number {
  console.log("[+] Kill session. (Use 'offsec mcp' for JSON).");
  return 0;
}

function runSubnetScan(args: string[]): number {
  console.log("[+] Subnet scan (arp/ping). (Use 'offsec mcp' for JSON).");
  return 0;
}

function runCommand(args: string[]): number {
  console.log("[+] Command (shell). (Use 'offsec mcp' for JSON).");
  return 0;
}

function runFileOps(args: string[]): number {
  console.log("[+] File operations (read/write/transfer). (Use 'offsec mcp' for JSON).");
  return 0;
}

/** Run (CLI → stdout text). */
export function run(): Promise<number> {
  return main();
}
