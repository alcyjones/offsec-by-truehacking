#!/usr/bin/env node
/**
 * OffSec by True Hacking — scripts/run-exclusive.mjs.
 *
 * Mirrors REA's scripts/run-exclusive.mjs (Turborepo exclusive runners).
 *   - filters a list of tasks (no duplicate, no collapsed).
 *   - example: turborepo run test:build -- --project=src/|cli|server|domain.
 * See: https://github.com/morluto/rea/blob/main/scripts/run-exclusive.mjs
 */

import { execFileSync } from "node:child_process";

const TASKS = ["test:build", "test:run", "docs:generate", "typecheck", "lint:built"];

const args = process.argv.slice(2);

// Filter (if args match --project=xxx): extract the project list.
const filter = args.find((a) => a.startsWith("--project"));
if (filter) {
  const projects = filter.replace("--project=", "").split(",");
  console.log(`[+] Running projects: ${projects.join(",")}`);
}

// Run the tasks (call turborepo tasks).
for (const task of TASKS) {
  try {
    execFileSync("npx", ["turbo", task, ...args], { stdio: "inherit" });
  } catch (e: any) {
    console.error(`[!] Task ${task} failed: ${e.message}`);
    process.exitCode = 1;
  }
}
