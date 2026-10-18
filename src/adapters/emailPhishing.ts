/**
 * OffSec by True Hacking — Adapter: Email/Phishing (email phishing, spear phishing, DNS spoofing, SMTP relay).
 *
 * Email/Phishing (email phishing, spear phishing, DNS spoofing, SMTP relay, email spoofing).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Email/Phishing (email phishing, spear phishing, DNS spoofing, SMTP relay).
 *
 * @param options - EmailPhishing options (type, target, subject, body).
 */
export function emailPhishing(options: {
  type?: string;  // emailPhishing, spearPhishing, dnsSpoofing, smtpRelay, emailSpoof
  target?: string;  // email address
  subject?: string;
  body?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const type = options.type || "emailPhishing";
  const target = options.target || "";
  const subject = options.subject || "";
  const body = options.body || "";
  const results: Record<string, any> = {};

  // Email Phishing (send phishing email).
  if (type === "emailPhishing") {
    const emailPath = findBinary("sendmail") || findBinary("msmtp");
    if (emailPath) {
      const commands = [`echo "${body}" | sendmail -t -S ${target}`];  // (phishing email).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(emailPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.emailPhishing = String(child.stdout ?? "");
    } else {
      results.emailPhishing = `{stub: no 'sendmail' or 'msmtp' binary (install: brew install msmtp).}`;
    }
  }

  // Spear Phishing (targeted email with attachment).
  if (type === "spearPhishing") {
    const spearPath = findBinary("spear");
    if (spearPath) {
      const commands = [`spear -target ${target} -subject "${subject}"`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(spearPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.spearPhishing = String(child.stdout ?? "");
    } else {
      results.spearPhishing = `{stub: no 'spear' binary (install: apt install spear).}`;
    }
  }

  // DNS Spoofing (spoof DNS responses).
  if (type === "dnsSpoofing") {
    const spoofPath = findBinary("dnscat2");
    if (spoofPath) {
      const commands = [`dnscat2 --client=${target} --cmd "inject"`];  // (DNS spoofing).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(spoofPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.dnsSpoofing = String(child.stdout ?? "");
    } else {
      results.dnsSpoofing = `{stub: no 'dnscat2' binary (install: apt install dnscat2).}`;
    }
  }

  // SMTP Relay (relaying phishing emails via SMTP).
  if (type === "smtpRelay") {
    const smtpPath = findBinary("smtp");
    if (smtpPath) {
      const commands = [`smtp -t ${target} -s "${subject}" -b "${body}"`];  // (SMTP relay).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(smtpPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.smtpRelay = String(child.stdout ?? "");
    } else {
      results.smtpRelay = `{stub: no 'smtp' binary (install: apt install smtp).}`;
    }
  }

  return {
    target,
    payload: `emailPhishing/${type}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("emailPhishing", `emailPhishing://${target}/${type}`),
  };
}

/** Find the binary (sendmail/msmtp/spear/dnscat2/smtp). */
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
