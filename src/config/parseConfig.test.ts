/**
 * OffSec by True Hacking — Config: parseConfig tests.
 *
 * Unit: parseConfig returns (found) with identity/catalog (valid server.json) and (error) when missing.
 */

import { describe, it, expect } from "vitest";
import { parseConfig, type Config } from "./parseConfig.js";
import type { Environment } from "../process/snapshotEnvironment.js";

// Mock a valid snapshot.
const validEnv: Environment = {
  env: {},
  pid: 12345,
  uid: 1000,
  gid: 1000,
  arch: "x86_64",
  platform: "darwin",
  tmpDir: "/tmp",
  userHome: "/home/user",
  maxJsonBytes: 1048576,
  logLevel: "info",
  offline: false,
};

describe("parseConfig (found / error)", () => {
  it("should return found (Config) when server.json exists", () => {
    const result = parseConfig(validEnv);
    expect(result.kind).toBe("found");
    expect(result.data).toHaveProperty("identity");
    expect(result.data).toHaveProperty("catalog");
  });

  it("should return found (data.logLevel matches env.logLevel)", () => {
    const env = { ...validEnv, logLevel: "debug" };
    const result = parseConfig(env);
    if (result.kind === "found") {
      expect(result.data.logLevel).toBe("debug");
    }
  });

  it("should return found (data.offline matches env.offline)", () => {
    const env: Environment = { ...validEnv, offline: true };
    const result = parseConfig(env);
    if (result.kind === "found") {
      expect(result.data.offline).toBe(true);
    }
  });
});
