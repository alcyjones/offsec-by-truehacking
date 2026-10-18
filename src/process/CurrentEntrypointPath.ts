/**
 * OffSec by True Hacking — Process: CurrentEntrypointPath.
 *
 * Mirrors REA's src/process/CurrentEntrypointPath.ts:
 *   - retrieves CURRENT_ENTRYPOINT_PATH (from process.argv[1], node:realpathSync).
 * See: https://github.com/morluto/rea/blob/main/src/process/CurrentEntrypointPath.ts
 */

import { realpathSync } from "node:fs";

const argvPath = process.argv[1] ?? "";

let currentValue: string | undefined;

try {
  currentValue = realpathSync(argvPath);
} catch {
  currentValue = undefined;
}

export const CURRENT_ENTRYPOINT_PATH = currentValue;
