/**
 * OffSec by True Hacking — Adapter: Phone (SS7 attack, SIM swap, smishing, vishing, phishing).
 *
 * Phone (SS7 attack, SIM swap, smishing, vishing, phishing, caller ID spoofing, call intercept).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Phone (SS7 attack, SIM swap, smishing, vishing, phishing, caller ID spoofing).
 *
 * @param options - Phone options (attackType, target, phone).
 */
export function phone(options: {
  attackType?: string;  // ss7, simSwap, smishing, vishing, phishing, callerId
  target?: string;  // phone number
  phone?: string;  // target phone
  options?: Record<string, string>;
}): ExploitResult {
  const attackType = options.attackType || "ss7";
  const target = options.target || "";
  const phone = options.phone || "";
  const results: Record<string, any> = {};

  // SS7 Attack (intercept calls, messages via SS7 protocol).
  if (attackType === "ss7") {
    const ss7Path = findBinary("ss7");
    if (ss7Path) {
      const commands = [`ss7 intercept --phone ${phone}`];  // (SS7 attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(ss7Path, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.ss7 = String(child.stdout ?? "");
    } else {
      results.ss7 = `{stub: no 'ss7' binary (install: apt install ss7-tools).}`;
    }
  }

  // SIM Swap (SIM swap fraud: take over victim's phone).
  if (attackType === "simSwap") {
    const simPath = findBinary("simswap");
    if (simPath) {
      const commands = [`simswap --phone ${phone} --operator carrierABC`];  // (SIM swap).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(simPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.simSwap = String(child.stdout ?? "");
    } else {
      results.simSwap = `{stub: no 'simswap' binary (install: apt install simswap).}`;
    }
  }

  // Smishing (SMS phishing).
  if (attackType === "smishing") {
    const smishPath = findBinary("smish");
    if (smishPath) {
      const commands = [`smish --phone ${phone} --body "You won $1000, click here"`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(smishPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.smishing = String(child.stdout ?? "");
    } else {
      results.smishing = `{stub: no 'smish' binary (install: apt install smish).}`;
    }
  }

  // Vishing (voice phishing).
  if (attackType === "vishing") {
    const vishPath = findBinary("vish");
    if (vishPath) {
      const commands = [`vish --phone ${phone} --voice "Security Alert: Your account is compromised"`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(vishPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.vishing = String(child.stdout ?? "");
    } else {
      results.vishing = `{stub: no 'vish' binary (install: apt install vish).}`;
    }
  }

  // Caller ID Spoofing (spoof caller ID).
  if (attackType === "callerId") {
    const spoofPath = findBinary("spoofCall");
    if (spoofPath) {
      const commands = [`spoofCall --from ${target} --to ${phone}`];  // (caller ID spoofing).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(spoofPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.callerId = String(child.stdout ?? "");
    } else {
      results.callerId = `{stub: no 'spoofCall' binary (install: apt install spoofCall).}`;
    }
  }

  return {
    target,
    payload: `phone/${attackType}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("phone", `phone://${phone || target}/${attackType}`),
  };
}

/** Find the binary (ss7/simswap/smish/vish/spoofCall). */
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
