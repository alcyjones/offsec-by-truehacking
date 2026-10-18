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

## Funcionalidades (MCP Tools)

| Ferramenta | Descrição |
|-----------|-----------|
| `scan` | Escaneamento nmap (TCP SYN, UDP, Connect). |
| `scanShallow` | Scan rápido (common ports: 22, 80, 443, 8080, 8443). |
| `scanDeep` | Scan completo (1–65535 ports). |
| `pcap` | Captura pcap (tcpdump: interface, filter, file). |
| `pcapLive` | Captura live (long-running: duration, live capture). |
| `exploit` | Executa exploit (payload: reverse/binder/meterpreter shell). |
| `metasploit` | Execute Metasploit (msfconsole: modules, payloads, targets). |
| `payload` | Custom payload (reverse, binder, meterpreter, shell). |
| `cveExploit` | CVE-based exploit (lookup + exploit + verify). |
| `threatIntel` | Search threat intel (Shodan, VirusTotal, MITRE ATT&CK). |
| `malwareAnalysis` | Malware analysis (hash, PE, YARA, strings, signatures). |
| `forensic` | Forensic (data from local, memory dump, file ops). |
| `listAgents` | List agents/sessions (open sessions). |
| `agentInteract` | Interact with an agent (session: read/write/output). |
| `killSession` | Kill a session (exit/cleanup). |
| `subnetScan` | Subnet scan (arp/ping discovery + services). |
| `command` | Run a command (generic shell). |
| `fileOps` | File operations (read/write/transfer). |
| `customPayload` | Custom payload (meterpreter, reverse shell, etc.). |
| `kerberoast` | Kerberoasting (Kerberos ticket extraction). |
| `ntlmDump` | NTLM credential dump (data from local). |

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
