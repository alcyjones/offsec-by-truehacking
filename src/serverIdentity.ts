/**
 * OffSec by True Hacking — Server Identity Declaration.
 *
 * Mirrors REA's serverIdentity.ts: declares the server identity used
 * for tool catalogs, provenance, and MCP discovery.
 * See: https://github.com/morluto/rea/blob/main/src/serverIdentity.ts
 */

export const SERVER_IDENTITY = {
  /**
   * This value must match the "name" in server.json.
   * Used by MCP protocol as `server.name`.
   */
  id: "io.github.truehacking/offsec-by-truehacking",

  /**
   * Human-readable name used in MCP responses and CLI help.
   */
  title: "OffSec by True Hacking",

  /**
   * Semantic version of the server (matches server.json version).
   */
  version: "0.0.1",

  /**
   * Description used in MCP protocol (translated/visible to the caller).
   */
  description:
    "Pentest, CTI e segurança ofensiva — do terminal ou agente com uma CLI e servidor MCP.",

  /**
   * Website URL (GitHub).
   */
  websiteUrl:
    "https://github.com/truehacking/offsec-by-truehacking",
} as const;

/**
 * Build a complete server identity object from declared constants.
 * Used when generating MCP catalogs (server.json/digests).
 */
export function buildServerIdentity() {
  return {
    ...SERVER_IDENTITY,
    repository: {
      url: "https://github.com/truehacking/offsec-by-truehacking",
      source: "github" as const,
    },
    packages: [
      {
        registryType: "npm" as const,
        registryBaseUrl: "https://registry.npmjs.org",
        identifier: "offsec-by-truehacking",
        version: "0.0.1",
        runtimeHint: "npx" as const,
        transport: { type: "stdio" as const },
        packageArguments: [
          { type: "positional" as const, value: "mcp" },
        ],
      },
    ],
  };
}
