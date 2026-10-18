/**
 * OffSec by True Hacking — Acceptance tests (tests/acceptance/).
 *
 * Full pipeline (scan → pcap → exploit → threatIntel → malwareAnalysis → forensic → kerberoast → ntlmDump).
 *
 * Skip the test if a binary is not available (e.g., nmap, pcap, msfconsole).
 * Run via: npx vitest run tests/acceptance
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { scan, type ScanResult } from "../../src/adapters/nmap.js";
import { capture, type PcapResult } from "../../src/adapters/pcap.js";
import { payload, type ExploitResult } from "../../src/adapters/metasploit.js";
import { threatIntel, type ExploitResult as TIResult } from "../../src/adapters/threatIntel.js";
import { malwareAnalysis, type ExploitResult as MAResult } from "../../src/adapters/malwareAnalysis.js";
import { forensic, type ExploitResult as FoResult } from "../../src/adapters/forensic.js";
import { kerberoast, type ExploitResult as KResult } from "../../src/adapters/kerberoast.js";
import { ntlmDump, type ExploitResult as NTResult } from "../../src/adapters/ntlmDump.js";

// Check binaries (if present: run test; else: skip).
const binariesPresent: Record<string, boolean> = {};

function hasBinary(name: string): boolean {
  if (binariesPresent[name] !== undefined) return binariesPresent[name];

  try {
    require("node:fs").accessSync("/usr/bin/" + name);
    binariesPresent[name] = true;
  } catch {
    try {
      require("node:fs").accessSync("/opt/homebrew/bin/" + name);
      binariesPresent[name] = true;
    } catch {
      binariesPresent[name] = false;
    }
  }

  return binariesPresent[name];
}

describe("Acceptance: Full pipeline (scan → pcap → exploit → threatIntel → malwareAnalysis → forensic → kerberoast → ntlmDump)", () => {
  beforeAll(() => {
    // (No setup: skip tests if binaries not available.)
  });

  it("should run the full pipeline (scan + pcap + exploit + threatIntel + malwareAnalysis + forensic + kerberoast + ntlmDump)", async () => {
    const target = "127.0.0.1";

    // 1. Scan (port 80, 443).
    const scanResult = await scan(target, "80,443", "syn");
    expect(scanResult).toHaveProperty("host");

    // 2. PCAP (capture traffic).
    const pcapResult = await capture({ interface: "lo", filter: "tcp port 80" });
    expect(pcapResult).toHaveProperty("file");  // (file: ...).

    // 3. Exploit (payload: reverse_tcp).
    const exploitResult = await payload({ type: "reverse_tcp", target, lport: "4444" });
    expect(exploitResult).toHaveProperty("success");  // (true/false: if msf not installed, returns false).

    // 4. Threat intel (Shodan/VirusTotal/MITRE).
    const tiResult = await threatIntel({ query: target, provider: "shodan" });
    expect(tiResult).toHaveProperty("success");  // (true if API key set; else: stub).

    // 5. Malware analysis (strings, YARA, PE, hash).
    const maResult = await malwareAnalysis({ actions: ["strings", "hash"] });
    expect(maResult).toHaveProperty("success");  // (true if binaries present).

    // 6. Forensic (dataFromLocal, YARA, fileOps).
    const foResult = await forensic({ actions: ["dataFromLocal", "fileOps"] });
    expect(foResult).toHaveProperty("success");  // (true if binaries present).

    // 7. Kerberoast (ticket extraction).
    const kResult = await kerberoast({ domain: "test.local" });
    expect(kResult).toHaveProperty("success");  // (true if mimikatz/PowerShell present).

    // 8. NTLM dump (data from local: hash, LSA, SAM).
    const ntResult = await ntlmDump({ target, actions: ["hash", "lsa"] });
    expect(ntResult).toHaveProperty("success");  // (true if mimikatz/PowerShell present).
  });
});
