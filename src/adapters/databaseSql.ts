/**
 * OffSec by True Hacking — Adapter: Database/SQL (SQL Injection, MySQL, PostgreSQL, MongoDB, Redis, Cassandra, Graph).
 *
 * Database/SQL (SQLi, MySQL, PostgreSQL, Oracle, MongoDB, Redis, Cassandra, GraphDB, NoSQL injection).
 * See: https://github.com/morluto/rea/blob/main/src/adapter/
 */

import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

import type { ExploitResult, Provenance } from "../domain/analysisResultProjection.js";

/**
 * Database/SQL (SQLi, MySQL, PostgreSQL, Oracle, MongoDB, Redis, Cassandra, GraphDB, NoSQL).
 *
 * @param options - DatabaseSql options (dbType, action, target, query).
 */
export function databaseSql(options: {
  dbType?: string;  // sql, mysql, postgres, oracle, mongo, redis, cassandra, graph
  action?: string;  // sqli, union, blind, time, stored, noSql, count, dbEnum
  target?: string;  // host:port
  query?: string;
  options?: Record<string, string>;
}): ExploitResult {
  const dbType = options.dbType || "sql";
  const action = options.action || "sqli";
  const target = options.target || "";
  const query = options.query || "";
  const results: Record<string, any> = {};

  // SQL Injection (query SQL: UNION, blind, time-based, error).
  if (action === "sqli") {
    const sqlPath = findBinary("sqlmap");
    if (sqlPath) {
      const commands = [`sqlmap -u "${target}" --dbs`];  // (SQLi enumeration).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(sqlPath, [file], { timeout: 600000, maxBuffer: 1024 * 1024 });
      results.sqli = String(child.stdout ?? "");
    } else {
      results.sqli = `{stub: no 'sqlmap' binary (install: brew install sqlmap).}`;
    }
  }

  // MySQL Attack (MySQL brute force, enumeration).
  if (dbType === "mysql") {
    const mysqlPath = findBinary("mysql");
    if (mysqlPath) {
      const commands = [`mysql -h ${target} -u root -p password --database information_schema`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(mysqlPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.mysql = String(child.stdout ?? "");
    } else {
      results.mysql = `{stub: no 'mysql' binary (install: brew install mysql-client).}`;
    }
  }

  // PostgreSQL (enumerate PG tables, users, schemas).
  if (dbType === "postgres") {
    const pgPath = findBinary("psql");
    if (pgPath) {
      const commands = [`psql -h ${target} -U postgres -d template1`];
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(pgPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.postgres = String(child.stdout ?? "");
    } else {
      results.postgres = `{stub: no 'psql' binary (install: brew install postgresql).}`;
    }
  }

  // NoSQL Injection (MongoDB, MongoDB injection).
  if (dbType === "mongo") {
    const mongoPath = findBinary("mongosh");
    if (mongoPath) {
      const commands = [`mongosh --host ${target} --eval "db.getCollectionNames()"`];  // (MongoDB enumeration).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(mongoPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.mongo = String(child.stdout ?? "");
    } else {
      results.mongo = `{stub: no 'mongosh' binary (install: brew install mongodb).}`;
    }
  }

  // Redis (enum Redis, dump objects).
  if (dbType === "redis") {
    const redisPath = findBinary("redis-cli");
    if (redisPath) {
      const commands = [`redis-cli -h ${target} INFO`];  // (Redis enumeration).
      const file = `${tmpdir()}/${randomUUID()}.sh`;
      writeFileSync(file, commands.join("\n"));
      const child = spawnSync(redisPath, [file], { timeout: 30000, maxBuffer: 1024 * 1024 });
      results.redis = String(child.stdout ?? "");
    } else {
      results.redis = `{stub: no 'redis-cli' binary (install: brew install redis).}`;
    }
  }

  return {
    target,
    payload: `databaseSql/${dbType}/${action}`,
    success: Object.keys(results).length > 0,
    output: JSON.stringify(results),
    provenance: createProvenance("databaseSql", `databaseSql://${target}/${dbType}`),
  };
}

/** Find the binary (sqlmap/mysql/psql/mongosh/redis-cli). */
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
