const fs = require("node:fs");
const path = require("node:path");
const { mergePage, mergePages, pageCopy } = require("../lib/page-copy.cjs");
const { addressFromPlace } = require("./google-places");
const documents = require("./documents");
const home = require("./home-store");

const filePath = path.join(__dirname, "..", "data", "pages.json");

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
    CREATE TABLE IF NOT EXISTS page_content (
      id VARCHAR(64) PRIMARY KEY,
      body LONGTEXT NOT NULL
    )
  `);
  return pool;
}

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
}

function writeFile(pages) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(pages, null, 2));
  fs.renameSync(temporary, filePath);
}

async function readStored() {
  if (documents.enabled()) {
    await home.readHome();
    const stored = await documents.readJson("pages");
    if (stored && typeof stored === "object") return stored;
    const fromFile = readFile();
    const seeded = fromFile && typeof fromFile === "object" ? fromFile : {};
    await documents.writeJson("pages", seeded);
    return seeded;
  }
  if (mysqlConfig()) {
    const db = await getPool();
    const [rows] = await db.query("SELECT id, body FROM page_content");
    const stored = {};
    for (const row of rows) {
      try {
        stored[row.id] = JSON.parse(row.body);
      } catch {
        stored[row.id] = null;
      }
    }
    if (Object.keys(stored).length) return stored;
    const fromFile = readFile();
    return fromFile && typeof fromFile === "object" ? fromFile : {};
  }
  const stored = readFile();
  return stored && typeof stored === "object" ? stored : {};
}

async function readPages() {
  return mergePages(await readStored());
}

function addressKey(office) {
  if (!office) return "";
  return [office.street, office.city, office.region, office.postalCode].join("|");
}

async function writePage(id, input) {
  const previous = (await readStored())[id];
  let content = mergePage(id, input);
  if (!content) {
    throw Object.assign(new Error("unknown page"), {
      status: 400,
      publicMessage: "That page was not found.",
    });
  }
  if (id === "office") {
    const fallback = pageCopy.office;
    const changed = previous
      ? addressKey(previous) !== addressKey(content)
      : addressKey(content) !== addressKey(fallback);
    if (changed) {
      if (!content.placeId) {
        throw Object.assign(new Error("unrecognized address"), {
          status: 400,
          publicMessage: "Choose an address Google Maps recognizes.",
        });
      }
      const details = await addressFromPlace(content.placeId);
      content = { ...content, ...details };
    }
  }
  if (documents.enabled()) {
    const stored = await readStored();
    stored[id] = content;
    await documents.writeJson("pages", stored);
    return content;
  }
  if (mysqlConfig()) {
    const db = await getPool();
    await db.query(
      `INSERT INTO page_content (id, body) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE body = VALUES(body)`,
      [id, JSON.stringify(content)],
    );
    return content;
  }
  const stored = readFile();
  stored[id] = content;
  writeFile(stored);
  return content;
}

function versioned(src) {
  const bare = String(src || "").split("?")[0];
  return `${bare}?v=${Date.now()}`;
}

async function setPageImage(id, slug, src) {
  const pages = await readPages();
  const page = pages[id];
  if (!page) {
    throw Object.assign(new Error("unknown page"), {
      status: 400,
      publicMessage: "That page was not found.",
    });
  }
  const image = versioned(src);
  if (slug) {
    const item = Array.isArray(page.items) ? page.items.find((entry) => entry.slug === slug) : null;
    if (!item || typeof item.image !== "string") {
      throw Object.assign(new Error("no image"), {
        status: 400,
        publicMessage: "That page does not have a photograph.",
      });
    }
    item.image = image;
  } else if (typeof page.image === "string") {
    page.image = image;
  } else {
    throw Object.assign(new Error("no image"), {
      status: 400,
      publicMessage: "That page does not have a photograph.",
    });
  }
  return writePage(id, page);
}

function resetImage(node, fallback, removedPath) {
  if (!node || !fallback || typeof node !== "object") return false;
  let changed = false;
  if (
    typeof node.image === "string" &&
    typeof fallback.image === "string" &&
    node.image.split("?")[0] === removedPath
  ) {
    node.image = fallback.image;
    changed = true;
  }
  if (Array.isArray(node.items) && Array.isArray(fallback.items)) {
    node.items.forEach((item, index) => {
      if (resetImage(item, fallback.items[index], removedPath)) changed = true;
    });
  }
  if (Array.isArray(node.people)) {
    node.people.forEach((person) => {
      if (typeof person.image === "string" && person.image.split("?")[0] === removedPath) {
        person.image = "";
        changed = true;
      }
    });
  }
  return changed;
}

async function clearPageImage(removedPath) {
  const stored = await readStored();
  const changed = [];
  for (const id of Object.keys(pageCopy)) {
    const page = mergePage(id, stored[id]);
    if (resetImage(page, pageCopy[id], removedPath)) changed.push({ id, page });
  }
  for (const entry of changed) await writePage(entry.id, entry.page);
  return changed.length > 0;
}

async function publishFile() {
  if (!mysqlConfig()) return;
  const file = readFile();
  if (!file || typeof file !== "object") return;
  const db = await getPool();
  for (const [id, body] of Object.entries(file)) {
    if (!body || typeof body !== "object") continue;
    await db.query(
      `INSERT INTO page_content (id, body) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE body = VALUES(body)`,
      [id, JSON.stringify(body)],
    );
  }
}

module.exports = { readPages, writePage, setPageImage, clearPageImage, publishFile };
