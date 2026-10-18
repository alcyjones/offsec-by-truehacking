/**
 * OffSec by True Hacking — Server: tools tests.
 *
 * Unit: getTool (exists/absent), executeTool (valid/invalid/valid-scenario).
 */

import { describe, it, expect } from "vitest";
import { getTool, executeTool, OFFSEC_TOOLS } from "./tools.js";

describe("getTool (exists/absent)", () => {
  it("should return a handler for 'scan'", () => {
    const h = getTool(OFFSEC_TOOLS.scan);
    expect(h).toBeDefined();
  });

  it("should return a handler for 'metasploit'", () => {
    const h = getTool(OFFSEC_TOOLS.metasploit);
    expect(h).toBeDefined();
  });

  it("should return undefined for a nonexistent tool", () => {
    const h = getTool("nonexistent");
    expect(h).toBeUndefined();
  });
});

describe("executeTool (valid/invalid)", () => {
  it("should return error for invalid tool", async () => {
    const result = await executeTool("no-such-tool", {});
    expect(result).toHaveProperty("error");
    expect((result as any).error.code).toBe(-32601);
  });

  it("should return result for valid tool (scan) even if adapter is not installed", async () => {
    // scan calls the adapter (nmap). If nmap is not installed, it should return error (404).
    const result = await executeTool(OFFSEC_TOOLS.scan, { target: "127.0.0.1" });
    // (If nmap is not installed: result should contain error.code=404.)
    if (result && (result as any).error) {
      expect((result as any).error.code).toBe(404);
    } else if (result && (result as any).result) {
      expect((result as any).result).toHaveProperty("host");
    }
  });
});
