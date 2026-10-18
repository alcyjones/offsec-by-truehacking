/**
 * OffSec by True Hacking — Domain: analysisErrorProjection tests.
 *
 * Unit: projectError (typed: target/operation/security/capacity/cancellation/runtime).
 */

import { describe, it, expect } from "vitest";
import { projectError, createAnalysisError } from "./analysisErrorProjection.js";

describe("projectError (typed)", () => {
  it("should return 'target' error for code 400-402", () => {
    const e = projectError(400, "bad input");
    expect(e.kind).toBe("target");
    expect(e.code).toBe(400);
  });

  it("should return 'security' error for code 403", () => {
    const e = projectError(403, "access denied");
    expect(e.kind).toBe("security");
    expect(e.code).toBe(403);
  });

  it("should return 'operation' error for code 404", () => {
    const e = projectError(404, "not found");
    expect(e.kind).toBe("operation");
    expect(e.code).toBe(404);
  });

  it("should return 'capacity' error for code 429", () => {
    const e = projectError(429, "rate limit");
    expect(e.kind).toBe("capacity");
    expect(e.code).toBe(429);
  });

  it("should return 'cancellation' error for code 499", () => {
    const e = projectError(499, "cancelled");
    expect(e.kind).toBe("cancellation");
    expect(e.code).toBe(499);
  });

  it("should return 'runtime' error for codes 500+", () => {
    const e = projectError(500, "internal");
    expect(e.kind).toBe("runtime");
    expect(e.code).toBe(500);
  });

  it("should return 'runtime' error for codes 410-498 (fallback)", () => {
    const e = projectError(450, "unknown");
    expect(e.kind).toBe("runtime");
    expect(e.code).toBe(500);  // (fallback for unknown codes: runtime).
  });
});

describe("createAnalysisError (typed factory)", () => {
  it("should map code 400 to target", () => {
    const e = createAnalysisError(400, "msg");
    expect(e.kind).toBe("target");
  });

  it("should map code 429 to capacity", () => {
    const e = createAnalysisError(429, "msg");
    expect(e.kind).toBe("capacity");
  });

  it("should map code 500 to runtime", () => {
    const e = createAnalysisError(500, "msg");
    expect(e.kind).toBe("runtime");
  });

  it("should map code 499 to cancellation", () => {
    const e = createAnalysisError(499, "msg");
    expect(e.kind).toBe("cancellation");
  });
});
