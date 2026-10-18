# OffSec by True Hacking

[![Package](https://img.shields.io/badge/Package-OffSec-blue)](https://github.com/truehacking/offsec-by-truehacking)
[![Node](https://img.shields.io/badge/Node-%5E22.19.0%7C%5E24.11.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **OffSec — Pentest, CTI e Segurança Ofensiva.**  
> *Do terminal ou agente com uma CLI e servidor MCP.*

---

## Visão Geral

**OffSec by True Hacking** é um servidor MCP (Model Context Protocol) focado em:

- **Pentest**: reconhecimento, exploração, post-exploitation.
- **CTI (Intelligence)**: threat intel, malware analysis, forense.
- **Ofensiva**: auditoria de segurança (testes, simulações).

Funciona como um servidor MCP (stdin/stdio) para o assistente de IA (via OpenCode, Claude, etc.).

## Instalação

```bash
# (via npx - a forma de usar via CLI/MCP server).
npx -y offsec-by-truehacking mcp
```

Ou com `npm` (via link):

```bash
# (link package local).
npm link offsec-by-truehacking

# (ou via link-global:).
npm link offsec-by-truehacking
```

## Uso

```bash
# (via CLI): offsec [command] [options]
offsec scan 192.168.1.100
offsec exploit 192.168.1.100 --module exploit/windows/smb
offsec pcap --interface eth0 --filter "tcp port 80"
```

## Estructura (segundo o padrão REA)

```
offsec-by-truehacking/
├── server.json            # MCP server schema (mirrors REA).
├── package.json           # Dependencies (ts, npm, turborepo, vitest).
├── tsconfig.json          # TypeScript (ESNext, strict, module: ESNext).
├── scripts/               # Build/run scripts (scripts/offsec.mjs, scripts/run-exclusive.mjs, scripts/generate-skill-metadata.mjs).
├── .agents/               # AI assistant skills (parallel to REA .agents/skills).
│   └── skills/            # JSON files (pentest, CTI, recon).
├── src/                   # Main source (TypeScript).
│   ├── main.ts            # Entry point (bootstraps MCP session).
│   ├── serverIdentity.ts  # Server identity (id, name, version).
│   ├── catalogIdentity.ts # Tool catalog (scan, pcap, exploit, msf, etc.).
│   ├── config/            # parseConfig (server.json, env vars).
│   ├── process/           # snapshotEnvironment (env, uid, tmp, limits).
│   ├── domain/            # Core types (Result, Error, Provenance, ScanResult, PcapResult, ExploitResult, SessionResult).
│   ├── adapters/          # Tool adapters (nmap, pcap, metasploit).
│   ├── cli/               # CLI commands (maps commands to MCP tools).
│   ├── server/            # MCP tool handlers (tool: scan, pcap, exploit, msf, forensic, etc.).
│   ├── composition/       # Sessions (persistent, lifecycle).
│   └── application/       # Shared workflows (scan, exploit, forensic).
├── tests/                 # Unit tests (vitest).
└── .gitignore             # Excluded: node_modules, dist, .cache, .npmrc, .nvmrc, .github, LICENSE, pkg/.
```

## Funcionalidades (40+ MCP Tools)

| Ferramenta | Categoria | Descrição |
|-----------|-----------|-----------|
| `scan` | Recon | Escaneamento nmap (TCP SYN, UDP, Connect). |
| `scanShallow` | Recon | Scan rápido (common ports: 22, 80, 443, 8080, 8443). |
| `scanDeep` | Recon | Scan completo (1–65535 ports). |
| `pcap` | Captura | Captura pcap (tcpdump: interface, filter, file). |
| `pcapLive` | Captura | Captura live (long-running: duration). |
| `exploit` | Exploit | Executa exploit (payload: reverse/binder/meterpreter). |
| `metasploit` | Exploit | Execute Metasploit (msfconsole: modules, payloads, targets). |
| `payload` | Exploit | Custom payload (reverse, binder, meterpreter, shell). |
| `cveExploit` | Exploit | CVE-based exploit (lookup + exploit + verify). |
| `threatIntel` | CTI | Search threat intel (Shodan, VirusTotal, MITRE ATT&CK). |
| `malwareAnalysis` | CTI | Malware analysis (hash, PE, YARA, strings, signatures). |
| `forensic` | CTI | Forensic (data from local, memory dump, file ops). |
| `listAgents` | Framework | List agents/sessions (open sessions). |
| `agentInteract` | Framework | Interact with an agent (session: read/write/output). |
| `killSession` | Framework | Kill a session (exit/cleanup). |
| `subnetScan` | Util | Subnet scan (arp/ping discovery + services). |
| `command` | Util | Run a command (generic shell). |
| `fileOps` | Util | File operations (read/write/transfer). |
| `customPayload` | Exploit | Custom payload (meterpreter, reverse shell, etc.). |
| `kerberoast` | Windows | Kerberoasting (Kerberos ticket extraction). |
| `ntlmDump` | Windows | NTLM credential dump (data from local). |
| `persistence` | Pós-Expo | Persistence (backdoor, keylogger, scheduled task). |
| `keylogger` | Pós-Expo | Keylogger (screenshot + keystroke capture). |
| `persistenceSchedule` | Pós-Expo | Persist via task/registry/cron. |
| `evasion` | Evasão | Encode/decode shellcode (XOR, ROT13, Base64, UDROP). |
| `evasionSilent` | Evasão | Silent mode (reverse/shellcode/binder stealth). |
| `evasionStealth` | Evasão | Network stealth (DNS tunnel, HTTPS, covert). |
| `reporting` | Relatórios | Penetration report (findings, recommendations, CVSS). |
| `reportWrite` | Relatórios | Write report (PDF/HTML/Markdown). |
| `c2` | C2 | Create C2 (command-and-control channel). |
| `c2Interact` | C2 | Interact C2 session (remote shell/command). |
| `c2Kill` | C2 | Kill (remove) a C2 session. |
| `privilegeEscalation` | Windows | PrivEsc (sudo, SUID, capabilities, kernel exploit). |
| `lateralMovement` | Windows | Lateral (psExec, WMI, SSH, Pass-the-Hash). |
| `exfiltration` | Dados | Data exfiltration (DNS, HTTPS, ICMP tunnel). |
| `wireless` | Wireless | Wi-Fi attack (deauth, PMKID, handshake). |
| `cloud` | Cloud | Cloud exploitation (IAM, S3, GCP, Azure). |
| `bruteForce` | Credenciais | Brute force (SSH, RDP, FTP, SMB, HTTP password). |
| `misp` | Intel | Connect MISP (Import/export IOCs, indicators). |
| `osint` | Intel | OSINT (username, email, phone, social media lookup). |
| `portForward` | Rede | Port forwarding (SSH tunnel, SOCKS proxy, port mapping, NAT). |
| `emailPhishing` | Email | Email/Phishing (phishing, spear phishing, DNS spoofing, SMTP relay). |
| `socialEng` | Eng. Social | Social Engineering (vishing, smishing, QR attack, physical attack). |
| `incidentResponse` | IR | Incident Response (IR, triage, forensics, recovery, log analysis, threat hunting). |
| `compliance` | Conformidade | Compliance (audit, CVE verification, vulnerability scan, policy check, risk assessment). |
| `rfAttack` | HW/RF | Hardware/RF (RFID attack, Bluetooth attack, NFC attack, SDN attack). |
| `binaryRe` | RE | Binary/RE (assembly, PE/ELF parsing, shellcode generation, ROP chain). |
| `databaseSql` | Banco de Dados | Database/SQL (SQLi, MySQL, PostgreSQL, MongoDB, Redis, NoSQL). |
| `webTest` | Web | Web Testing (XSS, CSRF, SSRF, SSI, SSTI). |
| `keyMgmt` | Chaves | Key Management (certificate attack, PFX attack, cert harvesting, key theft). |
| `networkInfra` | Infraestrutura | Network/Infrastructure (DNS attack, DHCP attack, SNMP attack, ARP attack, IPv6 attack, NTP attack). |
| `payloadGen` | Geração de Payload | Payload Generation (ASM, shellcode, ROP, file generation). |
| `mobile` | Mobile | Mobile (Android APK reverse engineering, iOS binary analysis, mobile penetration testing). |
| `container` | Container | Container (Docker attack, container escape, K8s attack, etcd attack). |
| `apiTest` | API | API Testing (REST API, GraphQL, OpenAPI, rate limiting, fuzzing). |
| `privacy` | Privacidade/Leak | Privacy (data leak detection, breach checking, dark web monitoring). |
| `phone` | Telefone | Phone (SS7 attack, SIM swap, smishing, vishing, caller ID spoofing). |
| `virtualization` | Virtualização | Virtualization (VM escape, hypervisor attack, container escape). |
| `server` | Servidor | Server (Apache attack, Nginx attack, IIS attack, Tomcat attack, Windows Server attack). |
| `email` | Email | Email (phishing, spear phishing, DNS spoofing, email exploit, DKIM attack, header attack). |


## Errata (erros comuns)

| Código | Causa | Solução |
|--------|-------|---------|
| 403 | Permissão negada (root/privileges). | Use `sudo offsec ...`. |
| 404 | Binary não encontrado (nmap/msf). | Instale: `brew install nmap` ou `apt install metasploit-framework`. |
| 429 | Capacidade excedida (dados muito longos). | Limite: `--limit 512` (bytes). |
| 499 | Cancelamento (timeout 5min). | Aumente: `--timeout 600`. |
| 500 | Erro de tempo (binário quebrado). | Execute: `offsec doctor`. |

---

**Versão:** `0.0.1 (Pré-Alpha)` | **Última atualização:** 18/10/2026
