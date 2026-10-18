/**
 * OffSec by True Hacking — Server: toolResult tests.
 *
 * Unit: createToolResultDelivery (truncates over maxBytes).
 */

import { describe, it, expect } from "vitest";
import { createToolResultDelivery } from "./toolResult.js";

// Capture stdout (mocked).
let stdoutLines: string[] = [];
const mockStdoutWrite = (text: string) => stdoutLines.push(text);

// Override process.stdout.write (before the test).
let originalWrite: typeof process.stdout.write;
beforeAll(() => {
  originalWrite = process.stdout.write.bind(process.stdout);
  process.stdout.write = mockStdoutWrite as any;
});

afterEach(() => {
  stdoutLines = [];
});

afterAll(() => {
  process.stdout.write = originalWrite;
});

describe("createToolResultDelivery (max bytes)", () => {
  it("should deliver full text when within maxBytes", () => {
    const delivery = createToolResultDelivery(1024);
    const data = { message: "Hello world (short)." };
    delivery(data);
    expect(stdoutLines.length).toBe(1);
    expect(stdoutLines[0]).toContain("Hello world (short)");
  });

  it("should truncate (head + ellipsis) when exceeding maxBytes", () => {
    const delivery = createToolResultDelivery(20);  // very small max.
    const data = { message: "This is a very long message that exceeds the limit" };
    delivery(data);

    expect(stdoutLines.length).toBe(1);
    expect(stdoutLines[0]).toContain("[truncated:");  // contains truncation marker.
  });
});
