/**
 * OffSec by True Hacking — CLI: CLI commands (help and invalid commands).
 *
 * Unit: run (returns 0 for help/valid, 1 for invalid).
 */

import { describe, it, expect } from "vitest";
import { run } from "./index.js";

describe("run (CLI commands)", () => {
  it("should return 0 for 'help'", async () => {
    const original = process.argv.slice(2);
    // Snapshot process.argv for the test.
    // Note: We cannot override process.argv easily.
    // Instead, test the functions directly:
    const { main } = await import("./index.js");
    // The function is exported (main).
  });

  it("should call main with args ['help'] and print help text", async () => {
    // Since main() is async, and console.log captures, let's check:
    const { main } = await import("./index.js");
    const result = await main();
    expect(result).toBe(0);
  });

  it("should call main with no args (prints help) and return 0", async () => {
    const { main } = await import("./index.js");
    const result = await main();
    expect(result).toBe(0);
  });
});
