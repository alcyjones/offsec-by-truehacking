/**
 * OffSec by True Hacking — Adapter: Email (phishing, spear phishing, DNS spoofing, email exploit, DKIM attack).
 *
 * Email (phishing, spear phishing, DNS spoofing, email exploit, DKIM attack, email header attack, mail relay).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Email (phishing, spear phishing, DNS spoofing, email exploit, DKIM attack, email header attack, mail relay).
 *
 * @param options - Email options (attackType, target, subject, body).
 */
export function email(options: {
  attackType?: string;  // phishing, spearPhishing, dnsSpoofing, emailExploit, dkim, emailHeader, mailRelay
  target?: string;  // email address
  subject?: string;
  body?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const attackType = options.attackType || "phishing";
  const target = options.target || "";
  const subject = options.subject || "";
  const body = options.body || "";
  const results: Record<string, any> = {};

  // Phishing (email phishing campaign).
  if (attackType === "phishing") {
    const mailPath = findBinary("sendmail") || findBinary("msmtp");
    if (mailPath) {
      const commands = [`echo "${body}" | sendmail -t -S ${target}`];  // (phishing).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(mailPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.phishing = String(child.stdout ?? "");
    } else {
      results.phishing = `{stub: no 'sendmail' or 'msmtp' binary (install: brew install msmtp).}`;
    }
  }

  // Spear Phishing (targeted email attack).
  if (attackType === "spearPhishing") {
    const spearPath = findBinary("spear");
    if (spearPath) {
      const commands = [`spear -target ${target} -subject "${subject}" -body "${body}"`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(spearPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.spearPhishing = String(child.stdout ?? "");
    } else {
      results.spearPhishing = `{stub: no 'spear' binary (install: apt install spear).}`;
    }
  }

  // DKIM Attack (bypass DKIM, tamper with DKIM).
  if (attackType === "dkim") {
    const dkimPath = findBinary("dkim");
    if (dkimPath) {
      const commands = [`dkim tamper --email ${target}`];  // (DKIM attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(dkimPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.dkim = String(child.stdout ?? "");
    } else {
      results.dkim = `{stub: no 'dkim' binary (install: apt install dkim).}`;
    }
  }

  // Email Header Attack (modify email headers).
  if (attackType === "emailHeader") {
    const hdrPath = findBinary("mailhack");
    if (hdrPath) {
      const commands = [`mailhack --from ${target} --header "X-Mailer: Microsoft Office Outlook"`];  // (header attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(hdrPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.emailHeader = String(child.stdout ?? "");
    } else {
      results.emailHeader = `{stub: no 'mailhack' binary (install: apt install mailhack).}`;
    }
  }

  // Mail Relay (relaying phishing emails via SMTP relay).
  if (attackType === "mailRelay") {
    const relayPath = findBinary("relay");
    if (relayPath) {
      const commands = [`relay --from ${target} --subject "${subject}"`];  // (mail relay).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(relayPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.mailRelay = String(child.stdout ?? "");
    } else {
      results.mailRelay = `{stub: no 'relay' binary (install: apt install mailrelay).}`;
    }
  }

  return {
    target,
    payload: `email/${attackType}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("email", `email://${target}/${attackType}`),
  };
}

/** Find the binary (sendmail/msmtp/spear/dkim/mailhack/relay). */
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
