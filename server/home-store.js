const fs = require("node:fs");
const path = require("node:path");
const { mergeHome } = require("../lib/home-content.cjs");
const documents = require("./documents");

const filePath = path.join(__dirname, "..", "data", "home.json");

function mysqlConfig() {
  const host = process.env.DB_HOST;
  const database = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  if (!host || !database || !user || password == null || password === "") return null;
  return {
    host,
    port: Number.parseInt(process.env.DB_PORT || "3306", 10),
    database,
    user,
    password,
  };
}

let pool;

async function getPool() {
  if (pool) return pool;
  const mysql = require("mysql2/promise");
  pool = mysql.createPool({
    ...mysqlConfig(),
    waitForConnections: true,
    connectionLimit: 5,
  });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS home_content (
      id TINYINT PRIMARY KEY,
      body LONGTEXT NOT NULL
    )
  `);
  return pool;
}

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function writeFile(content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(content, null, 2));
  fs.renameSync(temporary, filePath);
}

async function readHome() {
  if (documents.enabled()) {
    const stored = await documents.readJson("home");
    if (stored == null) {
      const seeded = mergeHome(readFile());
      await documents.writeJson("home", seeded);
      return seeded;
    }
    return mergeHome(stored);
  }
  if (mysqlConfig()) {
    const db = await getPool();
    const [rows] = await db.query("SELECT body FROM home_content WHERE id = 1 LIMIT 1");
    if (!rows[0]) return mergeHome(readFile());
    try {
      return mergeHome(JSON.parse(rows[0].body));
    } catch {
      return mergeHome(null);
    }
  }
  return mergeHome(readFile());
}

async function writeHome(input) {
  const content = mergeHome(input);
  if (documents.enabled()) {
    await documents.writeJson("home", content);
    return content;
  }
  if (mysqlConfig()) {
    const db = await getPool();
    const body = JSON.stringify(content);
    await db.query(
      `INSERT INTO home_content (id, body) VALUES (1, ?)
       ON DUPLICATE KEY UPDATE body = VALUES(body)`,
      [body],
    );
    return content;
  }
  writeFile(content);
  return content;
}

async function publishFile() {
  if (!mysqlConfig()) return;
  const file = readFile();
  if (!file) return;
  const db = await getPool();
  await db.query(
    `INSERT INTO home_content (id, body) VALUES (1, ?)
     ON DUPLICATE KEY UPDATE body = VALUES(body)`,
    [JSON.stringify(mergeHome(file))],
  );
}

module.exports = { readHome, writeHome, publishFile };
