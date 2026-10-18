/**
 * OffSec by True Hacking — Server: Tool Result Delivery.
 *
 * Mirrors REA's src/server/toolResult.ts:
 *   - wraps a tool result (JSON-RPC: result or error).
 *   - respects max bytes (limited output).
 * See: https://github.com/morluto/rea/blob/main/src/server/toolResult.ts
 */

/** Deliver a tool result (limited to maxBytes). */
export function createToolResultDelivery(maxBytes: number): (result: any) => void {
  return (result: any) => {
    const json = JSON.stringify(result);
    if (json.length > maxBytes) {
      // Truncate (head + ellipsis + byte count).
      const truncated = json.substring(0, maxBytes);
      const original = json.length;
      process.stdout.write(`${truncated}... [truncated: ${original - maxBytes} bytes].\n`);
    } else {
      process.stdout.write(`${json}\n`);
    }
  };
}
