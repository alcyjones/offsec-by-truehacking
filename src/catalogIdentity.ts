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
  scanShallow: "scanShallow" as const,
  scanDeep: "scanDeep" as const,
  pcap: "pcap" as const,
  pcapLive: "pcapLive" as const,

  // ─── Exploitation / Offensive ───────────────────────────────────────────

  exploit: "exploit" as const,
  metasploit: "metasploit" as const,
  payload: "payload" as const,
  cveExploit: "cveExploit" as const,

  // ─── CTI (Intelligence) ─────────────────────────────────────────────────

  threatIntel: "threatIntel" as const,
  malwareAnalysis: "malwareAnalysis" as const,
  forensic: "forensic" as const,

  // ─── Post-exploitation / Framework ──────────────────────────────────────

  listAgents: "listAgents" as const,
  agentInteract: "agentInteract" as const,
  killSession: "killSession" as const,

  // ─── Utilities ──────────────────────────────────────────────────────────

  subnetScan: "subnetScan" as const,
  command: "command" as const,
  fileOps: "fileOps" as const,
  customPayload: "customPayload" as const,
  kerberoast: "kerberoast" as const,
  ntlmDump: "ntlmDump" as const,

  // ─── New: Persistence (backdoor, keylogger, schedule) ──────────────────

  persistence: "persistence" as const,
  keylogger: "keylogger" as const,
  persistenceSchedule: "persistenceSchedule" as const,

  // ─── New: Evasion (UDROP, Encode, Silent, Stealth) ──────────────────────

  evasion: "evasion" as const,
  evasionSilent: "evasionSilent" as const,
  evasionStealth: "evasionStealth" as const,

  // ─── New: Reporting ─────────────────────────────────────────────────────

  reporting: "reporting" as const,
  reportWrite: "reportWrite" as const,

  // ─── New: C2 / Command & Control ────────────────────────────────────────

  c2: "c2" as const,
  c2Interact: "c2Interact" as const,
  c2Kill: "c2Kill" as const,

  // ─── New: Privilege Escalation ──────────────────────────────────────────

  privilegeEscalation: "privilegeEscalation" as const,

  // ─── New: Lateral Movement ──────────────────────────────────────────────

  lateralMovement: "lateralMovement" as const,

  // ─── New: Exfiltration ──────────────────────────────────────────────────

  exfiltration: "exfiltration" as const,

  // ─── New: Wireless / Physical ───────────────────────────────────────────

  wireless: "wireless" as const,

  // ─── New: Cloud ─────────────────────────────────────────────────────────

  cloud: "cloud" as const,

  // ─── New: Brute Force / Credential ──────────────────────────────────────

  bruteForce: "bruteForce" as const,

  // ─── New: MISP / Intel Gathering ────────────────────────────────────────

  misp: "misp" as const,

  // ─── New: OSINT ─────────────────────────────────────────────────────────

  osint: "osint" as const,

  // ─── New 2: Network / Forwarding ────────────────────────────────────────

  portForward: "portForward" as const,

  // ─── New 3: Email / Phishing ────────────────────────────────────────────

  emailPhishing: "emailPhishing" as const,
  socialEng: "socialEng" as const,
  incidentResponse: "incidentResponse" as const,
  compliance: "compliance" as const,

  // ─── New 4: Hardware / RF ───────────────────────────────────────────────

  rfAttack: "rfAttack" as const,

  // ─── New 5: Binary / Reverse Engineering ────────────────────────────────

  binaryRe: "binaryRe" as const,

  // ─── New 6: Database / SQL ──────────────────────────────────────────────

  databaseSql: "databaseSql" as const,

  // ─── New 7: Web Testing ─────────────────────────────────────────────────

  webTest: "webTest" as const,

  // ─── New 8: Key Management ──────────────────────────────────────────────

  keyMgmt: "keyMgmt" as const,

  // ─── New 9: Network Infrastructure ──────────────────────────────────────

  networkInfra: "networkInfra" as const,

  // ─── New 10: Payload Generation ─────────────────────────────────────────

  payloadGen: "payloadGen" as const,

  // ─── New 11: Mobile (Android / iOS) ─────────────────────────────────────

  mobile: "mobile" as const,

  // ─── New 12: Container (Docker / K8s) ───────────────────────────────────

  container: "container" as const,

  // ─── New 13: API Testing (REST / GraphQL) ───────────────────────────────

  apiTest: "apiTest" as const,

  // ─── New 14: Privacy / Data Leak ────────────────────────────────────────

  privacy: "privacy" as const,

  // ─── New 15: Phone (SS7, SIM Swap) ──────────────────────────────────────

  phone: "phone" as const,

  // ─── New 16: Virtualization (VM Escape) ─────────────────────────────────

  virtualization: "virtualization" as const,

  // ─── New 17: Server (Apache, Nginx, IIS, Tomcat, Windows) ──────────────

  server: "server" as const,

  // ─── New 18: Email (Phishing, DKIM, Header) ─────────────────────────────

  email: "email" as const,
} as const;

