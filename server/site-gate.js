const crypto = require("node:crypto");

const COOKIE = "itg_site";
const MAX_AGE = 60 * 60 * 24 * 30;

function password() {
  return process.env.SITE_PASSWORD || "";
}

function enabled() {
  return Boolean(password());
}

function token() {
  return crypto.createHash("sha256").update(`itg-site:${password()}`).digest("base64url");
}

function safeEqual(left, right) {
  const a = crypto.createHash("sha256").update(String(left)).digest();
  const b = crypto.createHash("sha256").update(String(right)).digest();
  return crypto.timingSafeEqual(a, b);
}

function passwordMatches(input) {
  if (!enabled() || typeof input !== "string" || !input) return false;
  return safeEqual(input, password());
}

function tokenMatches(value) {
  if (!enabled()) return true;
  if (typeof value !== "string" || !value) return false;
  return safeEqual(value, token());
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

function requestAllowed(req) {
  if (!enabled()) return true;
  return tokenMatches(readCookie(req));
}

module.exports = {
  COOKIE,
  MAX_AGE,
  enabled,
  token,
  passwordMatches,
  tokenMatches,
  requestAllowed,
};
