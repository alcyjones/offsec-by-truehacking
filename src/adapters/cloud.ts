/**
 * OffSec by True Hacking — Adapter: Cloud (IAM, S3, GCP, Azure exploitation).
 *
 * Cloud exploitation (IAM privileges, S3 bucket enumeration, GCP, Azure).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Cloud exploitation (IAM, S3, GCP, Azure, API keys).
 *
 * @param options - Cloud options (target, cloud, actions).
 */
export function cloud(options: {
  target: string;
  cloud: string;  // aws, gcp, azure
  actions?: string[];  // IAM, S3, bucket
  options?: Record<string, string>;
}): ExploitResult {
  const target = options.target;
  const cloud = options.cloud;
  const actions = options.actions || [];
  const results: Record<string, any> = {};

  // AWS (IAM enumeration, S3 bucket enumeration).
  if (cloud === "aws") {
    // IAM (enumerate IAM users, roles, policies).
    if (actions.includes("IAM")) {
      const awsPath = findBinary("aws");
      if (awsPath) {
        const commands = [`aws iam list-users`, `aws iam list-policies --scope Local`];
        const file = `${tmpdir()}/${randomUUID()}.sh`;
        writeFileSync(file, commands.join("\n"));
        const child = spawnSync(awsPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
        results.IAM = String(child.stdout ?? "");
      } else {
        results.IAM = `{stub: no 'aws' binary (install: brew install awscli).}`;
      }
    }

    // S3 (enumerate buckets).
    if (actions.includes("S3")) {
      const awsPath = findBinary("aws");
      if (awsPath) {
        const commands = [`aws s3 ls`, `aws s3api list-buckets`];
        const file = `${tmpdir()}/${randomUUID()}.sh`;
        writeFileSync(file, commands.join("\n"));
        const child = spawnSync(awsPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
        results.S3 = String(child.stdout ?? "");
      } else {
        results.S3 = `{stub: no 'aws' binary (install: brew install awscli).}`;
      }
    }
  }

  // GCP (Compute Engine, IAM, Cloud Storage).
  if (cloud === "gcp") {
    const gcloudPath = findBinary("gcloud");
    if (gcloudPath) {
      const commands = [`gcloud iam service-accounts list`, `gsutil ls gs://`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(gcloudPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.GCP = String(child.stdout ?? "");
    } else {
      results.GCP = `{stub: no 'gcloud' binary (install: brew install google-cloud-sdk).}`;
    }
  }

  // Azure (storage, IAM, API keys).
  if (cloud === "azure") {
    const azPath = findBinary("az");
    if (azPath) {
      const commands = [`az account list`, `az storage account list`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(azPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.Azure = String(child.stdout ?? "");
    } else {
      results.Azure = `{stub: no 'az' binary (install: brew install azure-cli).}`;
    }
  }

  return {
    target,
    payload: `cloud/${cloud}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("cloud", `cloud://${cloud}/${target}`),
  };
}

/** Find the binary (aws/gcloud/az). */
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
