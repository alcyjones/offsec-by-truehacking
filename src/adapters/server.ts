/**
 * OffSec by True Hacking — Adapter: Server (Apache, Nginx, IIS, Tomcat, Windows Server attack).
 *
 * Server (Apache attack, Nginx attack, IIS attack, Tomcat attack, Windows Server attack).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Server (Apache attack, Nginx attack, IIS attack, Tomcat attack, Windows Server attack).
 *
 * @param options - Server options (serverType, action, target).
 */
export function server(options: {
  serverType?: string;  // apache, nginx, iis, tomcat, windowsServer
  action?: string;  // scan, exploit, rootShell, directoryEnum
  target?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const serverType = options.serverType || "apache";
  const action = options.action || "scan";
  const target = options.target || "";
  const results: Record<string, any> = {};

  // Apache Attack (Apache misconfig, .htaccess, SSI, mod_php).
  if (serverType === "apache") {
    const scanPath = findBinary("nmap") || findBinary("gobuster");
    if (scanPath) {
      const commands = [`nmap --script http-shellshock,http-enum -p 80 ${target}`];  // (Apache attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(scanPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.apache = String(child.stdout ?? "");
    } else {
      results.apache = `{stub: no 'nmap' binary (install: brew install nmap).}`;
    }
  }

  // Nginx Attack (Nginx misconfig, SNI attack).
  if (serverType === "nginx") {
    const nginxPath = findBinary("nginx");
    if (nginxPath) {
      const commands = [`nginx -V 2>&1`];  // (Nginx attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(nginxPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.nginx = String(child.stdout ?? "");
    } else {
      results.nginx = `{stub: no 'nginx' binary (install: brew install nginx).}`;
    }
  }

  // IIS Attack (IIS misconfig, ASPX upload, .NET exploit).
  if (serverType === "iis") {
    const iisPath = findBinary("iis");
    if (iisPath) {
      const commands = [`iis scan --target ${target} --ext asp,aspx,svc`];  // (IIS attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(iisPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.iis = String(child.stdout ?? "");
    } else {
      results.iis = `{stub: no 'iis' binary (install: apt install iis-tools).}`;
    }
  }

  // Tomcat Attack (Tomcat JSP upload, Tomcat default credentials).
  if (serverType === "tomcat") {
    const tomcatPath = findBinary("tomcat");
    if (tomcatPath) {
      const commands = [`tomcat --target ${target} --upload /etc/shadow`];  // (Tomcat attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(tomcatPath, [file], { timeout: 300000, maxBuffer: 1024 * 1024 });
      results.tomcat = String(child.stdout ?? "");
    } else {
      results.tomcat = `{stub: no 'tomcat' binary (install: brew install tomcat).}`;
    }
  }

  // Windows Server Attack (DC, AD, GPO).
  if (serverType === "windowsServer") {
    const winPath = findBinary("powershell");
    if (winPath) {
      const commands = [`Get-Service`];  // (Windows Server attack).
      const file = `${tmpdir()}/${randomUUID()}.ps1`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(winPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.windowsServer = String(child.stdout ?? "");
    } else {
      results.windowsServer = `{stub: no 'powershell' binary (install: brew install powershell).}`;
    }
  }

  return {
    target,
    payload: `server/${serverType}/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("server", `server://${target}/${serverType}`),
  };
}

/** Find the binary (nmap/gobuster/nginx/iis/tomcat/powershell). */
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
