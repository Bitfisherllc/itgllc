const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const filePath = path.join(__dirname, "..", "data", "inquiries.json");

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
    CREATE TABLE IF NOT EXISTS inquiries (
      id VARCHAR(32) PRIMARY KEY,
      created_at VARCHAR(40) NOT NULL,
      status VARCHAR(20) NOT NULL,
      intent VARCHAR(20) NOT NULL,
      department_email VARCHAR(255) NOT NULL,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      company VARCHAR(200) NOT NULL,
      role VARCHAR(80) NOT NULL,
      topic VARCHAR(200) NOT NULL,
      property_state VARCHAR(80) NOT NULL,
      message TEXT NOT NULL
    )
  `);
  return pool;
}

function rowToInquiry(row) {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    intent: row.intent,
    departmentEmail: row.department_email,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    role: row.role,
    topic: row.topic,
    propertyState: row.property_state,
    message: row.message,
  };
}

function readFileStore() {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFileStore(items) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(items, null, 2));
  fs.renameSync(temporary, filePath);
}

async function addInquiry(inquiry) {
  const record = {
    id: crypto.randomBytes(8).toString("hex"),
    createdAt: new Date().toISOString(),
    status: "new",
    ...inquiry,
  };

  const config = mysqlConfig();
  if (config) {
    const db = await getPool();
    await db.query(
      `INSERT INTO inquiries (
        id, created_at, status, intent, department_email, name, email, phone,
        company, role, topic, property_state, message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id,
        record.createdAt,
        record.status,
        record.intent,
        record.departmentEmail,
        record.name,
        record.email,
        record.phone,
        record.company,
        record.role,
        record.topic,
        record.propertyState,
        record.message,
      ],
    );
    return record;
  }

  const items = readFileStore();
  items.push(record);
  writeFileStore(items);
  return record;
}

async function listInquiries() {
  if (mysqlConfig()) {
    const db = await getPool();
    const [rows] = await db.query("SELECT * FROM inquiries ORDER BY created_at DESC");
    return rows.map(rowToInquiry);
  }
  return readFileStore().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

async function setInquiryStatus(id, status) {
  if (status !== "new" && status !== "reviewed") return null;
  if (mysqlConfig()) {
    const db = await getPool();
    const [result] = await db.query("UPDATE inquiries SET status = ? WHERE id = ?", [status, id]);
    if (!result.affectedRows) return null;
    const [rows] = await db.query("SELECT * FROM inquiries WHERE id = ? LIMIT 1", [id]);
    return rows[0] ? rowToInquiry(rows[0]) : null;
  }

  const items = readFileStore();
  const item = items.find((entry) => entry.id === id);
  if (!item) return null;
  item.status = status;
  writeFileStore(items);
  return item;
}

module.exports = { addInquiry, listInquiries, setInquiryStatus };
