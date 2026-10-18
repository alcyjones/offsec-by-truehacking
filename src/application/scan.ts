/**
 * OffSec by True Hacking — Application: Scan (shared workflow).
 *
 * Mirrors REA's src/application/scan.ts:
 *   - shared workflow (scan target: IP, ports, services).
 *   - calls adapters/nmap.scan, returns ScanResult.
 * See: https://github.com/morluto/rea/blob/main/src/application/scan.ts
 */

import type { Session } from "../composition/session.js";
import type { ScanResult } from "../domain/analysisResultProjection.js";
import { scan as adapterScan } from "../adapters/nmap.js";

export type ScanWorkflowParams = {
  /** Target (IP/hostname). */
  readonly target: string;

  /** Ports (default: "22,80,443"). */
  readonly ports?: string;

  /** Mode: 'syn'/'connect'/'udp'. */
  readonly mode?: string;

  /** Options (nmap options). */
  readonly options?: Record<string, string>;
};

/**
 * Scan a target (workflow: session → scan → result).
 *
 * @param session - Open session (with adapters).
 * @param params - Scan parameters.
 */
export async function scanWorkflow(
  session: Session,
  params: ScanWorkflowParams,
): Promise<ScanResult> {
  const { target, ports = "22,80,443", mode = "syn", options = {} } = params;

  // Execute (adapter: nmap).
  const result = adapterScan(target, ports, mode, options);

  return result;
}
