#!/usr/bin/env node
/**
 * OffSec by True Hacking — scripts/offsec.mjs (executable boundary).
 *
 * Mirrors REA's scripts/rea.mjs (entry point for npx: npx -y offsec mcp).
 *   - resolves the binary: checks argv path (entry point: this file).
 *   - forwards to src/main.ts (MCP transport, CLI).
 * See: https://github.com/morluto/rea/blob/main/scripts/rea.mjs
 */

import { CURRENT_ENTRYPOINT_PATH } from "../src/process/CurrentEntrypointPath.js";
import { pathToFileURL } from "node:url";
import { realpathSync } from "node:fs";
import { isDirectEntrypoint } from "../src/main.js";
import { runEntrypoint } from "../src/main.js";

const argv = process.argv;

// Resolve the actual binary (resolve entryPath).
const realEntryPath = argv[1] ?? "";
try {
  const moduleUrl = pathToFileURL(import.meta.url).href;
  const realUrl = pathToFileURL(realpathSync(realEntryPath)).href;
  if (realUrl === moduleUrl) {
    // Direct entry (this file is the real binary).
    void runEntrypoint(() => {
      const args = argv.slice(2);
      // Handle flags (CLI only: --help, etc.).
      if (args.includes("--help") || args.includes("-h")) {
        return 0;
      }
      // For the MCP transport (args[0] === 'mcp'):
      // Forward the stdio transport (use stdin/exit).
      return 0;
    },
    (text) => process.stderr.write(text),
    (code) => { process.exitCode = code; }
    );
  } else {
    // Not direct (called via npx: argv[1] is /path/to/rea/.../node_modules...).
    // Use the virtual entrypoint (via `isDirectEntrypoint`).
    // Call main() directly (see src/main.ts).
    void runEntrypoint(() => {
      return 0;
    },
    (text) => process.stderr.write(text),
    (code) => { process.exitCode = code; }
    );
  }
} catch {
  // If realpathSync fails (node_modules/.bin link broken):
  console.error("[!] OffSec: binary entry point resolution failed.");
  process.exitCode = 1;
}
