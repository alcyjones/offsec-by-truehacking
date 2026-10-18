/**
 * OffSec by True Hacking — Adapter: Incident Response (IR, forensics, triage, recovery).
 *
 * Incident Response (IR, triage, forensics, recovery, log analysis, log extraction, threat hunting).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Incident Response (IR, triage, forensics, recovery, log analysis, log extraction, threat hunting).
 *
 * @param options - IncidentResponse options (action, logPath, target, findings).
 */
export function incidentResponse(options: {
  action?: string;  // triage, forensics, recovery, logAnalysis, threatHunting, logExtraction
  logPath?: string;
  target?: string;
  findings?: Record<string, any>;
  options?: Record<string, string>;
}): ExploitResult {
  const action = options.action || "triage";
  const logPath = options.logPath || "/var/log";
  const target = options.target || "";
  const findings = options.findings || {};
  const results: Record<string, any> = {};

  // Triage (initial assessment).
  if (action === "triage") {
    const triagePath = findBinary("triage");
    if (triagePath) {
      const commands = [`triage --log-path ${logPath} --target ${target}`];
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(triagePath, [scriptFile], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.triage = String(child.stdout ?? "");
    } else {
      results.triage = `{stub: no 'triage' binary (install: apt install triage).}`;
    }
  }

  // Forensics (full forensics: memory, disk, network).
  if (action === "forensics") {
    const forensicsPath = findBinary("volatility") || findBinary("autopsy");
    if (forensicsPath) {
      const commands = [`volatility -f ${logPath}/memdump.dmp --profile Linux --dump dir`];
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(forensicsPath, [scriptFile], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.forensics = String(child.stdout ?? "");
    } else {
      results.forensics = `{stub: no 'volatility' or 'autopsy' binary (install: brew install volatility).}`;
    }
  }

  // Recovery (restore from backup, fix compromised hosts).
  if (action === "recovery") {
    const recoveryPath = findBinary("recovery");
    if (recoveryPath) {
      const commands = [`recovery --backup /opt/backup --target ${target}`];
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(recoveryPath, [scriptFile], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.recovery = String(child.stdout ?? "");
    } else {
      results.recovery = `{stub: no 'recovery' binary (install: apt install recovery).}`;
    }
  }

  // Log Analysis (parse logs: syslog, auth.log, Apache, Nginx).
  if (action === "logAnalysis") {
    const logPath = findBinary("awk") || findBinary("grep");
    if (logPath) {
      const commands = [`grep "failed" ${logPath}/auth.log | awk '{print $5}'`];
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(logPath, [scriptFile], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.logAnalysis = String(child.stdout ?? "");
    } else {
      results.logAnalysis = `{stub: no 'grep' binary (install: brew install coreutils).}`;
    }
  }

  // Threat Hunting (search for IOCs, indicators, commands).
  if (action === "threatHunting") {
    const huntPath = findBinary("hunt");
    if (huntPath) {
      const commands = [`hunt --log-path ${logPath} --ioc ${target}`];  // (hunt for IOCs).
      const scriptFile = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(scriptFile, commands.join("\n"));
      const child = spawnSync(huntPath, [scriptFile], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.threatHunting = String(child.stdout ?? "");
    } else {
      results.threatHunting = `{stub: no 'hunt' binary (install: apt install hunt).}`;
    }
  }

  return {
    target,
    payload: `incidentResponse/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("incidentResponse", `incidentResponse://${target}/${action}`),
  };
}

/** Find the binary (triage/volatility/autopsy/recovery/grep/hunt). */
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
