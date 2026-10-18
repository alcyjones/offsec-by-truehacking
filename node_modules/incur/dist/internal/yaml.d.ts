import type * as yaml from 'yaml';
/** Loads the `yaml` module on demand, so runs that never touch YAML don't pay its startup cost. */
export declare function load(): Promise<typeof yaml>;
/**
 * Synchronous variant of `load()` for sync call paths (e.g. `Formatter.format`).
 *
 * Falls back to `require` when `load()` hasn't run yet. Async paths should call `load()`
 * first so environments without synchronous module resolution (e.g. compiled binaries,
 * bundled workers) never hit the fallback.
 */
export declare function loadSync(): typeof yaml;
//# sourceMappingURL=yaml.d.ts.map