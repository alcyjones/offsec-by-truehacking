/**
 * OffSec by True Hacking — Main: Transport (MCP stdio transport).
 *
 * Mirrors REA's src/main/transport.ts:
 *   - starts stdio (MCP: JSON-RPC 2.0, stdin/stdout).
 *   - handles JSON-RPC requests (params → TOOLS), returns results (JSON).
 * See: https://github.com/morluto/rea/blob/main/src/main/transport.ts
 */

import type { Session } from "../composition/session.js";
import type { Config } from "../config/parseConfig.js";
import type { Logger as PinoLogger } from "pino";
import type { RuntimeDependencies } from "../main/types.js";

export type Transport = {
  /** Handle (session + tools). */
  readonly handle: any;

  /** Close optional providers (cleanup). */
  readonly closeOptionalProviders: () => Promise<void>;
};

export type TransportResult = {
  ok: boolean;
  exitCode?: number;
  message?: string;
};

/**
 * Start the MCP transport (stdin/stdio).
 *
 * @param dependencies - Runtime dependencies (serve: stdio).
 * @param session - Open session (persistent).
 * @param options - Config (logger, delivery).
 */
export async function startMcpTransport(
  dependencies: RuntimeDependencies,
  session: Session,
  options: {
    logger: typeof import("pino").Logger;
    serverLogger: typeof import("pino").Logger;
    environment: Record<string, string>;
    delivery: (result: any) => void;
    loadOptionalProviders?: () => Promise<any>;
  },
): Promise<TransportResult> {
  const { serve, writeStderr, setExitCode } = dependencies;

  const { getTool, executeTool } = await import("../server/tools.js");

  // Create the transport (stdin/stdio JSON-RPC 2.0 handler).
  const transport = await serve(({ message }: any) => {
    // Parse the JSON-RPC message.
    try {
      const { id, method, params } = message.jsonrpc ? message : message;

      // Call the tool (if method matches a tool name).
      const handler = getTool(method);
      if (!handler) {
        const response = { jsonrpc: "2.0", id, error: { code: -32601, message: `Tool not found: "${method}"` } };
        process.stdout.write(`${JSON.stringify(response)}\n`);
        return;
      }

      // Execute (handler).
      const result = await executeTool(method, params);
      const response = { jsonrpc: "2.0", id, result };
      process.stdout.write(`${JSON.stringify(response)}\n`);
    } catch (e: any) {
      const response = { jsonrpc: "2.0", id: message.id ?? null, error: { code: -32603, message: String(e.message || e) } };
      process.stdout.write(`${JSON.stringify(response)}\n`);
    }
  });

  return { ok: true, handle: transport, closeOptionalProviders: async () => {} };
}

/** Create a tool result delivery (limited to max bytes). */
export function createToolResultDelivery(maxBytes: number): (result: any) => void {
  const buffer = "";

  return (result: any) => {
    if (JSON.stringify(result).length > maxBytes) {
      const limited = JSON.stringify(result).substring(0, maxBytes);
      process.stdout.write(`${limited}... [truncated: ${result.length - maxBytes} bytes].\n`);
    } else {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  };
}