/** Build the catalog (product catalog + tool aliases). */
export function buildCatalog() {
  return {
    name: "offsec-by-truehacking",
    version: "0.0.1",
    tools: [
      { name: OFFSEC_TOOLS.scan, title: "Scan Target", description: "Execute nmap-style scan (TCP SYN/Connect, ports, services)." },
      { name: OFFSEC_TOOLS.scanShallow, title: "Shallow Scan", description: "Quick scan on common ports (22,80,443)." },
      { name: OFFSEC_TOOLS.scanDeep, title: "Deep Scan", description: "Deep scan on 1–65535 ports." },
      { name: OFFSEC_TOOLS.pcap, title: "Capture PCAP", description: "Live capture with BPF filter (file output)." },
      { name: OFFSEC_TOOLS.pcapLive, title: "Live Capture", description: "Long-running live capture (agent-run)." },
      { name: OFFSEC_TOOLS.exploit, title: "Run Exploit", description: "Execute a payload/exploit against a target." },
      { name: OFFSEC_TOOLS.metasploit, title: "Run Metasploit", description: "Run Metasploit (msfconsole-style: modules, payloads, hosts)." },
      { name: OFFSEC_TOOLS.payload, title: "Execute Payload", description: "Run a custom payload (reverse/binder/shell, meterpreter, etc.)." },
      { name: OFFSEC_TOOLS.cveExploit, title: "CVE Exploit", description: "Run a CVE-based exploit (lookup, exploit, verify)." },
      { name: OFFSEC_TOOLS.threatIntel, title: "Threat Intel", description: "Search external threat intelligence (Shodan, VirusTotal, MITRE)." },
      { name: OFFSEC_TOOLS.malwareAnalysis, title: "Malware Analysis", description: "Analyze malware sample (hash, YARA, PE, strings)." },
      { name: OFFSEC_TOOLS.forensic, title: "Forensic Scan", description: "Run forensic scan (data from local, YARA, memory)." },
      { name: OFFSEC_TOOLS.listAgents, title: "List Agents", description: "List active agents/sessions (handles)." },
      { name: OFFSEC_TOOLS.agentInteract, title: "Interact Agent", description: "Interact with an agent (read/write/output)." },
      { name: OFFSEC_TOOLS.killSession, title: "Kill Session", description: "Kill an agent/session (cleanup)." },
      { name: OFFSEC_TOOLS.subnetScan, title: "Subnet Scan", description: "Run a subnet scan (ARP/ping discovery + services)." },
      { name: OFFSEC_TOOLS.command, title: "Run Command", description: "Run a single command (generic shell)." },
      { name: OFFSEC_TOOLS.fileOps, title: "File Operations", description: "Read/write/transfer files (read, write, download, upload)." },
      { name: OFFSEC_TOOLS.customPayload, title: "Custom Payload", description: "Generate custom payload (meterpreter, reverse/binder shell, etc.)." },
      { name: OFFSEC_TOOLS.kerberoast, title: "Kerberoast", description: "Kerberoasting (Kerberos ticket extraction)." },
      { name: OFFSEC_TOOLS.ntlmDump, title: "NTLM Dump", description: "NTLM credential dump (system/credential databases)." },
      { name: OFFSEC_TOOLS.persistence, title: "Persistence", description: "Create persistence (backdoor, keylogger, scheduled task, registry)." },
      { name: OFFSEC_TOOLS.keylogger, title: "Keylogger", description: "Keylogger (screenshot + keystroke capture on target)." },
      { name: OFFSEC_TOOLS.persistenceSchedule, title: "Persistence Schedule", description: "Persist via scheduled task / registry / cron." },
      { name: OFFSEC_TOOLS.evasion, title: "Evasion (Encode)", description: "Encode/decode shellcode (XOR, ROT13, Base64, UDROP)." },
      { name: OFFSEC_TOOLS.evasionSilent, title: "Evasion Silent", description: "Silent mode (reverse/shellcode/binder with stealth)." },
      { name: OFFSEC_TOOLS.evasionStealth, title: "Evasion Stealth", description: "Network-level stealth (DNS tunnel, HTTPS)." },
      { name: OFFSEC_TOOLS.reporting, title: "Penetration Report", description: "Generate a penetration report (findings, recommendations, CVSS)." },
      { name: OFFSEC_TOOLS.reportWrite, title: "Write Report", description: "Write a report (PDF/HTML/markdown format)." },
      { name: OFFSEC_TOOLS.c2, title: "Create C2", description: "Create a custom C2 (command-and-control channel)." },
      { name: OFFSEC_TOOLS.c2Interact, title: "C2 Interact", description: "Interact with a C2 session (remote shell/command)." },
      { name: OFFSEC_TOOLS.c2Kill, title: "C2 Kill", description: "Kill (remove) a C2 session." },
      { name: OFFSEC_TOOLS.privilegeEscalation, title: "Privilege Escalation", description: "Privilege escalation (sudo, SUID, capabilities, kernel exploit)." },
      { name: OFFSEC_TOOLS.lateralMovement, title: "Lateral Movement", description: "Lateral movement (psExec, WMI, SSH, Pass-the-Hash)." },
      { name: OFFSEC_TOOLS.exfiltration, title: "Exfiltration", description: "Data exfiltration (DNS, HTTPS, ICMP tunneling)." },
      { name: OFFSEC_TOOLS.wireless, title: "Wireless", description: "Wi-Fi attack (deauth, PMKID, handshake, WEP/WPA)." },
      { name: OFFSEC_TOOLS.cloud, title: "Cloud", description: "Cloud exploitation (IAM, S3, GCP, Azure)." },
      { name: OFFSEC_TOOLS.bruteForce, title: "Brute Force", description: "Brute force (SSH, RDP, FTP, SMB, HTTP password guessing)." },
      { name: OFFSEC_TOOLS.misp, title: "MISP", description: "Connect to MISP (Import/export IOCs, indicators)." },
      { name: OFFSEC_TOOLS.osint, title: "OSINT", description: "Open Source Intel (username search, email, phone, social)." },
      { name: OFFSEC_TOOLS.portForward, title: "Port Forward", description: "Port forwarding (SSH tunnel, SOCKS proxy, port mapping, NAT)." },
      { name: OFFSEC_TOOLS.emailPhishing, title: "Email/Phishing", description: "Email/Phishing (email phishing, spear phishing, DNS spoofing, SMTP relay)." },
      { name: OFFSEC_TOOLS.socialEng, title: "Social Engineering", description: "Social Engineering (vishing, smishing, QR attack, physical attack, tailgating, impersonation)." },
      { name: OFFSEC_TOOLS.incidentResponse, title: "Incident Response", description: "Incident Response (IR, triage, forensics, recovery, log analysis, threat hunting)." },
      { name: OFFSEC_TOOLS.compliance, title: "Compliance", description: "Compliance (compliance, audit, CVE verification, vulnerability scan, policy check, risk assessment)." },
      { name: OFFSEC_TOOLS.rfAttack, title: "RF/Hardware Attack", description: "Hardware/RF (RFID attack, Bluetooth attack, NFC attack, SDN attack)." },
      { name: OFFSEC_TOOLS.binaryRe, title: "Binary/RE", description: "Binary/RE (assembly, PE/ELF parsing, shellcode generation, ROP chain)." },
      { name: OFFSEC_TOOLS.databaseSql, title: "Database/SQL", description: "Database/SQL (SQLi, MySQL, PostgreSQL, MongoDB, Redis, NoSQL)." },
      { name: OFFSEC_TOOLS.webTest, title: "Web Testing", description: "Web Testing (XSS, CSRF, SSRF, SSI, SSTI)." },
      { name: OFFSEC_TOOLS.keyMgmt, title: "Key Management", description: "Key Management (certificate attack, PFX attack, cert harvesting, key theft)." },
      { name: OFFSEC_TOOLS.networkInfra, title: "Network/Infra", description: "Network/Infrastructure (DNS attack, DHCP attack, SNMP attack, ARP attack, IPv6 attack, NTP attack)." },
      { name: OFFSEC_TOOLS.payloadGen, title: "Payload Generation", description: "Payload Generation (ASM, shellcode, ROP, file generation)." },
      { name: OFFSEC_TOOLS.mobile, title: "Mobile", description: "Mobile (Android APK reverse engineering, iOS binary analysis, mobile penetration testing)." },
      { name: OFFSEC_TOOLS.container, title: "Container", description: "Container (Docker attack, container escape, K8s attack, etcd attack)." },
      { name: OFFSEC_TOOLS.apiTest, title: "API Testing", description: "API Testing (REST API, GraphQL, OpenAPI, rate limiting, fuzzing)." },
      { name: OFFSEC_TOOLS.privacy, title: "Privacy/Leak", description: "Privacy (data leak detection, breach checking, dark web monitoring)." },
      { name: OFFSEC_TOOLS.phone, title: "Phone", description: "Phone (SS7 attack, SIM swap, smishing, vishing, caller ID spoofing)." },
      { name: OFFSEC_TOOLS.virtualization, title: "Virtualization", description: "Virtualization (VM escape, hypervisor attack, container escape)." },
      { name: OFFSEC_TOOLS.server, title: "Server", description: "Server (Apache attack, Nginx attack, IIS attack, Tomcat attack, Windows Server attack)." },
      { name: OFFSEC_TOOLS.email, title: "Email (Phishing)", description: "Email (phishing, spear phishing, DNS spoofing, email exploit, DKIM attack, email header attack)." },
    ],
  };
}