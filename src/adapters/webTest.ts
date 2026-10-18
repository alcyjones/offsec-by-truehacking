/**
 * OffSec by True Hacking — Adapter: Web Testing (XSS, CSRF, SSRF, SSI, Server-Side Template Injection).
 *
 * Web Testing (XSS, CSRF, SSRF, SSI, SSTI, SSRF, SSRF, SSRF, SSRF, SSRF...).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Web Testing (XSS, CSRF, SSRF, SSI, SSTI).
 *
 * @param options - WebTest options (attackType, target, payload).
 */
export function webTest(options: {
  attackType?: string;  // xss, csrf, ssrf, ssi, ssti, fileUpload, directoryTraverse
  target?: string;  // URL (http://target/path)
  payload?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const attackType = options.attackType || "xss";
  const target = options.target || "";
  const payload = options.payload || "";
  const results: Record<string, any> = {};

  // XSS (reflected, stored, DOM-based XSS).
  if (attackType === "xss") {
    const burpPath = findBinary("curl");
    if (burpPath) {
      const commands = [`curl "${target}?q=<script>alert('XSS')</script>" -v`];  // (XSS).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(burpPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.xss = String(child.stdout ?? "");
    } else {
      results.xss = `{stub: no 'curl' binary (install: brew install curl).}`;
    }
  }

  // CSRF (Cross-Site Request Forgery: tokens, state machine).
  if (attackType === "csrf") {
    const csrfPath = findBinary("ngspot") || findBinary("csrf");
    if (csrfPath) {
      const commands = [`csrf --target ${target}`];  // (CSRF attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(csrfPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.csrf = String(child.stdout ?? "");
    } else {
      results.csrf = `{stub: no 'csrf' binary (install: apt install csrf).}`;
    }
  }

  // SSRF (Server-Side Request Forgery).
  if (attackType === "ssrf") {
    const ssrfPath = findBinary("ssrf");
    if (ssrfPath) {
      const commands = [`ssrf --target ${target} --local`];  // (SSRF).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(ssrfPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.ssrf = String(child.stdout ?? "");
    } else {
      results.ssrf = `{stub: no 'ssrf' binary (install: apt install ssrf).}`;
    }
  }

  // SSI (Server-Side Include injection).
  if (attackType === "ssi") {
    const ssiPath = findBinary("ssiscanner");
    if (ssiPath) {
      const commands = [`ssiscanner -u ${target}`];  // (SSI).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(ssiPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.ssi = String(child.stdout ?? "");
    } else {
      results.ssi = `{stub: no 'ssiscanner' binary (install: apt install ssiscanner).}`;
    }
  }

  // SSTI (Server-Side Template Injection).
  if (attackType === "ssti") {
    const sstiPath = findBinary("ssti");
    if (sstiPath) {
      const commands = [`ssti --target ${target}`];  // (SSTI).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sstiPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.ssti = String(child.stdout ?? "");
    } else {
      results.ssti = `{stub: no 'ssti' binary (install: apt install ssti).}`;
    }
  }

  return {
    target,
    payload: `webTest/${attackType}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("webTest", `webTest://${target}/${attackType}`),
  };
}

/** Find the binary (curl/ngspot/csrf/ssrf/ssriscanner/ssti). */
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
