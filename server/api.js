const { prepareInquiry } = require("../lib/inquiry-core.cjs");
const auth = require("./auth");
const store = require("./inquiry-store");

const attempts = new Map();

function sendJson(res, status, body, extraHeaders) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 20_000) {
        reject(Object.assign(new Error("too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("invalid json"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function clientKey(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

function tooManyAttempts(key) {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (entry.resetAt < Date.now()) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= 8;
}

function recordFailure(key) {
  const current = attempts.get(key);
  const resetAt = current && current.resetAt > Date.now() ? current.resetAt : Date.now() + 15 * 60 * 1000;
  const count = current && current.resetAt > Date.now() ? current.count + 1 : 1;
  attempts.set(key, { count, resetAt });
}

async function handleApi(req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  const pathname = url.pathname;

  try {
    if (req.method === "POST" && pathname === "/api/inquiries") {
      const body = await readBody(req);
      const result = prepareInquiry({
        intent: body.intent,
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        role: body.role,
        help: body.help,
        transaction: body.transaction,
        propertyState: body.propertyState,
        message: body.message,
        sensitiveAck: Boolean(body.sensitiveAck),
        honeypot: body.honeypot,
      });
      if (result.status === "error") {
        sendJson(res, 400, { ok: false, errors: result.errors });
        return;
      }
      await store.addInquiry(result.inquiry);
      sendJson(res, 201, { ok: true, department: result.department, to: result.to });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/login") {
      const key = clientKey(req);
      if (tooManyAttempts(key)) {
        sendJson(res, 429, { ok: false, error: "Too many attempts. Wait and try again." });
        return;
      }
      if (!auth.configured()) {
        sendJson(res, 503, {
          ok: false,
          error: "Admin sign-in is not configured on this server.",
        });
        return;
      }
      const body = await readBody(req);
      if (!auth.passwordMatches(body.password)) {
        recordFailure(key);
        sendJson(res, 401, { ok: false, error: "That password is not correct." });
        return;
      }
      attempts.delete(key);
      sendJson(res, 200, { ok: true }, { "Set-Cookie": auth.cookieHeader(auth.createSession(), req) });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/logout") {
      sendJson(res, 200, { ok: true }, { "Set-Cookie": auth.cookieHeader("", req) });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/session") {
      sendJson(res, 200, { ok: true, signedIn: auth.isSignedIn(req) });
      return;
    }

    if (!auth.isSignedIn(req)) {
      sendJson(res, 401, { ok: false, error: "Sign in required." });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/inquiries") {
      sendJson(res, 200, { ok: true, inquiries: await store.listInquiries() });
      return;
    }

    const statusMatch = pathname.match(/^\/api\/admin\/inquiries\/([a-f0-9]{16})$/);
    if (req.method === "POST" && statusMatch) {
      const body = await readBody(req);
      const updated = await store.setInquiryStatus(statusMatch[1], body.status);
      if (!updated) {
        sendJson(res, 404, { ok: false, error: "That message was not found." });
        return;
      }
      sendJson(res, 200, { ok: true, inquiry: updated });
      return;
    }

    sendJson(res, 404, { ok: false, error: "Not found." });
  } catch (error) {
    const status = error.status || 500;
    sendJson(res, status, { ok: false, error: "The request could not be completed." });
  }
}

module.exports = { handleApi };
