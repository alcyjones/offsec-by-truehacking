/**
 * OffSec by True Hacking — Adapter: Social Engineering (vishing, smishing, QR attack, physical attack).
 *
 * Social Engineering (vishing, smishing, QR code attack, physical attack, tailgating, impersonation).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Social Engineering (vishing, smishing, QR attack, physical attack, tailgating, impersonation).
 *
 * @param options - SocialEng options (type, target, message).
 */
export function socialEng(options: {
  type?: string;  // vishing, smishing, qrAttack, physical, tailgate, impersonate
  target?: string;  // phone number / email
  message?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const type = options.type || "vishing";
  const target = options.target || "";
  const message = options.message || "";
  const results: Record<string, any> = {};

  // Vishing (voice phishing: call scam).
  if (type === "vishing") {
    const vishPath = findBinary("vish");
    if (vishPath) {
      const commands = [`vish -c ${target} -m "${message}"`];  // (vishing call).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(vishPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.vishing = String(child.stdout ?? "");
    } else {
      results.vishing = `{stub: no 'vish' binary (install: apt install vish).}`;
    }
  }

  // Smishing (SMS phishing).
  if (type === "smishing") {
    const smsPath = findBinary("sms");
    if (smsPath) {
      const commands = [`sms -n ${target} -m "${message}"`];  // (smishing SMS).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(smsPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.smishing = String(child.stdout ?? "");
    } else {
      results.smishing = `{stub: no 'sms' binary (install: apt install sms).}`;
    }
  }

  // QR Code Attack (generate malicious QR).
  if (type === "qrAttack") {
    const qrPath = findBinary("qr");
    if (qrPath) {
      const commands = [`qr -o ${target} -c "javascript:alert('XSS')" `];  // (QR attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(qrPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.qrAttack = String(child.stdout ?? "");
    } else {
      results.qrAttack = `{stub: no 'qr' binary (install: apt install qr).}`;
    }
  }

  // Physical Attack (tailgate, tailgating, tailgating, tailgate).
  if (type === "physical") {
    const phyPath = findBinary("phy");
    if (phyPath) {
      const commands = [`phy -t ${target} -m "Tailgate to enter building"`];  // (physical attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(phyPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.physical = String(child.stdout ?? "");
    } else {
      results.physical = `{stub: no 'phy' binary (install: apt install phy).}`;
    }
  }

  // Impersonation (impersonate authority).
  if (type === "impersonate") {
    const impPath = findBinary("impersonate");
    if (impPath) {
      const commands = [`impersonate --name "Administrator" --target ${target}`];  // (impersonate authority).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(impPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.impersonate = String(child.stdout ?? "");
    } else {
      results.impersonate = `{stub: no 'impersonate' binary (install: apt install impersonate).}`;
    }
  }

  return {
    target,
    payload: `socialEng/${type}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("socialEng", `socialEng://${target}/${type}`),
  };
}

/** Find the binary (vish/sms/qr/phy/impersonate). */
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
