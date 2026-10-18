/**
 * OffSec by True Hacking — Tool Catalog (product catalog).
 *
 * Mirrors REA's catalogIdentity.ts: declares ALL available MCP tools
 * and CLI commands. Must stay in sync with src/server/ and src/cli/.
 * See: https://github.com/morluto/rea/blob/main/src/catalogIdentity.ts
 */

export const OFFSEC_TOOLS = {
  // ─── Reconnaissance / Scanning ──────────────────────────────────────────

  scan: "scan" as const,

  /** Scan a target with shallow (few ports) or deep (1–65535) modes. */
  scanShallow: "scanShallow" as const,

  /** Scan a target with deep mode (all 65535 ports). */
  scanDeep: "scanDeep" as const,

  /** Capture live traffic (pcap: interface, bpf filter, output path). */
  pcap: "pcap" as const,

  /** Capture live traffic (pcap: interface, bpf filter, output path). */
  pcapLive: "pcapLive" as const,

  // ─── Exploitation / Offensive ───────────────────────────────────────────

  /** Run an exploit (MSFvenom-style payload generation). */
  exploit: "exploit" as const,

  /** Run Metasploit (msfconsole-style framework). */
  metasploit: "metasploit" as const,

  /** Execute a custom payload (shellcode, reverse shell, etc.). */
  payload: "payload" as const,

  /** Exploit a specific vulnerability (CVE-based lookup + exploit). */
  cveExploit: "cveExploit" as const,

  // ─── CTI (Intelligence) ─────────────────────────────────────────────────

  /** Search threat intelligence (shodan, virustotal, etc.). */
  threatIntel: "threatIntel" as const,

  /** Search malware analysis (samples, hashes, yara). */
  malwareAnalysis: "malwareAnalysis" as const,

  /** Analyze malware/forensic (YARA rules, signatures, hashes). */
  forensic: "forensic" as const,

  // ─── Post-exploitation / Framework ──────────────────────────────────────

  /** List agents (Metasploit framework agents). */
  listAgents: "listAgents" as const,

  /** Interact with an agent (session read/write). */
  agentInteract: "agentInteract" as const,

  /** Kill a session (agent/compound). */
  killSession: "killSession" as const,

  // ─── Utilities ──────────────────────────────────────────────────────────

  /** Enumerate local/remote hosts (subnet scan). */
  subnetScan: "subnetScan" as const,

  /** Run a single command (generic shell). */
  command: "command" as const,

  /** File operations (read/write/transfer). */
  fileOps: "fileOps" as const,

  /** Custom payload (shellcode, reverse/binder/bind, meterpreter). */
  customPayload: "customPayload" as const,

  /** Kerberoasting (Kerberos service ticket extraction). */
  kerberoast: "kerberoast" as const,

  /** NTLM hashes dump (system/credential). */
  ntlmDump: "ntlmDump" as const,

  // ─── New: Persistence (backdoor, keylogger, scheduler) ──────────────────

  /** Create persistence (backdoor, keylogger, scheduled task, registry). */
  persistence: "persistence" as const,

  /** Keylogger (screenshot + keystroke capture). */
  keylogger: "keylogger" as const,

  /** Persistence via scheduled task / registry / cron. */
  persistenceSchedule: "persistenceSchedule" as const,

  // ─── New: Evasion (UDROP, Encode, Silent, Stealth) ──────────────────────

  /** Decode/encode shellcode (XOR, ROT13, Base64, UDROP). */
  evasion: "evasion" as const,

  /** Silent mode (reverse/shellcode/binder with evasion). */
  evasionSilent: "evasionSilent" as const,

  /** Stealth (network-level stealth: DNS tunneling, HTTPS, etc.). */
  evasionStealth: "evasionStealth" as const,

  // ─── New: Reporting ─────────────────────────────────────────────────────

  /** Generate a penetration report (findings, recommendations, CVSS). */
  reporting: "reporting" as const,

  /** Write a report (PDF/HTML/markdown format). */
  reportWrite: "reportWrite" as const,

  // ─── New: C2 / Command & Control ────────────────────────────────────────

  /** Create a C2 (custom command-and-control channel). */
  c2: "c2" as const,

  /** Interact with a C2 session (remote shell). */
  c2Interact: "c2Interact" as const,

  /** Kill (remove) a C2 session. */
  c2Kill: "c2Kill" as const,

  // ─── New: Privilege Escalation ──────────────────────────────────────────

  /** Privilege escalation (sudo, SUID, capabilities, kernel exploit). */
  privilegeEscalation: "privilegeEscalation" as const,

  // ─── New: Lateral Movement ──────────────────────────────────────────────

  /** Lateral movement (psExec, WMI, SSH, Pass-the-Hash, credential reuse). */
  lateralMovement: "lateralMovement" as const,

  // ─── New: Exfiltration ──────────────────────────────────────────────────

  /** Exfiltration (data exfiltration: DNS, HTTPS, ICMP, DNS tunneling). */
  exfiltration: "exfiltration" as const,

  // ─── New: Wireless / Physical ───────────────────────────────────────────

  /** Wireless (Wi-Fi attack: deauth, PMKID, handshake). */
  wireless: "wireless" as const,

  // ─── New: Cloud ─────────────────────────────────────────────────────────

  /** Cloud (cloud exploitation: IAM, S3, GCP, Azure). */
  cloud: "cloud" as const,

  // ─── New: Brute Force / Credential ──────────────────────────────────────

  /** Brute force (password guessing: SSH, RDP, FTP, SMB, etc.). */
  bruteForce: "bruteForce" as const,

  // ─── New: MISP / Intel Gathering ────────────────────────────────────────

  /** MISP (connect to MISP: Import/export indicators). */
  misp: "misp" as const,

  // ─── New: OSINT ─────────────────────────────────────────────────────────

  /** OSINT (Open Source Intel: username search, email, phone, social). */
  osint: "osint" as const,
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
        description: "Kerberoasting (Kerberos service ticket extraction).",
        inputSchema: "type:object { domain: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.ntlmDump,
        title: "NTLM Dump",
        description: "NTLM credential dump (system/credential databases).",
        inputSchema: "type:object { target: string, options: object }",
      },
      // ─── New: Persistence ─────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.persistence,
        title: "Persistence",
        description: "Create persistence (backdoor, keylogger, scheduled task, registry entry).",
        inputSchema: "type:object { target: string, actions: string[], options: object }",
      },
      {
        name: OFFSEC_TOOLS.keylogger,
        title: "Keylogger",
        description: "Keylogger (screenshot + keystroke capture on target).",
        inputSchema: "type:object { target: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.persistenceSchedule,
        title: "Persistence Schedule",
        description: "Persist via scheduled task / registry / cron.",
        inputSchema: "type:object { target: string, type: 'schedule'|'registry'|'cron', options: object }",
      },
      // ─── New: Evasion ─────────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.evasion,
        title: "Evasion (Encode)",
        description: "Encode/decode shellcode (XOR, ROT13, Base64, UDROP, etc.).",
        inputSchema: "type:object { file: string, encoding: string, target: string }",
      },
      {
        name: OFFSEC_TOOLS.evasionSilent,
        title: "Evasion Silent",
        description: "Silent mode (reverse/shellcode/binder with stealth).",
        inputSchema: "type:object { target: string, payload: string }",
      },
      {
        name: OFFSEC_TOOLS.evasionStealth,
        title: "Evasion Stealth",
        description: "Network-level stealth (DNS tunneling, HTTPS, covert channels).",
        inputSchema: "type:object { target: string, method: string }",
      },
      // ─── New: Reporting ───────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.reporting,
        title: "Penetration Report",
        description: "Generate a penetration report (findings, recommendations, CVSS).",
        inputSchema: "type:object { target: string, scope: string, findings: object[] }",
      },
      {
        name: OFFSEC_TOOLS.reportWrite,
        title: "Write Report",
        description: "Write a report (PDF/HTML/markdown format).",
        inputSchema: "type:object { target: string, output: string, format: 'pdf'|'html'|'md' }",
      },
      // ─── New: C2 ──────────────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.c2,
        title: "Create C2",
        description: "Create a custom C2 (command-and-control channel).",
        inputSchema: "type:object { target: string, protocol: string, options: object }",
      },
      {
        name: OFFSEC_TOOLS.c2Interact,
        title: "C2 Interact",
        description: "Interact with a C2 session (remote shell/command).",
        inputSchema: "type:object { sessionId: string, command: string }",
      },
      {
        name: OFFSEC_TOOLS.c2Kill,
        title: "C2 Kill",
        description: "Kill (remove) a C2 session.",
        inputSchema: "type:object { sessionId: string }",
      },
      // ─── New: Privilege Escalation ────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.privilegeEscalation,
        title: "Privilege Escalation",
        description: "Privilege escalation (sudo, SUID, capabilities, kernel exploit).",
        inputSchema: "type:object { target: string, escalation: string, options: object }",
      },
      // ─── New: Lateral Movement ────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.lateralMovement,
        title: "Lateral Movement",
        description: "Lateral movement (psExec, WMI, SSH, Pass-the-Hash, credential reuse).",
        inputSchema: "type:object { target: string, auth: string, options: object }",
      },
      // ─── New: Exfiltration ────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.exfiltration,
        title: "Exfiltration",
        description: "Data exfiltration (DNS, HTTPS, ICMP, DNS tunneling, etc.).",
        inputSchema: "type:object { target: string, data: string, method: string }",
      },
      // ─── New: Wireless ────────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.wireless,
        title: "Wireless",
        description: "Wi-Fi attack (deauth, PMKID, handshake, WEP/WPA).",
        inputSchema: "type:object { interface: string, target: string, attack: string }",
      },
      // ─── New: Cloud ───────────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.cloud,
        title: "Cloud",
        description: "Cloud exploitation (IAM, S3, GCP, Azure, API keys).",
        inputSchema: "type:object { target: string, cloud: 'aws'|'gcp'|'azure', options: object }",
      },
      // ─── New: Brute Force ─────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.bruteForce,
        title: "Brute Force",
        description: "Brute force (password guessing: SSH, RDP, FTP, SMB, etc.).",
        inputSchema: "type:object { target: string, service: string, wordlist: string }",
      },
      // ─── New: MISP ────────────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.misp,
        title: "MISP",
        description: "Connect to MISP (Import/export indicators, IOCs, events).",
        inputSchema: "type:object { action: string, indicator: string, options: object }",
      },
      // ─── New: OSINT ───────────────────────────────────────────────────────
      {
        name: OFFSEC_TOOLS.osint,
        title: "OSINT",
        description: "Open Source Intel (username search, email, phone, social media).",
        inputSchema: "type:object { target: string, search: string, options: object }",
      },
    ],
  };
}