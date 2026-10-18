/**
 * OffSec by True Hacking — Adapter: OSINT (Open Source Intel: username, email, phone, social).
 *
 * OSINT (Open Source Intel: username search, email lookup, phone, social media, address).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Open Source Intel (username search, email lookup, phone, social media, address).
 *
 * @param options - OSINT options (target, search, provider).
 */
export function osint(options: {
  target: string;
  search?: string;  // username, email, phone, social, address
  provider?: string;  // haveibeenpwned, hunter, intelx, thehive
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const search = options.search || "username";
  const provider = options.provider || "haveibeenpwned";
  const results: Record<string, any> = {};

  // Username search (check username on social platforms).
  if (search === "username") {
    const usernamePath = findBinary("breach");
    if (usernamePath) {
      const commands = [`breach -u ${target}`];  // (check username).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(usernamePath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.username = String(child.stdout ?? "");
    } else {
      results.username = `{stub: no 'breach' binary (install: apt install breach).}`;
    }
  }

  // Email (look up email: haveibeenpwned, hunter).
  if (search === "email") {
    const hunterPath = findBinary("curl");
    if (hunterPath) {
      const commands = [`curl -X POST "${process.env.HUNTER_API_KEY ? 'https://api.hunter.io/v2/search' : 'https://target.example'}" -H "Authorization: Bearer ${process.env.HUNTER_API_KEY || ''}" -d '{"email":"${target}"}'`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(hunterPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.email = String(child.stdout ?? "");
    } else {
      results.email = `{stub: no 'curl' binary (install: brew install curl).}`;
    }
  }

  // Phone (phone lookup: validate, carrier, location).
  if (search === "phone") {
    const phonePath = findBinary("phonenum");
    if (phonePath) {
      const commands = [`phonenum validate ${target}`];  // (validate phone).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(phonePath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.phone = String(child.stdout ?? "");
    } else {
      results.phone = `{stub: no 'phonenum' binary (install: apt install phonenum).}`;
    }
  }

  // Social (social media: LinkedIn, Twitter, Facebook, Instagram).
  if (search === "social") {
    const socialPath = findBinary("social");
    if (socialPath) {
      const commands = [`social search -u ${target}`];  // (search social media).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(socialPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.social = String(child.stdout ?? "");
    } else {
      results.social = `{stub: no 'social' binary (install: apt install social).}`;
    }
  }

  // Address (geolocation: reverse geocoding).
  if (search === "address") {
    const geoPath = findBinary("geo");
    if (geoPath) {
      const commands = [`geo reverse ${target}`];  // (reverse geocoding).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(geoPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.address = String(child.stdout ?? "");
    } else {
      results.address = `{stub: no 'geo' binary (install: apt install geo).}`;
    }
  }

  return {
    target,
    payload: `osint/${search}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("osint", `osint://${target}/${search}`),
  };
}

/** Find the binary (breach/curl/phonenum/social/geo). */
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
