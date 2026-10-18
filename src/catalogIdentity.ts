/**
 * OffSec by True Hacking — Tool Catalog (product catalog).
 *
 * Mirrors REA's catalogIdentity.ts: declares ALL available MCP tools
 * and CLI commands. Must stay in sync with src/server/ and src/cli/.
 * See: https://github.com/morluto/rea/blob/main/src/catalogIdentity.ts
 */

export const OFFSEC_TOOLS = {
  // ─── Reconnaissance / Scanning ──────────────────────────────────────────

  /** Scan a target with nmap-like behavior (TCP SYN, port, services). */
  readonly scan = "scan" as const;

  /** Scan a target with shallow (few ports) or deep (1–65535) modes. */
  readonly scanShallow = "scanShallow" as const;

  /** Scan a target with deep mode (all 65535 ports). */
  readonly scanDeep = "scanDeep" as const;

  /** Capture live traffic (pcap: interface, bpf filter, output path). */
  readonly pcap = "pcap" as const;

  /** Capture live traffic (pcap: interface, bpf filter, output path). */
  readonly pcapLive = "pcapLive" as const;

  // ─── Exploitation / Offensive ───────────────────────────────────────────

  /** Run an exploit (MSFvenom-style payload generation). */
  readonly exploit = "exploit" as const;

  /** Run Metasploit (msfconsole-style framework). */
  readonly metasploit = "metasploit" as const;

  /** Execute a custom payload (shellcode, reverse shell, etc.). */
  readonly payload = "payload" as const;

  /** Exploit a specific vulnerability (CVE-based lookup + exploit). */
  readonly cveExploit = "cveExploit" as const;

  // ─── CTI (Intelligence) ─────────────────────────────────────────────────

  /** Search threat intelligence (shodan, virustotal, etc.). */
  readonly threatIntel = "threatIntel" as const;

  /** Search malware analysis (samples, hashes, yara). */
  readonly malwareAnalysis = "malwareAnalysis" as const;

  /** Analyze malware/forensic (YARA rules, signatures, hashes). */
  readonly forensic = "forensic" as const;

  // ─── Post-exploitation / Framework ──────────────────────────────────────

  /** List agents (Metasploit framework agents). */
  readonly listAgents = "listAgents" as const;

  /** Interact with an agent (session read/write). */
  readonly agentInteract = "agentInteract" as const;

  /** Kill a session (agent/compound). */
  readonly killSession = "killSession" as const;

  // ─── Utilities ──────────────────────────────────────────────────────────

  /** Enumerate local/remote hosts (subnet scan). */
  readonly subnetScan = "subnetScan" as const;

  /** Run a single command (generic shell). */
  readonly command = "command" as const;

  /** File operations (read/write/transfer). */
  readonly fileOps = "fileOps" as const;

  /** Custom payload (shellcode, reverse, bind, meterpreter). */
  readonly customPayload = "customPayload" as const;

  /** Kerberoasting (Kerberos service ticket extraction). */
  readonly kerberoast = "kerberoast" as const;

  /** NTLM hashes dump (system/credential). */
  readonly ntlmDump = "ntlmDump" as const;
} as const;

/** Build the catalog (product catalog + tool aliases). */
export function buildCatalog() {
  return {
    name: "offsec-by-truehacking",
    version: "0.0.1",
    tools: [
      {
        name: OFFSEC_TOOLS.scan,
        title: "Scan Target",
        description: "Execute nmap-style scan (TCP SYN/Connect, ports, services).",
        inputSchema: "type:object { target: string, ports: string, mode: 'shallow'|'deep', options: object }",
      },
      {
        name: OFFSEC_TOOLS.scanShallow,
        title: "Shallow Scan",
        description: "Quick scan on common ports (22,80,443,8080,8443).",
        inputSchema: "type:object { target: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.scanDeep,
        title: "Deep Scan",
        description: "Deep scan on 1–65535 ports.",
        inputSchema: "type:object { target: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.pcap,
        title: "Capture PCAP",
        description: "Live capture with bpf (optional: file output).",
        inputSchema: "type:object { interface: string, filter: string, file: string? }",
      },
      {
        name: OFFSEC_TOOLS.pcapLive,
        title: "Live Capture",
        description: "Long-running live capture (agent-run).",
        inputSchema: "type:object { interface: string, filter: string, duration: number }",
      },
      {
        name: OFFSEC_TOOLS.exploit,
        title: "Run Exploit",
        description: "Execute a payload/exploit against a target (with options: verbose, payload, lport, rhost).",
        inputSchema: "type:object { target: string, payload: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.metasploit,
        title: "Run Metasploit",
        description: "Run Metasploit (msfconsole-style: modules, payloads, hosts, rhosts).",
        inputSchema: "type:object { module: string, target: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.payload,
        title: "Execute Payload",
        description: "Run a custom payload (reverse/binder/bind shell, meterpreter, etc.).",
        inputSchema: "type:object { type: 'reverse'|'bind'|'meterpreter'|'shell', target: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.cveExploit,
        title: "CVE Exploit",
        description: "Run a CVE-based exploit (look up, exploit, verify).",
        inputSchema: "type:object { cve: string, target: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.threatIntel,
        title: "Threat Intel",
        description: "Search external threat intelligence (Shodan, VirusTotal, MITRE).",
        inputSchema: "type:object { query: string, provider: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.malwareAnalysis,
        title: "Malware Analysis",
        description: "Analyze malware sample (hash, yara, PE, strings).",
        inputSchema: "type:object { path: string, actions: string[] }",
      },
      {
        name: OFFSEC_TOOLS.forensic,
        title: "Forensic Scan",
        description: "Run forensic scan (data from local, YARA, memory).",
        inputSchema: "type:object { actions: string[], options: object }",
      },
      {
        name: OFFSEC_TOOLS.listAgents,
        title: "List Agents",
        description: "List active agents/sessions (sessions/sessions handles).",
        inputSchema: "type:object {}",
      },
      {
        name: OFFSEC_TOOLS.agentInteract,
        title: "Interact Agent",
        description: "Interact with an agent (read/write/output).",
        inputSchema: "type:object { agentId: string, command: string }",
      },
      {
        name: OFFSEC_TOOLS.killSession,
        title: "Kill Session",
        description: "Kill an agent/session (agent/compound).",
        inputSchema: "type:object { sessionId: string }",
      },
      {
        name: OFFSEC_TOOLS.subnetScan,
        title: "Subnet Scan",
        description: "Run a subnet scan (arp/ping discovery + services).",
        inputSchema: "type:object { cidr: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.command,
        title: "Run Command",
        description: "Run a single command (generic shell).",
        inputSchema: "type:object { command: string, target: string? }",
      },
      {
        name: OFFSEC_TOOLS.fileOps,
        title: "File Operations",
        description: "Read/write/transfer files (readFile, writeFile, download, upload).",
        inputSchema: "type:object { action: string, path: string, data: string? }",
      },
      {
        name: OFFSEC_TOOLS.customPayload,
        title: "Custom Payload",
        description: "Generate custom payload (meterpreter, reverse/binder shell, etc.).",
        inputSchema: "type:object { type: string, target: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.kerberoast,
        title: "Kerberoast",
        description: "Kerberoasting (Kerberos ticket extraction).",
        inputSchema: "type:object { domain: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.ntlmDump,
        title: "NTLM Dump",
        description: "NTLM credential dump (system/credential databases).",
        inputSchema: "type:object { target: string, options: object }",
      },
    ],
  };
}
