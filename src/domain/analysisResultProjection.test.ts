/**
 * OffSec by True Hacking — Domain tests (analysisResultProjection).
 *
 * Unit: Provenance, Result (found/partial/error/empty/partial_result),
 *    scanResult (ScanPort, ScanResult), PcapResult, ExploitResult, SessionResult.
 *
 * Tools: vitest.
 */

import { describe, it, expect } from "vitest";
import {
  isAnalysisResultFound,
  isAnalysisResultError,
  createProvenance,
  type AnalysisResult,
  type Provenance,
  type ScanResult,
  type PcapResult,
  type ExploitResult,
  type SessionResult,
} from "./analysisResultProjection.js";

describe("createProvenance (Provenance)", () => {
  it("should return a Provenance with type='nmap' and path", () => {
    const p = createProvenance("nmap", "/tmp/scan.xml");
    expect(p).toEqual({
      id: "nmap:///tmp/scan.xml",
      type: "nmap",
      path: "/tmp/scan.xml",
      label: "",
      verified: true,
      sensitive: false,
    });
  });

  it("should flag sensitive=true when path contains 'password' or 'credential'", () => {
    const p = createProvenance("msf", "/home/user/credentialDump.txt");
    expect(p.sensitive).toBe(true);
  });

  it("should not flag sensitive when path does not contain sensitive keywords", () => {
    const p = createProvenance("scan", "/tmp/output.pcap");
    expect(p.sensitive).toBe(false);
  });
});

describe("isAnalysisResultFound", () => {
  it("should return true for found results", () => {
    const r: AnalysisResult<string> = {
      kind: "found",
      data: "hello",
      provenance: createProvenance("test", "/tmp/test.txt"),
    };
    expect(isAnalysisResultFound(r)).toBe(true);
  });

  it("should return false for error/partial/empty/partial_result", () => {
    const r1: AnalysisResult<string> = { kind: "error", message: "err", provenance: createProvenance("x", "/y") };
    const r2: AnalysisResult<string> = { kind: "partial", message: "p", partial: "data", provenance: createProvenance("x", "/y"), coverage: 0.5 };
    const r3: AnalysisResult<string> = { kind: "empty", provenance: createProvenance("x", "/y") };
    const r4: AnalysisResult<string> = { kind: "partial_result", data: "d", provenance: createProvenance("x", "/y"), coverage: 0.5 };

    expect(isAnalysisResultFound(r1)).toBe(false);
    expect(isAnalysisResultFound(r2)).toBe(false);
    expect(isAnalysisResultFound(r3)).toBe(false);
    expect(isAnalysisResultFound(r4)).toBe(false);
  });
});

describe("isAnalysisResultError", () => {
  it("should return true for error results", () => {
    const r: AnalysisResult<string> = { kind: "error", message: "err", provenance: createProvenance("x", "/y") };
    expect(isAnalysisResultError(r)).toBe(true);
  });

  it("should return false for other kinds", () => {
    const r: AnalysisResult<string> = { kind: "found", data: "ok", provenance: createProvenance("x", "/y") };
    expect(isAnalysisResultError(r)).toBe(false);
  });
});

describe("ScanResult type (boundary)", () => {
  it("should construct a valid ScanResult", () => {
    const s: ScanResult = {
      host: "192.168.1.100",
      ports: [
        { port: 22, protocol: "tcp", state: "open" },
        { port: 80, protocol: "tcp", state: "closed" },
      ],
      scanTime: 150,
      options: { ports: "22,80", mode: "syn" },
      provenance: createProvenance("nmap", "nmap://192.168.1.100/22,80/syn"),
    };
    expect(s.host).toBe("192.168.1.100");
    expect(s.ports.length).toBe(2);
  });
});
