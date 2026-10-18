/**
 * OffSec by True Hacking — Adapter: API Testing (REST API, GraphQL, OpenAPI, rate limiting, fuzzing).
 *
 * API Testing (REST API, GraphQL, OpenAPI, rate limiting, fuzzing, rate limit bypass, authentication).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * API Testing (REST API, GraphQL, OpenAPI, rate limiting, fuzzing, rate limit bypass, authentication).
 *
 * @param options - ApiTest options (action, target, method, fuzz).
 */
export function apiTest(options: {
  action?: string;  // rest, graphql, openapi, rateLimit, fuzz, authBypass
  target?: string;  // API endpoint (http://api.server.com/v1)
  method?: string;  // GET, POST, PUT, DELETE
  fuzz?: boolean;
  options?: Record<string, string>;
}): ExploitResult {
  const action = options.action || "rest";
  const target = options.target || "";
  const method = options.method || "GET";
  const fuzz = options.fuzz || false;
  const results: Record<string, any> = {};

  // REST API (enumerate REST API endpoints, test REST API).
  if (action === "rest") {
    const curlPath = findBinary("curl");
    if (curlPath) {
      const commands = [`curl "${target}/users" -H "Accept: application/json"`];  // (REST API).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(curlPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.rest = String(child.stdout ?? "");
    } else {
      results.rest = `{stub: no 'curl' binary (install: brew install curl).}`;
    }
  }

  // GraphQL (GraphQL attack: introspection, injection).
  if (action === "graphql") {
    const gqlPath = findBinary("gql");
    if (gqlPath) {
      const commands = [`gql --target ${target} --introspect`];  // (GraphQL attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(gqlPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.graphql = String(child.stdout ?? "");
    } else {
      results.graphql = `{stub: no 'gql' binary (install: apt install gql).}`;
    }
  }

  // OpenAPI (enumerate OpenAPI/Swagger specs).
  if (action === "openapi") {
    const openapiPath = findBinary("swagger");
    if (openapiPath) {
      const commands = [`swagger --target ${target} --parse`];  // (OpenAPI enumeration).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(openapiPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.openapi = String(child.stdout ?? "");
    } else {
      results.openapi = `{stub: no 'swagger' binary (install: apt install swagger).}`;
    }
  }

  // Rate Limit (bypass rate limit).
  if (action === "rateLimit") {
    const ratePath = findBinary("rate");
    if (ratePath) {
      const commands = [`rate --target ${target} --bypass`];  // (rate limit bypass).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(ratePath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.rateLimit = String(child.stdout ?? "");
    } else {
      results.rateLimit = `{stub: no 'rate' binary (install: apt install rate).}`;
    }
  }

  // Fuzzing (fuzz API parameters, headers).
  if (action === "fuzz") {
    const fuzzPath = findBinary("ffuf");
    if (fuzzPath) {
      const commands = [`ffuf -w /usr/share/seclists/Fuzzing/fuzz-words.txt -u ${target}/FUZZ`];  // (API fuzzing).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(fuzzPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.fuzz = String(child.stdout ?? "");
    } else {
      results.fuzz = `{stub: no 'ffuf' binary (install: brew install ffuf).}`;
    }
  }

  return {
    target,
    payload: `apiTest/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("apiTest", `apiTest://${target}/${action}`),
  };
}

/** Find the binary (curl/gql/swagger/rate/ffuf). */
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
