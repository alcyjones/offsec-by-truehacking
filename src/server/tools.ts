/**
 * OffSec by True Hacking — Server (MCP Tools endpoint).
 *
 * Mirrors REA's src/server/ (tool handlers: scan, pcap, exploit, etc.).
 *   - exports ToolHandlers (handshake tools: scan, pcap, exploit, etc.).
 *   - each tool: typed JSON-RPC 2.0 (requests params typed).
 *   - return: Result (domain/scanResult/provenance/provenance).
 * See: https://github.com/morluto/rea/blob/main/src/server/
 */

import { OFFSEC_TOOLS } from "../catalogIdentity.js";
import { isAnalysisResultFound, isAnalysisResultError, createProvenance } from "../domain/analysisResultProjection.js";
import { createLogger } from "../logger.js";
import type { ScanResult, PcapResult, ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

const logger = createLogger("server", "info");

// ─── Tools Map (cataloged): maps CLI command name → handler. ──────────────────

const TOOLS: Record<string, (params: any) => Promise<any>> = {
  [OFFSEC_TOOLS.scan]: (params) => handleScan(params),
  [OFFSEC_TOOLS.scanShallow]: (params) => handleScan(params, true),
  [OFFSEC_TOOLS.scanDeep]: (params) => handleScan(params, false, true),
  [OFFSEC_TOOLS.pcap]: (params) => handlePcap(params),
  [OFFSEC_TOOLS.pcapLive]: (params) => handlePcap(params, true),
  [OFFSEC_TOOLS.exploit]: (params) => handleExploit(params),
  [OFFSEC_TOOLS.metasploit]: (params) => handleMetasploit(params),
  [OFFSEC_TOOLS.payload]: (params) => handlePayload(params),
  [OFFSEC_TOOLS.cveExploit]: (params) => handleCveExploit(params),
  [OFFSEC_TOOLS.threatIntel]: (params) => handleThreatIntel(params),
  [OFFSEC_TOOLS.malwareAnalysis]: (params) => handleMalware(params),
  [OFFSEC_TOOLS.forensic]: (params) => handleForensic(params),
  [OFFSEC_TOOLS.listAgents]: () => handleListAgents(),
  [OFFSEC_TOOLS.agentInteract]: (params) => handleAgentInteract(params),
  [OFFSEC_TOOLS.killSession]: (params) => handleKillSession(params),
  [OFFSEC_TOOLS.subnetScan]: (params) => handleSubnetScan(params),
  [OFFSEC_TOOLS.command]: (params) => handleCommand(params),
  [OFFSEC_TOOLS.fileOps]: (params) => handleFileOps(params),
  [OFFSEC_TOOLS.customPayload]: (params) => handleCustomPayload(params),
  [OFFSEC_TOOLS.kerberoast]: (params) => handleKerberoast(params),
  [OFFSEC_TOOLS.ntlmDump]: (params) => handleNtlmDump(params),
};

/** Lookup the tool (by name). */
export function getTool(name: string): ((params: any) => Promise<any>) | undefined {
  return TOOLS[name];
}

/** Execute the tool (params: JSON-RPC body). */
export async function executeTool(name: string, params: any): Promise<any> {
  const handler = getTool(name);
  if (!handler) {
    return { error: { code: -32601, message: `Tool not found: "${name}"` } };
  }
  try {
    return { result: await handler(params) };
  } catch (e: any) {
    return { error: { code: -32603, message: String(e.message || e) } };
  }
}

// ─── Handlers (mapped to adapters) ───────────────────────────────────────────

async function handleScan(params: any, shallow: boolean = false, deep: boolean = false): Promise<any> {
  const target = params.target;
  if (!target) {
    return { error: { code: 400, message: "target is required" } };
  }

  const ports = params.ports || (shallow ? "22,80,443" : (deep ? "1-65535" : "22,80,443,8080,8443"));

  // Import the adapter (lazy-load).
  const { scan } = await import("../adapters/nmap.js");

  try {
    const result = scan(target, ports, shallow ? "shallow" : (deep ? "deep" : "syn"), params.options || {});
    return { result: result };
  } catch (e: any) {
    return { error: { code: 404, message: `nmap: ${e.message}` } };
  }
}

async function handlePcap(params: any, live: boolean = false): Promise<any> {
  const interface = params.interface || "eth0";
  const filter = params.filter || undefined;

  const { capture } = await import("../adapters/pcap.js");

  try {
    const result = capture({ interface, filter, duration: params.duration, file: params.file });
    return { result: result };
  } catch (e: any) {
    return { error: { code: 404, message: `pcap: ${e.message}` } };
  }
}

async function handleExploit(params: any): Promise<any> {
  const target = params.target;
  if (!target) {
    return { error: { code: 400, message: "target is required" } };
  }

  const { payload } = await import("../adapters/metasploit.js");

  try {
    const result = payload({
      type: params.payload || "reverse_tcp",
      target,
      lport: params.lport || "4444",
      rport: params.rport,
    });
    return { result: result };
  } catch (e: any) {
    return { error: { code: 404, message: `exploit: ${e.message}` } };
  }
}

async function handleMetasploit(params: any): Promise<any> {
  const target = params.target;
  if (!target) {
    return { error: { code: 400, message: "target is required" } };
  }

  const { metasploit } = await import("../adapters/metasploit.js");

  try {
    const result = metasploit({
      module: params.module || "exploit/multi/handler",
      target,
      payload: params.payload,
      ports: params.ports,
      lport: params.lport,
      options: params.options || {},
    });
    return { result: result };
  } catch (e: any) {
    return { error: { code: 404, message: `metasploit: ${e.message}` } };
  }
}

// Placeholder handlers (implementations go here):

async function handlePayload(params: any): Promise<any> {
  const { payload } = await import("../adapters/metasploit.js");
  const result = payload({
    type: params.type || "reverse_tcp",
    target: params.target || "192.168.1.100",
    lport: params.lport || "4444",
  });
  return { result };
}

async function handleCveExploit(params: any): Promise<any> {
  const { payload } = await import("../adapters/metasploit.js");
  const result = payload({
    type: "exploit/" + (params.module || "multi/handler"),
    target: params.target || "192.168.1.100",
    lport: params.lport || "4444",
  });
  return { result };
}

async function handleThreatIntel(params: any): Promise<any> {
  const { threatIntel } = await import("../adapters/threatIntel.js");
  const result = threatIntel({ query: params.query, provider: params.provider, actions: params.actions, target: params.target, options: params.options });
  return { result };
}

async function handleMalware(params: any): Promise<any> {
  const { malwareAnalysis } = await import("../adapters/malwareAnalysis.js");
  const result = malwareAnalysis({ path: params.path, actions: params.actions, target: params.target, options: params.options });
  return { result };
}

async function handleForensic(params: any): Promise<any> {
  const { forensic } = await import("../adapters/forensic.js");
  const result = forensic({ actions: params.actions, target: params.target, options: params.options });
  return { result };
}

async function handleListAgents(): Promise<any> {
  return { result: { agents: [], message: "No active agents (open sessions)." } };
}

async function handleAgentInteract(params: any): Promise<any> {
  return { result: { message: "Agent interact (not yet implemented: read/write to an open session)." } };
}

async function handleKillSession(params: any): Promise<any> {
  return { result: { message: "Session killed (sessionId: " + (params.sessionId ?? "null") + ")." } };
}

async function handleSubnetScan(params: any): Promise<any> {
  return { result: { message: "Subnet scan (not yet implemented: arp/ping + services)." } };
}

async function handleCommand(params: any): Promise<any> {
  return { result: { message: "Run command (not yet implemented: generic shell)." } };
}

async function handleFileOps(params: any): Promise<any> {
  return { result: { message: "File operations (not yet implemented: read/write/transfer)." } };
}

async function handleCustomPayload(params: any): Promise<any> {
  const { payload } = await import("../adapters/metasploit.js");
  const result = payload({
    type: params.type || "reverse_tcp",
    target: params.target || "192.168.1.100",
    lport: params.lport || "4444",
  });
  return { result };
}

async function handleKerberoast(params: any): Promise<any> {
  const { kerberoast } = await import("../adapters/kerberoast.js");
  const result = kerberoast({ domain: params.domain, target: params.target, options: params.options });
  return { result };
}

async function handleNtlmDump(params: any): Promise<any> {
  const { ntlmDump } = await import("../adapters/ntlmDump.js");
  const result = ntlmDump({ target: params.target, actions: params.actions, options: params.options });
  return { result };
}
