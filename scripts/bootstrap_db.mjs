import { ensureTables, getConnection, printError, printJson } from "./db_lib.mjs";

try {
  const dbPath = process.env.SQLITE_DB_PATH || "./pain2mvp.db";
  const conn = await getConnection(dbPath);
  await ensureTables(conn);
  printJson({
    ok: true,
    command: "bootstrap:db",
    database: dbPath,
    tables: ["opportunity_snapshots", "prds", "agent_memory"],
  });
} catch (error) {
  printError(error);
  process.exitCode = 1;
}
