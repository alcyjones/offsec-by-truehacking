/**
 * OffSec by True Hacking — Process: snapshotEnvironment.
 *
 * Mirrors REA's src/process/snapshotEnvironment.ts:
 *   - captures a snapshot of the current environment (process.env, paths, limits).
 *   - returns: { env, cwd, uid, gid, ...(process.getuid()) }.
 * See: https://github.com/morluto/rea/blob/main/src/process/snapshotEnvironment.ts
 */

import { platform, arch } from "node:process";
import { tmpdir } from "node:os";

export type Environment = {
  /** Full snapshot of environment variables (readable: no secrets redaction). */
  readonly env: Record<string, string>;

  /** Process ID (own PID). */
  readonly pid: number;

  /** UID/GID (current user). */
  readonly uid: number;
  readonly gid: number;

  /** Process arch (x86_64, arm64, etc.). */
  readonly arch: string;

  /** OS (platform: darwin, linux, win32). */
  readonly platform: string;

  /** TMP (tmp directory: env.TMPDIR or /tmp). */
  readonly tmpDir: string;

  /** User home (env.HOME or path.resolve(/path/to/userHome)). */
  readonly userHome: string;

  /** Max JSON bytes (max response length: 1MB default). */
  readonly maxJsonBytes: number;

  /** Log level (default: 'info'). */
  readonly logLevel: string;

  /** Optional flags: --offline (no external API calls). */
  readonly offline: boolean;
};

/** Snapshot the current environment. */
export function snapshotEnvironment(processEnv: Record<string, string>): Environment {
  return {
    env: processEnv,
    pid: process.pid,
    uid: process.getuid?.() || 0,
    gid: process.getgid?.() || 0,
    arch: arch(),
    platform: platform(),
    tmpDir: tmpdir(),
    userHome: processEnv.HOME ?? processEnv.USERPROFILE ?? ""
      .split("/").slice(0, -1).join("/") ?? "",
    maxJsonBytes: parseInt(processEnv.MCP_MAX_BYTES ?? "1048576") || 1048576,
    logLevel: processEnv.LOG_LEVEL ?? "info",
    offline: !!processEnv.OFFLINE || false,
  };
}
