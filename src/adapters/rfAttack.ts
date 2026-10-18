/**
 * OffSec by True Hacking — Adapter: Hardware/RF (RFID attack, Bluetooth attack, NFC attack, SDN attack).
 *
 * Hardware/RF (RFID attack, Bluetooth attack, NFC attack, SDN attack, Bluetooth Low Energy, Bluetooth Classic).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Hardware/RF (RFID attack, Bluetooth attack, NFC attack, SDN attack).
 *
 * @param options - RfAttack options (attackType, target, device).
 */
export function rfAttack(options: {
  attackType?: string;  // rfid, bluetooth, nfc, sdn
  target?: string;  // RFID tag UID, MAC address
  device?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const attackType = options.attackType || "rfid";
  const target = options.target || "";
  const device = options.device || "proxmark3";
  const results: Record<string, any> = {};

  // RFID Attack (clone RFID tag).
  if (attackType === "rfid") {
    const proxPath = findBinary("proxmark3");
    if (proxPath) {
      const commands = [`proxmark3 -r ${target} --clone`];  // (clone RFID).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(proxPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.rfid = String(child.stdout ?? "");
    } else {
      results.rfid = `{stub: no 'proxmark3' binary (install: brew install proxmark3).}`;
    }
  }

  // Bluetooth Attack (Bluejacking, BlueSmack, BLE attack).
  if (attackType === "bluetooth") {
    const btPath = findBinary("bt");
    if (btPath) {
      const commands = [`bt scan --mac ${target} --type ble`];  // (Bluetooth attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(btPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.bluetooth = String(child.stdout ?? "");
    } else {
      results.bluetooth = `{stub: no 'bt' binary (install: brew install bluetooth-tools).}`;
    }
  }

  // NFC Attack (clone NFC card).
  if (attackType === "nfc") {
    const nfcPath = findBinary("nfctool");
    if (nfcPath) {
      const commands = [`nfctool read --tag ${target}`];  // (clone NFC card).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(nfcPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.nfc = String(child.stdout ?? "");
    } else {
      results.nfc = `{stub: no 'nfctool' binary (install: apt install libnfc-tools).}`;
    }
  }

  // SDN Attack (Software Defined Network attack).
  if (attackType === "sdn") {
    const sdnPath = findBinary("sdn");
    if (sdnPath) {
      const commands = [`sdn attack --device ${device}`];  // (SDN attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sdnPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.sdn = String(child.stdout ?? "");
    } else {
      results.sdn = `{stub: no 'sdn' binary (install: apt install sdnsim).}`;
    }
  }

  return {
    target,
    payload: `rfAttack/${attackType}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("rfAttack", `rfAttack://${target}/${attackType}`),
  };
}

/** Find the binary (proxmark3/bt/nfctool/sdn). */
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
