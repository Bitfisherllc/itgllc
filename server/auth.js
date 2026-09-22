const crypto = require("node:crypto");

const COOKIE = "itg_admin";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function configured() {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const a = crypto.createHash("sha256").update(left).digest();
  const b = crypto.createHash("sha256").update(right).digest();
  return crypto.timingSafeEqual(a, b);
}

function createSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readCookie(req) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${COOKIE}=`)) {
      return decodeURIComponent(trimmed.slice(COOKIE.length + 1));
    }
  }
  return "";
}

function sessionIsValid(token) {
  if (!secret() || !token.includes(".")) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

function isSignedIn(req) {
  return sessionIsValid(readCookie(req));
}

function cookieHeader(token, req) {
  const secure = req.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
  const value = token ? `${COOKIE}=${encodeURIComponent(token)}` : `${COOKIE}=`;
  const maxAge = token ? Math.floor(MAX_AGE_MS / 1000) : 0;
  return `${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

function passwordMatches(password) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected || typeof password !== "string") return false;
  return safeEqual(password, expected);
}

module.exports = {
  configured,
  createSession,
  isSignedIn,
  cookieHeader,
  passwordMatches,
};
