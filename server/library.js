const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const documents = require("./documents");
const blobs = require("./blob-files");
const home = require("./home-store");

const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "data", "library.json");
const libraryDir = path.join(root, "public", "images", "library");

const seeds = [
  { id: "baltimore-harbor", file: "baltimore-harbor.jpg" },
  { id: "agreement", file: "agreement.jpg" },
  { id: "closing-review", file: "closing-review.jpg" },
];

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
    CREATE TABLE IF NOT EXISTS image_library (
      id VARCHAR(64) PRIMARY KEY,
      src VARCHAR(255) NOT NULL,
      added_at VARCHAR(40) NOT NULL
    )
  `);
  return pool;
}

function publishFolders() {
  const folders = [libraryDir];
  if (fs.existsSync(path.join(root, "out"))) folders.push(path.join(root, "out", "images", "library"));
  return folders;
}

function emptyStore() {
  return { images: [], removed: [] };
}

function validId(id) {
  return typeof id === "string" && /^[a-z0-9-]+$/.test(id);
}

function readStoreFile() {
  try {
    const parsed = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
    if (Array.isArray(parsed)) return { images: parsed, removed: [] };
    if (parsed && typeof parsed === "object") {
      return {
        images: Array.isArray(parsed.images) ? parsed.images : [],
        removed: Array.isArray(parsed.removed) ? parsed.removed.filter(validId) : [],
      };
    }
  } catch {
    // A missing catalog starts empty.
  }
  return emptyStore();
}

function writeStoreFile(store) {
  fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
  const temporary = `${catalogPath}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(store, null, 2));
  fs.renameSync(temporary, catalogPath);
}

async function readStore() {
  if (documents.enabled()) {
    await home.readHome();
    const stored = await documents.readJson("library");
    if (stored && typeof stored === "object") {
      return {
        images: Array.isArray(stored.images) ? stored.images : [],
        removed: Array.isArray(stored.removed) ? stored.removed.filter(validId) : [],
      };
    }
    const seeded = readStoreFile();
    await documents.writeJson("library", seeded);
    return seeded;
  }
  if (mysqlConfig()) {
    const db = await getPool();
    await db.query(`
      CREATE TABLE IF NOT EXISTS image_library_removed (
        id VARCHAR(64) PRIMARY KEY
      )
    `);
    const [rows] = await db.query("SELECT id, src, added_at AS addedAt FROM image_library ORDER BY added_at DESC");
    const [removedRows] = await db.query("SELECT id FROM image_library_removed");
    return {
      images: rows.map((row) => ({ id: row.id, src: row.src, addedAt: row.addedAt })),
      removed: removedRows.map((row) => row.id).filter(validId),
    };
  }
  return readStoreFile();
}

async function writeStore(store) {
  if (documents.enabled()) {
    await documents.writeJson("library", store);
    return;
  }
  if (mysqlConfig()) {
    const db = await getPool();
    await db.query("DELETE FROM image_library");
    await db.query("DELETE FROM image_library_removed");
    for (const image of store.images) {
      await db.query("INSERT INTO image_library (id, src, added_at) VALUES (?, ?, ?)", [
        image.id,
        image.src,
        image.addedAt,
      ]);
    }
    for (const id of store.removed) {
      await db.query("INSERT INTO image_library_removed (id) VALUES (?)", [id]);
    }
    return;
  }
  writeStoreFile(store);
}

async function readCatalog() {
  return (await readStore()).images;
}

async function writeCatalog(images) {
  const store = await readStore();
  store.images = images;
  await writeStore(store);
}

function scanDisk() {
  if (!fs.existsSync(libraryDir)) return [];
  return fs
    .readdirSync(libraryDir)
    .filter((name) => /^[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(name))
    .map((name) => {
      const id = name.replace(/\.[^.]+$/, "");
      const stat = fs.statSync(path.join(libraryDir, name));
      return {
        id,
        src: `/images/library/${name}`,
        addedAt: stat.mtime.toISOString(),
      };
    });
}

async function ensureSeeds() {
  const removed = new Set((await readStore()).removed);
  for (const seed of seeds) {
    if (removed.has(seed.id)) continue;
    const source = path.join(root, "public", "images", seed.file);
    if (!fs.existsSync(source)) continue;
    for (const folder of publishFolders()) {
      fs.mkdirSync(folder, { recursive: true });
      const target = path.join(folder, seed.file);
      if (!fs.existsSync(target)) fs.copyFileSync(source, target);
    }
  }
}

async function listImages() {
  await ensureSeeds();
  const catalog = await readCatalog();
  const onDisk = scanDisk();
  const diskIds = new Set(onDisk.map((image) => image.id));
  const merged = new Map();
  for (const image of catalog) {
    const src = String(image.src || "");
    if (diskIds.has(image.id) || src.startsWith("https://") || src.startsWith("/images/")) merged.set(image.id, image);
  }
  for (const image of onDisk) {
    if (!merged.has(image.id)) merged.set(image.id, image);
  }
  const images = [...merged.values()].sort((a, b) => String(b.addedAt).localeCompare(String(a.addedAt)));
  const catalogChanged =
    images.length !== catalog.length || images.some((image, index) => image.id !== catalog[index]?.id);
  if (catalogChanged) await writeCatalog(images);
  return images.map(({ id, src }) => ({ id, src }));
}

function writeLibraryFile(id, extension, buffer) {
  for (const folder of publishFolders()) {
    fs.mkdirSync(folder, { recursive: true });
    const temporary = path.join(folder, `.${id}.${process.pid}.tmp`);
    fs.writeFileSync(temporary, buffer);
    fs.renameSync(temporary, path.join(folder, `${id}.${extension}`));
  }
  return `/images/library/${id}.${extension}`;
}

async function addImage(buffer, extension) {
  const id = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const store = await readStore();
  store.removed = store.removed.filter((removedId) => removedId !== id);
  await writeStore(store);
  await ensureSeeds();
  const src = blobs.enabled()
    ? await blobs.saveFile(`library/${id}.${extension}`, buffer, `image/${extension === "jpg" ? "jpeg" : extension}`)
    : writeLibraryFile(id, extension, buffer);
  const catalog = await readCatalog();
  const next = [
    { id, src, addedAt: new Date().toISOString() },
    ...catalog.filter((image) => image.id !== id),
  ];
  await writeCatalog(next);
  return { id, src };
}

async function findImage(id) {
  if (!validId(id)) return null;
  const images = await listImages();
  return images.find((image) => image.id === id) || null;
}

async function removeImage(id) {
  if (!validId(id)) return null;
  const image = await findImage(id);
  if (!image) return null;
  const store = await readStore();
  if (!store.removed.includes(id)) store.removed.push(id);
  store.images = store.images.filter((item) => item.id !== id);
  await writeStore(store);
  if (String(image.src).startsWith("https://")) await blobs.deleteFile(image.src);
  for (const folder of publishFolders()) {
    for (const extension of ["jpg", "jpeg", "png", "webp"]) {
      const file = path.join(folder, `${id}.${extension}`);
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
  }
  return image;
}

module.exports = { listImages, addImage, findImage, removeImage };
