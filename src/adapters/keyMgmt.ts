/**
 * OffSec by True Hacking — Adapter: Key Management (certificate attack, PFX attack, cert harvesting).
 *
 * Key Management (certificate attack, PFX attack, cert harvesting, PKCS attack, key logging, key theft).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Key Management (certificate attack, PFX attack, cert harvesting, PKCS attack, key logging).
 *
 * @param options - KeyMgmt options (attackType, certPath, target).
 */
export function keyMgmt(options: {
  attackType?: string;  // certAttack, pfxAttack, certHarvest, pkcs, keyLog, keyTheft
  certPath?: string;  // certificate file (PEM, PFX, DER)
  target?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const attackType = options.attackType || "certAttack";
  const certPath = options.certPath || "";
  const target = options.target || "";
  const results: Record<string, any> = {};

  // Certificate Attack (exploit cert misconfig: weak cipher, expired cert).
  if (attackType === "certAttack") {
    const certPath2 = findBinary("openssl");
    if (certPath2) {
      const commands = [`openssl x509 -in ${certPath} -text`];  // (cert analysis).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(certPath2, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.certAttack = String(child.stdout ?? "");
    } else {
      results.certAttack = `{stub: no 'openssl' binary (install: brew install openssl).}`;
    }
  }

  // PFX Attack (extract PFX certificate, extract password).
  if (attackType === "pfxAttack") {
    const pfxPath = findBinary("pfx");
    if (pfxPath) {
      const commands = [`pfx extract --file ${certPath}`];  // (PFX attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(pfxPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.pfxAttack = String(child.stdout ?? "");
    } else {
      results.pfxAttack = `{stub: no 'pfx' binary (install: apt install openssl).}`;
    }
  }

  // Certificate Harvesting (dump all certs from target).
  if (attackType === "certHarvest") {
    const harvPath = findBinary("certHarvest");
    if (harvPath) {
      const commands = [`certHarvest --target ${target}`];  // (harvest certs).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(harvPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.certHarvest = String(child.stdout ?? "");
    } else {
      results.certHarvest = `{stub: no 'certHarvest' binary (install: apt install certHarvest).}`;
    }
  }

  // Key Theft (steal private key from target).
  if (attackType === "keyTheft") {
    const keyPath = findBinary("keyTheft");
    if (keyPath) {
      const commands = [`keyTheft --target ${target} --key /etc/ssl/private/key.pem`];  // (key theft).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(keyPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.keyTheft = String(child.stdout ?? "");
    } else {
      results.keyTheft = `{stub: no 'keyTheft' binary (install: apt install keyTheft).}`;
    }
  }

  return {
    target,
    payload: `keyMgmt/${attackType}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("keyMgmt", `keyMgmt://${certPath || target}/${attackType}`),
  };
}

/** Find the binary (openssl/pfx/certHarvest/keyTheft). */
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
