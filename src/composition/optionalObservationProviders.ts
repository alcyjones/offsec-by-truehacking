/**
 * OffSec by True Hacking — Composition: Optional Observation Providers.
 *
 * Mirrors REA's src/composition/optionalObservationProviders.ts:
 *   - loads optional adapters (PCAP, exploit, forensic).
 *   - Returns: { scan, capture, payload, metasploit, ... }.
 *   - If a binary is missing: returns undefined (skip optional).
 * See: https://github.com/morluto/rea/blob/main/src/composition/optionalObservationProviders.ts
 */

import type { Environment } from "../process/snapshotEnvironment.js";

/**
 * Create observation factories (lazy-loaded).
 *
 * @param env - Environment (tmp, offline).
 */
export function createOptionalObservationFactories(
  env: Environment,
): Record<string, any> {
  const result: Record<string, any> = {};

  // Lazy-load: only if the binary is available.
  try {
    const { scan } = require("../adapters/nmap.js");
    result.scan = scan;
  } catch {
    // (nmap not found: skip).
  }

  try {
    const { capture } = require("../adapters/pcap.js");
    result.capture = capture;
  } catch {
    // (tcpdump not found: skip).
  }

  try {
    const { payload, metasploit } = require("../adapters/metasploit.js");
    result.payload = payload;
    result.metasploit = metasploit;
  } catch {
    // (msfconsole not found: skip).
  }

  return result;
}

/** Load optional providers (from factories, lazy-loaded). */
export async function loadOptionalObservationProviders(
  factories: Record<string, any>,
): Promise<Record<string, any>> {
  const result: Record<string, any> = {};

  // Enumerate (if the factory exists, instantiate it).
  for (const [key, factory] of Object.entries(factories)) {
    if (typeof factory === "function") {
      try {
        result[key] = factory();
      } catch {
        // (if factory fails: undefined. safe skip).
      }
    }
  }

  return result;
}
