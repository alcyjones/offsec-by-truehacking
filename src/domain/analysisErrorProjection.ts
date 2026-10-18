/**
 * OffSec by True Hacking — Analysis Error Projection.
 *
 * Mirrors REA's src/domain/analysisErrorProjection.ts:
 *   - returns a formatted analysis error (tags + message + provenance).
 * See: https://github.com/morluto/rea/blob/main/src/domain/analysisErrorProjection.ts
 */

import type { AnalysisError, Provenance } from "../domain/analysisResultProjection.js";
import { createProvenance } from "../domain/analysisResultProjection.js";

/** Project an error (typed) to a formatted string. */
export function projectError(error: AnalysisError): {
  message: string;
  code: number;
  kind: string;
} {
  const kindLabels = {
    target: "TARGET (400–402)",
    operation: "OPERATION (404–409)",
    security: "SECURITY (403)",
    capacity: "CAPACITY (429)",
    cancellation: "CANCELLATION (499)",
    runtime: "RUNTIME (500–599)",
  };

  const kind = kindLabels[error.kind] ?? "UNKNOWN";
  return {
    message: `${kind}: ${error.message}`,
    code: error.code,
    kind,
  };
}

/** Create a formatted error (no analysisError). */
export function createAnalysisError(code: number, message: string): AnalysisError {
  switch (true) {
    case code >= 200 && code < 400:
      return { kind: "target", code, message };
    case code >= 400 && code < 410:
      return { kind: "target", code, message };
    case code === 403:
      return { kind: "security", code, message };
    case code === 404:
      return { kind: "operation", code, message };
    case code === 429:
      return { kind: "capacity", code, message };
    case code >= 490 && code < 500:
      return { kind: "cancellation", code, message };
    default:
      return { kind: "runtime", code: 500, message };
  }
}
