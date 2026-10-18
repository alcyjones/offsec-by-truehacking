/**
 * OffSec by True Hacking — Main: Types (RuntimeDependencies).
 *
 * Mirrors REA's src/main/types.ts:
 *   - defined RuntimeDependencies: env, serve, writeStderr, setExitCode, registerShutdown.
 * See: https://github.com/morluto/rea/blob/main/src/main/types.ts
 */

import type { Logger as PinoLogger } from "pino";

export type RuntimeDependencies = {
  /** Full snapshot of environment variables. */
  readonly env: Record<string, string>;

  /** Serve MCP transport (stdio/stdout). */
  readonly serve: (handle: any) => Promise<any>;

  /** Write to stderr (human-readable output). */
  readonly writeStderr: (text: string) => void;

  /** Set exit code (process.exitCode = code). */
  readonly setExitCode: (code: number) => void;

  /** Register shutdown (signal handler: SIGTERM, SIGINT, SIGHUP). */
  readonly registerShutdown: (handler: (signal: string) => void) => void;

  /** Optional provider loaders (for optional tools). */
  readonly loadOptionalProviders?: () => Promise<any>;
};
