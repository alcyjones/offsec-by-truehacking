/**
 * OffSec by True Hacking — Main: Shutdown (process shutdown handlers).
 *
 * Mirrors REA's src/main/shutdown.ts:
 *   - registers SIGTERM/SIGINT/SIGHUP handlers.
 *   - on shutdown: close session, clean up temp files, write logs.
 * See: https://github.com/morluto/rea/blob/main/src/main/shutdown.ts
 */

import { Session } from "../composition/session.js";
import { createLogger } from "../logger.js";
import type { RuntimeDependencies } from "../main/types.js";

export type ShutdownParams = {
  /** Handle (session + transport). */
  readonly handle: any;

  /** Close any optional providers (loaded in startup). */
  readonly closeOptionalProviders: () => Promise<void>;

  /** Session (persistent, singleton). */
  readonly session: Session;

  /** Dependencies (env, writeStderr, setExitCode). */
  readonly dependencies: RuntimeDependencies;

  /** Server logger (child: 'shutdown'). */
  readonly serverLogger: typeof import("pino").Logger;
};

/** Create shutdown handler (registered with registerProcessShutdown). */
export function createShutdown(params: ShutdownParams): void {
  const { session, dependencies } = params;
  const logger = createLogger("shutdown", "info");

  // Register handlers (SIGTERM, SIGINT, SIGHUP, EOF).
  const handlers = [
    { signal: "SIGTERM", name: "SIGTERM" },
    { signal: "SIGINT", name: "SIGINT" },
    { signal: "SIGHUP", name: "SIGHUP" },
  ];

  for (const { signal, name } of handlers) {
    process.on(signal, () => {
      logger.info(`[+] Received signal: ${name}.`);
      cleanup(session, params);
      dependencies.setExitCode(0);
    });
  }
}

/** Cleanup (close session, close providers, cleanup temp files). */
function cleanup(session: Session, params: ShutdownParams): void {
  const { session: session_, dependencies, serverLogger } = params;

  // Close optional providers.
  if (params.closeOptionalProviders) {
    try {
      params.closeOptionalProviders();
    } catch (e: any) {
      serverLogger.warn(`[!] Optional provider cleanup failed: ${e.message}`);
    }
  }

  // Close session (session.open = false).
  if (session_.open) {
    try {
      const { closeSession } = require("../composition/session.js");
      closeSession(session_);
    } catch (e: any) {
      serverLogger.warn(`[!] Session cleanup failed: ${e.message}`);
    }
  }

  // Write logs (serverLogger.info("Session closed; exit=0").
  serverLogger.info(`[+] Cleanup complete (session=${session_.sessionId}).`);
}
