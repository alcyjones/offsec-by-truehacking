/**
 * OffSec by True Hacking — Logger (pino logger wrapper).
 *
 * Mirrors REA's src/logger.ts: creates a pino logger (named, level, child).
 * See: https://github.com/morluto/rea/blob/main/src/logger.ts
 */

import pino, { type Logger as PinoLogger, type Level } from "pino";

const DEFAULT_LEVEL = "info" as Level;

export const logger = pino({
  name: "offsec",
  level: DEFAULT_LEVEL,
  formatters: {
    bindings: (b: Record<string, any>) => ({ ...b, tool: "offsec" }),
  },
});

/** Create a logger (named, with level). */
export function createLogger(name: string, level: Level = DEFAULT_LEVEL): PinoLogger {
  return logger.child({ layer: name, level });
}
