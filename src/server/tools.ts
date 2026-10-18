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
  [OFFSEC_TOOLS.persistence]: (params) => handlePersistence(params),
  [OFFSEC_TOOLS.keylogger]: (params) => handleKeylogger(params),
  [OFFSEC_TOOLS.persistenceSchedule]: (params) => handlePersistenceSchedule(params),
  [OFFSEC_TOOLS.evasion]: (params) => handleEvasion(params),
  [OFFSEC_TOOLS.evasionSilent]: (params) => handleEvasionSilent(params),
  [OFFSEC_TOOLS.evasionStealth]: (params) => handleEvasionStealth(params),
  [OFFSEC_TOOLS.reporting]: (params) => handleReporting(params),
  [OFFSEC_TOOLS.reportWrite]: (params) => handleReportWrite(params),
  [OFFSEC_TOOLS.c2]: (params) => handleC2(params),
  [OFFSEC_TOOLS.c2Interact]: (params) => handleC2Interact(params),
  [OFFSEC_TOOLS.c2Kill]: (params) => handleC2Kill(params),
  [OFFSEC_TOOLS.privilegeEscalation]: (params) => handlePrivilegeEscalation(params),
  [OFFSEC_TOOLS.lateralMovement]: (params) => handleLateralMovement(params),
  [OFFSEC_TOOLS.exfiltration]: (params) => handleExfiltration(params),
  [OFFSEC_TOOLS.wireless]: (params) => handleWireless(params),
  [OFFSEC_TOOLS.cloud]: (params) => handleCloud(params),
  [OFFSEC_TOOLS.bruteForce]: (params) => handleBruteForce(params),
  [OFFSEC_TOOLS.misp]: (params) => handleMisp(params),
  [OFFSEC_TOOLS.osint]: (params) => handleOsint(params),
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

// ─── New Handlers (Persistence, Evasion, Reporting, C2, Privilege Escalation, Lateral Movement, Exfiltration, Wireless, Cloud, Brute Force, MISP, OSINT) ─────────────────────────────────────────────────────────────────────

async function handlePersistence(params: any): Promise<any> {
  const { persistence } = await import("../adapters/persistence.js");
  const result = persistence({ target: params.target, actions: params.actions, options: params.options });
  return { result };
}

async function handleKeylogger(params: any): Promise<any> {
  const { keylogger } = await import("../adapters/keylogger.js");
  const result = keylogger({ target: params.target, actions: params.actions, options: params.options });
  return { result };
}

async function handlePersistenceSchedule(params: any): Promise<any> {
  const { persistenceSchedule } = await import("../adapters/persistenceSchedule.js");
  const result = persistenceSchedule({ target: params.target, type: params.type, options: params.options });
  return { result };
}

async function handleEvasion(params: any): Promise<any> {
  const { evasion } = await import("../adapters/evasion.js");
  const result = evasion({ file: params.file, target: params.target, encoding: params.encoding, options: params.options });
  return { result };
}

async function handleEvasionSilent(params: any): Promise<any> {
  const { evasionSilent } = await import("../adapters/evasion.js");
  const result = evasionSilent({ target: params.target, payload: params.payload, options: params.options });
  return { result };
}

async function handleEvasionStealth(params: any): Promise<any> {
  const { evasionStealth } = await import("../adapters/evasion.js");
  const result = evasionStealth({ target: params.target, method: params.method, options: params.options });
  return { result };
}

async function handleReporting(params: any): Promise<any> {
  const { reporting } = await import("../adapters/reporting.js");
  const result = reporting({ target: params.target, scope: params.scope, findings: params.findings, executiveSummary: params.executiveSummary, options: params.options });
  return { result };
}

async function handleReportWrite(params: any): Promise<any> {
  const { reportWrite } = await import("../adapters/reporting.js");
  const result = reportWrite({ target: params.target, output: params.output, format: params.format, options: params.options });
  return { result };
}

async function handleC2(params: any): Promise<any> {
  const { c2 } = await import("../adapters/c2.js");
  const result = c2({ target: params.target, protocol: params.protocol, options: params.options });
  return { result };
}

async function handleC2Interact(params: any): Promise<any> {
  const { c2Interact } = await import("../adapters/c2.js");
  const result = c2Interact({ sessionId: params.sessionId, command: params.command, options: params.options });
  return { result };
}

async function handleC2Kill(params: any): Promise<any> {
  const { c2Kill } = await import("../adapters/c2.js");
  const result = c2Kill({ sessionId: params.sessionId, options: params.options });
  return { result };
}

async function handlePrivilegeEscalation(params: any): Promise<any> {
  const { privilegeEscalation } = await import("../adapters/privilegeEscalation.js");
  const result = privilegeEscalation({ target: params.target, escalation: params.escalation, options: params.options });
  return { result };
}

async function handleLateralMovement(params: any): Promise<any> {
  const { lateralMovement } = await import("../adapters/lateralMovement.js");
  const result = lateralMovement({ target: params.target, auth: params.auth, options: params.options });
  return { result };
}

async function handleExfiltration(params: any): Promise<any> {
  const { exfiltration } = await import("../adapters/exfiltration.js");
  const result = exfiltration({ target: params.target, data: params.data, method: params.method, options: params.options });
  return { result };
}

async function handleWireless(params: any): Promise<any> {
  const { wireless } = await import("../adapters/wireless.js");
  const result = wireless({ interface: params.interface, target: params.target, attack: params.attack, options: params.options });
  return { result };
}

async function handleCloud(params: any): Promise<any> {
  const { cloud } = await import("../adapters/cloud.js");
  const result = cloud({ target: params.target, cloud: params.cloud, actions: params.actions, options: params.options });
  return { result };
}

async function handleBruteForce(params: any): Promise<any> {
  const { bruteForce } = await import("../adapters/bruteForce.js");
  const result = bruteForce({ target: params.target, service: params.service, wordlist: params.wordlist, options: params.options });
  return { result };
}

async function handleMisp(params: any): Promise<any> {
  const { misp } = await import("../adapters/misp.js");
  const result = misp({ action: params.action, indicator: params.indicator, server: params.server, apiKey: params.apiKey, options: params.options });
  return { result };
}

async function handleOsint(params: any): Promise<any> {
  const { osint } = await import("../adapters/osint.js");
  const result = osint({ target: params.target, search: params.search, provider: params.provider, options: params.options });
  return { result };
}
