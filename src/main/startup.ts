/**
 * OffSec by True Hacking — Main: Startup (opens initial target).
 *
 * Mirrors REA's src/main/startup.ts:
 *   - loads optional providers (pcap, scan, exploit), creates session, starts tools.
 *   - Returns: opened.ok (false = startup error, true = session started).
 * See: https://github.com/morluto/rea/blob/main/src/main/startup.ts
 */

import type { Session } from "../composition/session.js";
import type { Config } from "../config/parseConfig.js";
import type { Logger as PinoLogger } from "pino";

export type OpenedResult = {
  ok: boolean;
  exitCode?: number;
  message?: string;
};

/**
 * Open the initial target (session).
 *
 * @param session - The created session (persistent, singleton).
 * @param config - Parsed config (identity, catalog).
 * @param logger - Server logger (child: 'startup').
 * @param writeStderr - stderr handler (for startup failures).
 */
export async function openInitialTarget(
  session: Session,
  config: Config,
  logger: PinoLogger,
  writeStderr: (text: string) => void,
): Promise<OpenedResult> {
  // Validate config (identity, catalog must exist).
  if (!config.identity || !config.catalog) {
    writeStderr(`[!] Config error: identity or catalog not found.`);
    return { ok: false, exitCode: 1 };
  }

  // Validate environment (offline mode: true/false).
  const env = session.environment;
  if (!env.env || env.uid === 0) {
    writeStderr(`[!] Environment error: uid is 0 (root? check privileges).`);
    return { ok: false, exitCode: 1 };
  }

  // Load optional providers (PCAP, exploit, forensic).
  try {
    const optional = await loadOptionalProviders(session, config);
    logger.info(`[+] Optional providers loaded: ${Object.keys(optional).join(", ")}`);
  } catch (e: any) {
    logger.warn(`[!] Optional providers failed (continue): ${e.message}`);
  }

  logger.info(`[+] Session opened (${session.sessionId}).`);
  return { ok: true };
}

/** Load optional providers (PCAP, scan, exploit). */
async function loadOptionalProviders(
  session: Session,
  config: Config,
): Promise<Record<string, any>> {
  const { scan } = await import("../adapters/nmap.js");
  const { capture } = await import("../adapters/pcap.js");
  const { payload, metasploit } = await import("../adapters/metasploit.js");

  return {
    scan,
    capture,
    payload,
    metasploit,
  };
}
