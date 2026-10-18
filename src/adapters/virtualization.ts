/**
 * OffSec by True Hacking — Adapter: Virtualization (VM escape, hypervisor attack).
 *
 * Virtualization (VM escape, hypervisor attack, container escape, VM snapshot attack).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Virtualization (VM escape, hypervisor attack, container escape, VM snapshot attack).
 *
 * @param options - Virtualization options (attackType, vmType, target).
 */
export function virtualization(options: {
  attackType?: string;  // vmEscape, hypervisor, containerEscape, snapshot
  vmType?: string;  // vmware, virtualbox, kvm, qemu
  target?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const attackType = options.attackType || "vmEscape";
  const vmType = options.vmType || "vmware";
  const target = options.target || "";
  const results: Record<string, any> = {};

  // VM Escape (escape from VM to host).
  if (attackType === "vmEscape") {
    const escapePath = findBinary("vmescape") || findBinary("qemu");
    if (escapePath) {
      const commands = [`vmescape --vm ${vmType} --host`];  // (VM escape).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(escapePath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.vmEscape = String(child.stdout ?? "");
    } else {
      results.vmEscape = `{stub: no 'vmescape' or 'qemu' binary (install: brew install qemu).}`;
    }
  }

  // Hypervisor Attack (attack the hypervisor: hyperjacking, hypervisor privilege escalation).
  if (attackType === "hypervisor") {
    const hypPath = findBinary("hypervisor");
    if (hypPath) {
      const commands = [`hypervisor attack --type hyperjacking --vm ${vmType}`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(hypPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.hypervisor = String(child.stdout ?? "");
    } else {
      results.hypervisor = `{stub: no 'hypervisor' binary (install: apt install hypervisor).}`;
    }
  }

  // Container Escape (from container to host).
  if (attackType === "containerEscape") {
    const cEscape = findBinary("nsenter") || findBinary("nsenter");
    if (cEscape) {
      const commands = [`nsenter -t 1 -m -u -i -n -p`];  // (container escape).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(cEscape, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.containerEscape = String(child.stdout ?? "");
    } else {
      results.containerEscape = `{stub: no 'nsenter' binary (install: brew install nsenter).}`;
    }
  }

  // VM Snapshot Attack (manipulate VM snapshots).
  if (attackType === "snapshot") {
    const snapPath = findBinary("vmdk");
    if (snapPath) {
      const commands = [`vmdk list --vm ${vmType}`];  // (snapshot attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(snapPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.snapshot = String(child.stdout ?? "");
    } else {
      results.snapshot = `{stub: no 'vmdk' binary (install: brew install vmdk).}`;
    }
  }

  return {
    target,
    payload: `virtualization/${attackType}/${vmType}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("virtualization", `virtualization://${target}/${attackType}/${vmType}`),
  };
}

/** Find the binary (vmescape/qemu/hypervisor/nsenter/vmdk). */
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
