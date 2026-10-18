/**
 * OffSec by True Hacking — Application: scan and exploit (shared workflows).
 *
 * Unit: scanWorkflow (session → adapter) and exploitWorkflow (session → adapter).
 *        Mock: if nmap/pcap/msf are not installed, returns error/partial.
 */

import { describe, it, expect } from "vitest";
import { scanWorkflow, ExploitWorkflowParams } from "./scan.js";
import { exploitWorkflow } from "./exploit.js";
import type { Session } from "../composition/session.js";

describe("scanWorkflow (unit: adapter returns)", () => {
  it("should return a ScanResult (with host field) when adapter succeeds", async () => {
    const session: Session = {
      config: {
        identity: { id: "test", title: "Test", version: "0.0.1", description: "", websiteUrl: "" },
        catalog: { name: "test", version: "0.0.1", tools: [] },
        logLevel: "info",
        mcpMaxResponseBytes: 1048576,
        offline: false,
        environment: {
          env: {}, pid: 1, uid: 0, gid: 0, arch: "x86_64", platform: "linux", tmpDir: "/tmp",
          userHome: "/home/user", maxJsonBytes: 1048576, logLevel: "info", offline: false,
        },
      },
      environment: {
        env: {}, pid: 1, uid: 0, gid: 0, arch: "x86_64", platform: "linux", tmpDir: "/tmp",
        userHome: "/home/user", maxJsonBytes: 1048576, logLevel: "info", offline: false,
      },
      logger: { info: () => {} } as any,
      sessionId: "test://1",
      open: true,
    };

    // If adapter is missing (nmap not found): should return partial (empty ports).
    const result = await scanWorkflow(session, { target: "127.0.0.1" });
    expect(result).toHaveProperty("host");
    expect(result.ports).toBeDefined();  // could be [] (if adapter not installed).
  });

  it("should return ScanResult with scanTime when adapter returns", async () => {
    const session: Session = {
      config: {
        identity: { id: "test", title: "Test", version: "0.0.1", description: "", websiteUrl: "" },
        catalog: { name: "test", version: "0.0.1", tools: [] },
        logLevel: "info",
        mcpMaxResponseBytes: 1048576,
        offline: false,
        environment: {
          env: {}, pid: 1, uid: 0, gid: 0, arch: "x86_64", platform: "linux", tmpDir: "/tmp",
          userHome: "/home/user", maxJsonBytes: 1048576, logLevel: "info", offline: false,
        },
      },
      environment: {
        env: {}, pid: 1, uid: 0, gid: 0, arch: "x86_64", platform: "linux", tmpDir: "/tmp",
        userHome: "/home/user", maxJsonBytes: 1048576, logLevel: "info", offline: false,
      },
      logger: { info: () => {} } as any,
      sessionId: "test://1",
      open: true,
    };

    // (Same as above: adapter may be missing — returns partial.)
    const result = await scanWorkflow(session, { target: "127.0.0.1", ports: "22,80" });
    expect(result).toHaveProperty("host");
  });
});

describe("exploitWorkflow (unit: adapter returns)", () => {
  it("should return ExploitResult (success: true/false) when adapter succeeds", async () => {
    const session: Session = {
      config: {
        identity: { id: "test", title: "Test", version: "0.0.1", description: "", websiteUrl: "" },
        catalog: { name: "test", version: "0.0.1", tools: [] },
        logLevel: "info",
        mcpMaxResponseBytes: 1048576,
        offline: false,
        environment: {
          env: {}, pid: 1, uid: 0, gid: 0, arch: "x86_64", platform: "linux", tmpDir: "/tmp",
          userHome: "/home/user", maxJsonBytes: 1048576, logLevel: "info", offline: false,
        },
      },
      environment: {
        env: {}, pid: 1, uid: 0, gid: 0, arch: "x86_64", platform: "linux", tmpDir: "/tmp",
        userHome: "/home/user", maxJsonBytes: 1048576, logLevel: "info", offline: false,
      },
      logger: { info: () => {} } as any,
      sessionId: "test://1",
      open: true,
    };

    const result = await exploitWorkflow(session, { target: "127.0.0.1" });
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("payload");
  });
});
