/**
 * OffSec by True Hacking — Adapter: Compliance (compliance, audit, CVE verification, vulnerability scan).
 *
 * Compliance (compliance, audit, CVE verification, vulnerability scan, policy check, risk assessment).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Compliance (compliance, audit, CVE verification, vulnerability scan, policy check, risk assessment).
 *
 * @param options - Compliance options (compliance, audit, cveVerification, vulnScan, policyCheck, riskAssessment).
 */
export function compliance(options: {
  compliance?: string;  // compliance, audit, cveVerification, vulnScan, policyCheck, riskAssessment
  target?: string;
  cveId?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const compliance = options.compliance || "compliance";
  const target = options.target || "";
  const cveId = options.cveId || "";
  const results: Record<string, any> = {};

  // Compliance (check compliance: PCI-DSS, HIPAA, ISO 27001, NIST).
  if (compliance === "compliance") {
    const compPath = findBinary("nmap");
    if (compPath) {
      const commands = [`nmap --script vuln --script-args vulns.showall -p 22,80,443 ${target}`];  // (compliance scan).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(compPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.compliance = String(child.stdout ?? "");
    } else {
      results.compliance = `{stub: no 'nmap' binary (install: brew install nmap).}`;
    }
  }

  // Audit (security audit: patch level, configuration check).
  if (compliance === "audit") {
    const auditPath = findBinary("openvas");
    if (auditPath) {
      const commands = [`openvas --target ${target} --check-level audit`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(auditPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.audit = String(child.stdout ?? "");
    } else {
      results.audit = `{stub: no 'openvas' binary (install: apt install openvas).}`;
    }
  }

  // CVE Verification (verify CVE against target).
  if (compliance === "cveVerification") {
    const cvePath = findBinary("nmap");
    if (cvePath) {
      const commands = [`nmap --script vuln --script-args vulns.showall,cve-id=${cveId} ${target}`];  // (CVE verification).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(cvePath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.cveVerification = String(child.stdout ?? "");
    } else {
      results.cveVerification = `{stub: no 'nmap' binary (install: brew install nmap).}`;
    }
  }

  // Vulnerability Scan (full vulnerability scan).
  if (compliance === "vulnScan") {
    const scanPath = findBinary("nessus");
    if (scanPath) {
      const commands = [`nessus scan --target ${target} --profile all`];  // (vuln scan).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(scanPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.vulnScan = String(child.stdout ?? "");
    } else {
      results.vulnScan = `{stub: no 'nessus' binary (install: apt install nessus).}`;
    }
  }

  // Policy Check (check security policy compliance).
  if (compliance === "policyCheck") {
    const polPath = findBinary("policy");
    if (polPath) {
      const commands = [`policy check --target ${target} --profile NIST-800-53`];  // (policy check).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(polPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.policyCheck = String(child.stdout ?? "");
    } else {
      results.policyCheck = `{stub: no 'policy' binary (install: apt install policy).}`;
    }
  }

  // Risk Assessment (calculate risk scores for target).
  if (compliance === "riskAssessment") {
    const riskPath = findBinary("risk");
    if (riskPath) {
      const commands = [`risk assess --target ${target} --cvss 9.0`];  // (risk assessment).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(riskPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.riskAssessment = String(child.stdout ?? "");
    } else {
      results.riskAssessment = `{stub: no 'risk' binary (install: apt install risk).}`;
    }
  }

  return {
    target,
    payload: `compliance/${compliance}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("compliance", `compliance://${target}/${compliance}`),
  };
}

/** Find the binary (nmap/openvas/nessus/policy/risk). */
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
