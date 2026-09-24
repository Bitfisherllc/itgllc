const { neon } = require("@neondatabase/serverless");

function postgresUrl() {
  return process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
}

function enabled() {
  return Boolean(postgresUrl());
}

let ready;

function client() {
  if (!ready) {
    const sql = neon(postgresUrl());
    ready = sql`CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      body TEXT NOT NULL
    )`.then(() => sql);
  }
  return ready;
}

async function readJson(id) {
  const sql = await client();
  const rows = await sql`SELECT body FROM documents WHERE id = ${id} LIMIT 1`;
  if (!rows.length) return undefined;
  try {
    return JSON.parse(rows[0].body);
  } catch {
    return undefined;
  }
}

async function writeJson(id, value) {
  const sql = await client();
  const body = JSON.stringify(value);
  await sql`INSERT INTO documents (id, body) VALUES (${id}, ${body})
    ON CONFLICT (id) DO UPDATE SET body = EXCLUDED.body`;
  return value;
}

module.exports = { enabled, readJson, writeJson };
