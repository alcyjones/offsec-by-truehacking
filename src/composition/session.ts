/**
 * OffSec by True Hacking — Composition: Session.
 *
 * Mirrors REA's src/composition/session.ts:
 *   - creates a Session (persistent, singleton, lifecycle-owning).
 *   - Session holds: binary (adapter), logger, config, environment.
 *   - Methods: execute, cleanup, run.
 * See: https://github.com/morluto/rea/blob/main/src/composition/session.ts
 */

import { logger } from "../logger.js";
import type { Environment } from "../process/snapshotEnvironment.js";
import type { Config } from "../config/parseConfig.js";
import type { ScanResult, PcapResult, ExploitResult, SessionResult, Provenance } from "../domain/analysisResultProjection.js";

export type Session = {
  /** Configuration (parsed, validated). */
  readonly config: Config;

  /** Environment (snapshot: env, uid, tmp, limits). */
  readonly environment: Environment;

  /** Logger (child: 'session'). */
  readonly logger: typeof logger;

  /** Session ID (unique, persistent). */
  readonly sessionId: string;

  /** Open (boolean: is this session active?). */
  readonly open: boolean;
};

/**
 * Create an OffSec session (singleton, persistent).
 *
 * @param config - Parsed configuration (identity, catalog).
 * @param env - Snapshot environment (env, uid, tmp, limits).
 */
export function createOffsecSession(config: Config, env: Environment): Session {
  const sessionId = `offsec://${config.identity.name}:${env.pid}`;

  return {
    config,
    environment: env,
    logger: logger.child({ layer: "session", sessionId }),
    sessionId,
    open: true,
  };
}

/** Cleanup (session): close all adapters (cleanup connections, temp files, locks). */
export function closeSession(session: Session): void {
  // (In REA: session.binary.close(); session.cleanup(); session.loaded = false.)
  const { tmpdir } = require("node:os");
  const { readdirSync, unlinkSync, rmSync } = require("node:fs");

  const tmp = session.environment.tmpDir;
  try {
    const files = readdirSync(tmp).filter((f: string) => f.startsWith("offsec_"));
    for (const f of files) {
      unlinkSync(`${tmp}/${f}`);
    }
  } catch {
    // (ignore cleanup errors).
  }

  session.open = false;
  session.logger.info(`Session ${session.sessionId} closed.`);
}
