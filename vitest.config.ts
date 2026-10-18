/**
 * OffSec by True Hacking — Vitest config (projects).
 *
 * Mirrors REA's vitest.config.ts (projects: boundary/ acceptance/ + source only).
 * See: https://github.com/morluto/rea/blob/main/vitest.config.ts
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "src/**/*.test.ts",       // Source tests (unit: domain, config, server, cli, application).
      "tests/boundary/*.test.ts", // Boundary tests (calls adapters directly).
      "tests/acceptance/*.test.ts", // Acceptance tests (full pipeline).
    ],
    exclude: [
      "node_modules/**",
      "dist/**",
      ".cache/**",
      "src/generated/**",
      "tests/acceptance/**",  // (Acceptance tests: requires binaries; run via 'test:run' only).
    ],
    projects: [
      {
        name: "source",
        include: ["src/**/*.test.ts"],
        exclude: ["tests/**"],
        environment: "node",
      },
      {
        name: "boundary",
        include: ["tests/boundary/*.test.ts"],
        exclude: ["src/**/*.test.ts"],
        environment: "node",
      },
      {
        name: "acceptance",
        include: ["tests/acceptance/*.test.ts"],
        exclude: ["src/**/*.test.ts", "tests/boundary/**"],
        environment: "node",
        testTimeout: 300000,  // (5 minutes, if binaries present: scan/pcap/exploit).
      },
    ],
  },
});
