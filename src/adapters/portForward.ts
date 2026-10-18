/**
 * OffSec by True Hacking — Adapter: Port Forwarding (tunnel, port mapping, SSH tunnel, SOCKS proxy).
 *
 * Port forwarding (SSH tunnel, port mapping, proxy tunnel, local port forward).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Port Forwarding (tunnel, port mapping, SSH tunnel, SOCKS proxy, local port forward).
 *
 * @param options - PortForwarding options (tunnelType, localPort, remotePort, host).
 */
export function portForward(options: {
  tunnelType?: string;  // ssh, sock, proxy, local, remote
  localPort?: string;
  remotePort?: string;
  host?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const tunnelType = options.tunnelType || "ssh";
  const localPort = options.localPort || "8080";
  const remotePort = options.remotePort || "443";
  const host = options.host || "127.0.0.1";
  const results: Record<string, any> = {};

  // SSH Tunnel (local port forwarding via SSH).
  if (tunnelType === "ssh") {
    const sshPath = findBinary("ssh");
    if (sshPath) {
      const commands = [`ssh -L ${localPort}:${host}:${remotePort} root@${host}`];  // (SSH tunnel).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sshPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.sshTunnel = String(child.stdout ?? "");
    } else {
      results.sshTunnel = `{stub: no 'ssh' binary (install: brew install openssh).}`;
    }
  }

  // SOCKS Proxy (create SOCKS proxy over SSH).
  if (tunnelType === "socks") {
    const socksPath = findBinary("socat") || findBinary("ssh");
    if (socksPath) {
      const commands = [`ssh -D ${localPort} root@${host}`];  // (SOCKS proxy over SSH).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(socksPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.socks = String(child.stdout ?? "");
    } else {
      results.socks = `{stub: no 'ssh' or 'socat' binary (install: brew install socat).}`;
    }
  }

  // Port Mapping (map external port to internal port).
  if (tunnelType === "proxy") {
    const proxyPath = findBinary("iptables");
    if (proxyPath) {
      const commands = [`iptables -t nat -A PREROUTING -p tcp --dport ${localPort} -j REDIRECT --to-port ${remotePort}`];  // (port mapping).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(proxyPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.proxy = String(child.stdout ?? "");
    } else {
      results.proxy = `{stub: no 'iptables' binary (install: brew install iptables).}`;
    }
  }

  // Local Port Forward (forward local port to remote host).
  if (tunnelType === "local") {
    const localPath = findBinary("netcat");
    if (localPath) {
      const commands = [`nc -l ${localPort} | nc ${host} ${remotePort}`];  // (local port forward).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(localPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.local = String(child.stdout ?? "");
    } else {
      results.local = `{stub: no 'netcat' binary (install: brew install netcat).}`;
    }
  }

  return {
    target: host,
    payload: `portForward/${tunnelType}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("portForward", `portForward://${host}/${localPort}`),
  };
}

/** Find the binary (ssh/socat/iptables/netcat). */
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
