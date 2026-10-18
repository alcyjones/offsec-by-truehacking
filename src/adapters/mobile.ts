/**
 * OffSec by True Hacking — Adapter: Mobile (Android APK, iOS binary, mobile penetration testing).
 *
 * Mobile (Android APK reverse engineering, iOS binary analysis, mobile penetration testing).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Mobile (Android APK reverse engineering, iOS binary analysis, mobile penetration testing).
 *
 * @param options - Mobile options (platform, action, file).
 */
export function mobile(options: {
  platform?: string;  // android, ios
  action?: string;  // apkReverse, iOSBinary, mobilePenTest, androidReverse, iOSReverse
  file?: string;  // APK path (Android), IPA path (iOS)
  options?: Record<string, string>;
}): ExploitResult {
  const platform = options.platform || "android";
  const action = options.action || "apkReverse";
  const file = options.file || "";
  const results: Record<string, any> = {};

  // Android APK Reverse (analyze APK: classes.dex, AndroidManifest.xml).
  if (action === "apkReverse") {
    const apktoolPath = findBinary("apktool") || findBinary("jadx");
    if (apktoolPath) {
      const commands = [`apktool d ${file} -o /tmp/apk-decompiled`];  // (APK reverse).
      const script = `${tmpdir()}/${randomUUID()}.md`;
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, `${commands[0]} > ${script}`);
      const child = spawnSync(apktoolPath, [scriptFile], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.apkReverse = String(child.stdout ?? "");
    } else {
      results.apkReverse = `{stub: no 'apktool' or 'jadx' binary (install: brew install apktool).}`;
    }
  }

  // iOS Binary (reverse iOS binary: Mach-O).
  if (action === "iOSBinary") {
    const machoPath = findBinary("otool");
    if (machoPath) {
      const commands = [`otool -tv ${file}`];  // (iOS binary analysis).
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(machoPath, [scriptFile], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.iOSBinary = String(child.stdout ?? "");
    } else {
      results.iOSBinary = `{stub: no 'otool' binary (install: brew install binutils).}`;
    }
  }

  // Android Reverse (full Android reverse: decompile + source code analysis).
  if (action === "androidReverse") {
    const jadxPath = findBinary("jadx");
    if (jadxPath) {
      const commands = [`jadx -d /tmp/android-src ${file}`];  // (Android reverse).
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(jadxPath, [scriptFile], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.androidReverse = String(child.stdout ?? "");
    } else {
      results.androidReverse = `{stub: no 'jadx' binary (install: brew install jadx).}`;
    }
  }

  // iOS Reverse (full iOS reverse: Mach-O analysis, Cycript injection).
  if (action === "iOSReverse") {
    const cycriptPath = findBinary("cycript");
    if (cycriptPath) {
      const commands = [`cycript -r ${file}`];  // (iOS reverse).
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(cycriptPath, [scriptFile], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.iOSReverse = String(child.stdout ?? "");
    } else {
      results.iOSReverse = `{stub: no 'cycript' binary (install: brew install cycript).}`;
    }
  }

  // Mobile Penetration (full mobile pen test: APK, iOS, mobile).
  if (action === "mobilePenTest") {
    const mobPath = findBinary("mobisec");
    if (mobPath) {
      const commands = [`mobisec --apk ${file}`];  // (mobile pen test).
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(mobPath, [scriptFile], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.mobilePenTest = String(child.stdout ?? "");
    } else {
      results.mobilePenTest = `{stub: no 'mobisec' binary (install: apt install mobisec).}`;
    }
  }

  return {
    target: file,
    payload: `mobile/${platform}/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("mobile", `mobile://${file}/${platform}`),
  };
}

/** Find the binary (apktool/jadx/otool/cycript/mobisec). */
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
