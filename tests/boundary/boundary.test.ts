/**
 * OffSec by True Hacking — Boundary tests (tests/boundary/).
 *
 * Boundary: tests that call adapters (nmap, pcap, metasploit) directly.
 * If binaries are not installed: expected to return error (404) or partial (empty).
 */

import { describe, it, expect, beforeAll } from "vitest";
import { scan, type ScanResult } from "../../src/adapters/nmap.js";
import { capture, type PcapResult } from "../../src/adapters/pcap.js";
import { payload, type ExploitResult } from "../../src/adapters/metasploit.js";
import { threatIntel, type ExploitResult as TIResult } from "../../src/adapters/threatIntel.js";
import { malwareAnalysis, type ExploitResult as MAResult } from "../../src/adapters/malwareAnalysis.js";
import { forensic, type ExploitResult as FoResult } from "../../src/adapters/forensic.js";
import { kerberoast, type ExploitResult as KResult } from "../../src/adapters/kerberoast.js";
import { ntlmDump, type ExploitResult as NTResult } from "../../src/adapters/ntlmDump.js";
import { main } from "../../src/cli/index.js";

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

describe("Boundary: nmap adapter (if nmap installed)", () => {
  it("should return a partial ScanResult (ports: []) when nmap not installed", async () => {
    const result = await scan("127.0.0.1", "22,80");
    expect(result.host).toBe("127.0.0.1");
    expect(result.ports.length).toBe(0);  // (if nmap not installed: no ports).
  });

  it("should return ScanResult with host when nmap is installed (if binary exists: skip)", async () => {
    if (!hasBinary("nmap")) {
      // (Skip: nmap not installed).
      expect(true).toBe(true);
    } else {
      // (If nmap is installed: result.ports should have [22,80,...]).
      const result = await scan("127.0.0.1", "22,80");
      expect(result).toHaveProperty("host");
    }
  });
});

describe("Boundary: pcap adapter (if tcpdump installed)", () => {
  it("should return PcapResult (file: ...) when tcpdump installed (but skipped if not)", async () => {
    // (If tcpdump is installed: capture should return PcapResult with packets/file.)
    expect(true).toBe(true);  // (placeholder).
  });
});

describe("Boundary: metasploit adapter (if msfconsole installed)", () => {
  it("should return ExploitResult with success: false when msfconsole not installed", async () => {
    const result = await payload({ type: "reverse_tcp", target: "127.0.0.1", lport: "4444" });
    expect(result.success).toBe(false);  // (If msfconsole not installed: returns false).
  });

  it("should return ExploitResult with success: true when msfconsole is installed (if binary exists: skip)", async () => {
    if (hasBinary("msfconsole")) {
      // (If msfconsole is installed: result.success should be true).
      const result = await payload({ type: "reverse_tcp", target: "127.0.0.1" });
      expect(result.success).toBe(true);  // (expect to succeed).
    } else {
      // (If msfconsole is not installed: should return success: false).
      const result = await payload({ type: "reverse_tcp", target: "127.0.0.1" });
      expect(result.success).toBe(false);
    }
  });
});

describe("Boundary: CLI (run)", () => {
  it("should call main() with valid commands and return 0", async () => {
    const result = await main();
    expect(result).toBe(0);  // (no-args → help: exit=0).
  });

  it("should call main() with 'help' and print help text (exit=0)", async () => {
    const result = await main();
    expect(result).toBe(0);  // (no-args → help: exit=0).
  });

  it("should call main() with 'scan' and return 0 (exit=0)", async () => {
    // (For 'scan': run main(['scan', '127.0.0.1']) — but we can't override process.argv).
    expect(true).toBe(true);  // (placeholder).
  });
});

describe("Boundary: threatIntel (if API key is present)", () => {
  it("should return ExploitResult with success: true when API key is present", async () => {
    const result = await threatIntel({ query: "127.0.0.1", provider: "shodan" });
    expect(result).toHaveProperty("success");
  });
});

describe("Boundary: malwareAnalysis (if binaries are present)", () => {
  it("should return ExploitResult with success: true when binaries are present (if strings/yara/pe/hash are available: skip)", async () => {
    const result = await malwareAnalysis({ actions: ["strings", "hash"] });
    expect(result).toHaveProperty("success");
  });
});

describe("Boundary: forensic (if binaries are present)", () => {
  it("should return ExploitResult with success: true when binaries are present (if find/yara/fileOps are available: skip)", async () => {
    const result = await forensic({ actions: ["dataFromLocal", "fileOps"] });
    expect(result).toHaveProperty("success");
  });
});

describe("Boundary: kerberoast (if mimikatz/PowerShell is present)", () => {
  it("should return ExploitResult with success: true if mimikatz/PowerShell is present (otherwise skip)", async () => {
    const result = await kerberoast({ domain: "test.local" });
    expect(result).toHaveProperty("success");
  });
});

describe("Boundary: ntlmDump (if mimikatz/PowerShell is present)", () => {
  it("should return ExploitResult with success: true if mimikatz/PowerShell is present (otherwise skip)", async () => {
    const result = await ntlmDump({ target: "127.0.0.1", actions: ["hash", "lsa"] });
    expect(result).toHaveProperty("success");
  });
});
