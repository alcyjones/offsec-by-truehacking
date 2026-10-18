/**
 * OffSec by True Hacking — Config: parseConfig.
 *
 * Mirrors REA's src/config/parseConfig.ts:
 *   - reads server.json (version, name, packages), parses env vars (optional --offline, --log-level).
 *   - returns: { ok: true, value: Config; } | { ok: false, error: AnalysisError }.
 * See: https://github.com/morluto/rea/blob/main/src/config/parseConfig.ts
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createServerIdentity } from "../serverIdentity.js";
import { buildCatalog } from "../catalogIdentity.js";
import type { Environment } from "../process/snapshotEnvironment.js";
import type { AnalysisError, AnalysisResult } from "../domain/analysisResultProjection.js";

export type Config = {
  /** Server identity (from server.json). */
  readonly identity: ReturnType<typeof createServerIdentity>;

  /** Tool catalog (from catalogIdentity). */
  readonly catalog: ReturnType<typeof buildCatalog>;

  /** Log level (env var: LOG_LEVEL). */
  readonly logLevel: string;

  /** Max bytes (env var: MCP_MAX_BYTES). */
  readonly mcpMaxResponseBytes: number;

  /** Offline (env var: OFFLINE). */
  readonly offline: boolean;

  /** Environment (snapshot). */
  readonly environment: Environment;
};

/** Parse configuration (from server.json + env). */
export function parseConfig(environment: Environment): AnalysisResult<Config> {
  const serverPath = resolve(".");
  const filePath = resolve(serverPath, "server.json");

  let serverJson;
  try {
    serverJson = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (e: any) {
    return {
      kind: "error",
      message: `server.json not found: ${filePath}. (${e.message})`,
      provenance: createProvenance("config", filePath),
    };
  }

  // Build identity/catalog.
  const identity = {
    ...createServerIdentity(),
    ...serverJson,
  };

  const catalog = buildCatalog();

  return {
    kind: "found",
    data: {
      identity,
      catalog,
      logLevel: environment.logLevel || "info",
      mcpMaxResponseBytes: environment.maxJsonBytes || 1048576,
      offline: environment.offline || false,
      environment,
    },
    provenance: createProvenance("config", filePath),
  };
}
