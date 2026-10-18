/**
 * OffSec by True Hacking — Process: ProcessShutdown (register handlers).
 *
 * Mirrors REA's src/process/processShutdown.ts:
 *   - registers SIGTERM/SIGINT/SIGHUP/EOF handlers (global, once).
 *   - preserves shutdown handlers (no duplication).
 * See: https://github.com/morluto/rea/blob/main/src/process/processShutdown.ts
 */

export function registerProcessShutdown(
  handler: (signal: string) => void,
): void {
  const handlers = ["SIGTERM", "SIGINT", "SIGHUP", "EOF"];

  for (const signal of handlers) {
    const existing = process.listeners(signal);
    const already = existing.some((h: any) => h === handler);
    if (!already) {
      process.on(signal, handler);
    }
  }
}
