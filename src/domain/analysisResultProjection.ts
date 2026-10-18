/**
 * OffSec by True Hacking — Domain (Core types).
 *
 * Mirrors REA's src/domain/ pattern: shared contracts, Result types,
 * analysisErrorProjection, provenance. Adapted for security tools.
 * See: https://github.com/morluto/rea/blob/main/src/domain/
 */

// ─── Provenance / Source ─────────────────────────────────────────────────────

/**
 * Represents a provenance of a fact: the original (tool, session, target).
 */
export type Provenance = {
  /** Unique ID (identifies this provenance: analysis/process/target). */
  readonly id: string;

  /** Label (for display; read by the caller). */
  readonly label: string;

  /** Actual type (domain-specific, e.g., 'nmap', 'pcap', 'msf'). */
  readonly type: string;

  /** Path (file path or URL). */
  readonly path: string;

  /** Whether this source was verified (boolean). */
  readonly verified: boolean;

  /** Whether the caller explicitly marks this as sensitive (redaction). */
  readonly sensitive: boolean;
};

export function createProvenance(type: string, path: string, label: string = ""): Provenance {
  return {
    id: `${type}://${path}`,
    type,
    path,
    label,
    verified: true,
    sensitive: path.includes("password") || path.includes("credential") || path.includes("secret"),
  };
}

// ─── Analysis Result ──────────────────────────────────────────────────────────

/**
 * Represents a single result of an analysis operation:
 *   - found / observation / result (includes structured data).
 *   - Error / partial (cancellation, capacity exceeded, empty).
 */
export type AnalysisResult<T> =
  | { kind: "found"; data: T; provenance: Provenance; coverage?: string }
  | { kind: "error"; message: string; code?: number; provenance: Provenance }
  | { kind: "partial"; message: string; partial: T; provenance: Provenance; coverage: number }
  | { kind: "empty"; provenance: Provenance }
  | { kind: "partial_result"; data: T; provenance: Provenance; coverage: number };

/** Check if a result has data (not error/partial/empty). */
export function isAnalysisResultFound<T>(result: AnalysisResult<T>): boolean {
  return result.kind === "found";
}

export function isAnalysisResultError<T>(result: AnalysisResult<T>): boolean {
  return result.kind === "error";
}

// ─── Analysis Error ───────────────────────────────────────────────────────────

/**
 * Represents an analysis error (typed):
 *   - target: authentication missing, no target.
 *   - operation: impossible (tool not found, binary missing).
 *   - security: access denied (root/privileges), firewall.
 *   - capacity: capacity exceeded (too much data, too long time).
 *   - cancellation: cancellation/exit (internal, no output).
 *   - runtime: runtime (unrecoverable; target cannot continue).
 */
export type AnalysisError =
  | { kind: "target"; code: 400; message: string }
  | { kind: "operation"; code: 404; message: string }
  | { kind: "security"; code: 403; message: string }
  | { kind: "capacity"; code: 429; message: string }
  | { kind: "cancellation"; code: 499; message: string }
  | { kind: "runtime"; code: 500; message: string };

export function projectError(code: number, message: string): AnalysisError {
  switch (true) {
    case code >= 200 && code < 400:
      return { kind: "target", code, message };
    case code >= 400 && code < 410:
      return { kind: "target", code, message };
    case code >= 403 && code < 410:
      return { kind: "security", code, message };
    case code >= 404 && code < 410:
      return { kind: "operation", code, message };
    case code >= 429 && code < 430:
      return { kind: "capacity", code, message };
    case code >= 490 && code < 500:
      return { kind: "cancellation", code, message };
    default:
      return { kind: "runtime", code: 500, message };
  }
}

// ─── Scan Result ──────────────────────────────────────────────────────────────

/** A single port/service result from a scan operation. */
export type ScanPort = {
  readonly port: number;
  readonly protocol: "tcp" | "udp";
  readonly state: "open" | "closed" | "filtered" | "open_filtered";
  readonly service?: string;
  readonly version?: string;
  readonly banner?: string;
};

export type ScanResult = {
  readonly host: string;
  readonly ports: ScanPort[];
  readonly scanTime: number;  // seconds
  readonly options: Record<string, string>;
  readonly provenance: Provenance;
};

// ─── PCAP Result ──────────────────────────────────────────────────────────────

/** A capture (pcap) result. */
export type PcapResult = {
  readonly interface: string;
  readonly packets: number;
  readonly duration: number;
  readonly file: string;  // path
  readonly provenance: Provenance;
};

// ─── Exploit Result ───────────────────────────────────────────────────────────

/** A single exploit result. */
export type ExploitResult = {
  readonly target: string;
  readonly payload: string;
  readonly success: boolean;
  readonly output: string;
  readonly provenance: Provenance;
};

// ─── Agent/Session Result ─────────────────────────────────────────────────────

/** A session/agent (Metasploit-style) result. */
export type SessionResult = {
  readonly sessionId: number;
  readonly host: string;
  readonly payload: string;
  readonly uptime: string;
  readonly provenance: Provenance;
};
