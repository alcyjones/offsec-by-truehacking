/**
 * OffSec by True Hacking — Main: Messages (constants).
 *
 * Mirrors REA's src/main/messages.ts: defined error codes and messages
 * (startup failures).
 * See: https://github.com/morluto/rea/blob/main/src/main/messages.ts
 */

export const SERVER_START_FAILED = "[!] OffSec: failed to start server (internal error). See server.json and package.json.";
export const SESSION_OPEN_FAILED = "[!] OffSec: failed to open initial target (session).";
export const TRANSPORT_FAILED = "[!] OffSec: failed to start MCP transport (stdio).";
export const TOOL_HANDLER_FAILED = (name: string): string =>
  `[!] OffSec: tool handler failed for "${name}".`;
export const BAD_ENVIRONMENT = "[!] OffSec: invalid environment (env var missing).";
export const CONFIG_ERROR = (message: string): string =>
  `[!] OffSec: config error: ${message}`;
