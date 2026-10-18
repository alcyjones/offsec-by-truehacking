/**
 * OffSec by True Hacking — Adapter: Reporting (Penetration Report + Write).
 *
 * Generates a penetration report (findings, recommendations, CVSS scoring, executive summary).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync, existsSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Generate a penetration report (findings, recommendations, CVSS).
 *
 * @param options - Reporting options (target, scope, findings, executiveSummary).
 */
export function reporting(options: {
  target: string;
  scope?: string;
  findings?: Record<string, any>[];
  executiveSummary?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const scope = options.scope || "";
  const findings = options.findings || [];
  const executiveSummary = options.executiveSummary || "";

  const results: Record<string, any> = {};

  // Generate a report (Markdown/HTML/ASCII).
  const reportPath = findBinary("pandoc") || findBinary("report");
  if (reportPath) {
    const markdown = [
      `# Penetration Test Report: ${target}\n`,
      `## Scope: ${scope}\n`,
      `## Executive Summary\n`,
      `${executiveSummary || "No executive summary."}\n`,
      `## Findings\n`,
    ];
    for (const f of findings) {
      const cvss = (f.cvss || 0).toString();
      markdown.push(`\n### ${f.title || "Finding"} (CVSS ${cvss})\n`);
      markdown.push(f.details || "");
    }
    markdown.push(`\n## Recommendations\n`);

    const file = `${tmpdir()}/${randomUUID()}.md`;
    writeFileSync(file, markdown.join("\n"));

    const child = spawnSync(reportPath, [file, "-o", `${tmpdir()}/${randomUUID()}.html`], {
      timeout: 30000,
      maxBuffer: 1024 * 1024,
    });
    results.report = String(child.stdout ?? "");
  } else {
    results.report = `${markdownContent(target, scope, findings, executiveSummary)}\n`;
  }

  return {
    target,
    payload: `reporting/${scope}`,
    success: true,
    output: JSON.stringify(results),
    provenance: createProvenance("reporting", `reporting://${target}/${scope}`),
  };
}

/**
 * Write a report (PDF/HTML/markdown format).
 *
 * @param options - ReportWrite options (target, output, format).
 */
export function reportWrite(options: {
  target: string;
  output: string;  // file path for report
  format?: string;  // pdf, html, md
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const output = options.output;
  const format = options.format || "md";
  const results: Record<string, any> = {};

  const reportPath = findBinary("pandoc");
  if (reportPath) {
    const markdown = `# Report: ${target}\n## Scope\n---\n`;
    const file = `${tmpdir()}/${randomUUID()}.md`;
    writeFileSync(file, markdown);

    const outPath = `${tmpdir()}/${randomUUID()}.${format}`;
    const child = spawnSync(reportPath, [file, "-o", outPath], {
      timeout: 30000,
      maxBuffer: 1024 * 1024,
    });
    results.output = `${outPath}`;
    results.status = String(child.stdout ?? "");
  } else {
    results.output = `${output || "stdout"}`;
    results.format = `${format}`;
  }

  return {
    target,
    payload: `reportWrite/${format}`,
    success: true,
    output: JSON.stringify(results),
    provenance: createProvenance("reportWrite", `reportWrite://${target}/${format}`),
  };
}

/** Write markdown report content. */
function markdownContent(target: string, scope: string, findings: Record<string, any>[], executiveSummary: string): string {
  return `# Penetration Test Report: ${target}\n## Scope: ${scope}\n## Executive Summary\n${executiveSummary || "No executive summary."}\n## Findings\n---\n${findings.map(f => `\n### ${f.title || "Finding"} (CVSS ${(f.cvss || 0).toFixed(1)})\n${f.details || ""}`).join("\n")}`;
}

/** Find the binary (pandoc/report). */
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
