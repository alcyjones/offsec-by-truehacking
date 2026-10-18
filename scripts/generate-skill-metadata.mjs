#!/usr/bin/env node
/**
 * OffSec by True Hacking — scripts/generate-skill-metadata.mjs.
 *
 * Mirrors REA's scripts/generate-skill-metadata.mjs:
 *   - reads .agents/skills/*.json (and writes .cache/skills/ and src/generated/).
 *   - validates: name, title, description, steps, parameters (required).
 * See: https://github.com/morluto/rea/blob/main/scripts/generate-skill-metadata.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const SKILLS_DIR = resolve(process.cwd(), ".agents/skills");
const CACHE_DIR = resolve(process.cwd(), ".cache/skills");
const GENERATED_DIR = resolve(process.cwd(), "src/generated/skills");

// Create directories (if not exists).
require("node:fs").mkdirSync(CACHE_DIR, { recursive: true });
require("node:fs").mkdirSync(GENERATED_DIR, { recursive: true });

// Read (and validate) all skill JSON files.
const skills = [];

const files = readdirSync(SKILLS_DIR).filter((f) => f.endsWith(".json"));
for (const file of files) {
  const path = join(SKILLS_DIR, file);
  try {
    const data = JSON.parse(readFileSync(path, "utf-8"));

    // Validate required fields.
    if (!data.name || !data.title || !data.description) {
      console.warn(`[!] ${file}: missing name/title/description (skip).`);
      continue;
    }

    // Validate steps (at least 1).
    if (!data.steps || data.steps.length === 0) {
      console.warn(`[!] ${file}: no steps (skip).`);
      continue;
    }

    const info = {
      name: data.name,
      title: data.title,
      description: data.description,
      category: data.category || "",
      steps: data.steps.map((s) => ({
        action: s.action || "",
        expected_output: s.expected_output || "",
        next: s.next || "",
      })),
      parameters: data.parameters || {},
      error_handling: data.error_handling || [],
    };

    // Write (cache).
    const outPath = join(CACHE_DIR, `${data.name}.json`);
    writeFileSync(outPath, JSON.stringify(info, null, 2));

    // Write (generated, catalog entry).
    const catalogEntry = {
      name: data.name,
      title: data.title,
      description: data.description,
      category: data.category,
      steps: data.steps.map((s) => ({
        action: s.action,
        expected_output: s.expected_output,
        next: s.next,
      })),
      parameters: data.parameters,
      error_handling: data.error_handling,
    };

    const genPath = join(GENERATED_DIR, `${data.name}.json`);
    writeFileSync(genPath, JSON.stringify(catalogEntry, null, 2));

    skills.push(info);
  } catch (e: any) {
    console.warn(`[!] ${file}: parse error: ${e.message}`);
  }
}

// Output (summary).
console.log(`[+] Generated ${skills.length} skills.`);
console.log(`    Cache: ${CACHE_DIR}`);
console.log(`    Generated: ${GENERATED_DIR}`);
