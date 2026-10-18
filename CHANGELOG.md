# Changelog

## [0.0.1] - 2026-10-18

### Added

- **MCP Server (stdin/stdio)**: Server MCP (JSON-RPC 2.0 via stdio).
- **21 MCP Tools**: `scan`, `scanShallow`, `scanDeep`, `pcap`, `pcapLive`, `exploit`, `metasploit`, `payload`, `cveExploit`, `threatIntel`, `malwareAnalysis`, `forensic`, `listAgents`, `agentInteract`, `killSession`, `subnetScan`, `command`, `fileOps`, `customPayload`, `kerberoast`, `ntlmDump`.
- **Adapters (Tool Boundaries)**: `nmap`, `pcap`, `metasploit`.
- **Application Workflows**: `scan`, `exploit`.
- **CLI (43 commands)**: Maps CLI commands to MCP tools (structured output).
- **Session (Singleton, Persistent)**: Lifecycle management (session-open/close, temp-cleanup).
- **Composition (Optional Providers)**: Lazy-load (scan/pcap/exploit on-demand).
- **Configuration (parseConfig)**: server.json + environment (env vars, limits).
- **Skills (`.agents/skills/`)**: 4 skills (scan-target, exploit-payload, cti-threat-intel, pcap-capture).
- **Domain Types (Provenance, Result, Error, ScanResult, PcapResult, ExploitResult)**.
- **Error Projection (analysisErrorProjection)**: 400/403/404/429/499/500 (types).
- **Logging (pino, named, child)**.
- **Shutdown (SIGTERM/SIGINT/SIGHUP/EOF)**.
- **Transport (MCP stdio, stdin→JSON-RPC→tools→stdout)**.
- **Scripts (offsec.mjs, run-exclusive.mjs, generate-skill-metadata.mjs)**.
- **Catalog (21 tools catalog)**.
- **Server Identity (name, version, description)**.
- **.gitignore (aligned REA)**.
- **README.md (portuguese)**.
- **CI (GitHub Actions: tsc, lint, test, docs)**.
- **Release (release-please: npm publish)**.

### Removed

- Old Python/Shell scripts (`mcp_server.py`, `payloads/`, `errors/`, `skills/` — Python-style).

### Known Limitations

- `threatIntel`: Connects to external APIs (Shodan/VirusTotal) — API keys required.
- `forensic`/`malwareAnalysis`: Stubs (PE/YARA/hashes implementation pending).
- `kerberoast`/`ntlmDump`: Stubs (Windows-specific).
- Binary dependencies (nmap/tcpdump/msfconsole) must be installed externally.
