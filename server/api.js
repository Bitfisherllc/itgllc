const fs = require("node:fs");
const path = require("node:path");
const { prepareInquiry } = require("../lib/inquiry-core.cjs");
const auth = require("./auth");
const home = require("./home-store");
const pages = require("./pages-store");
const library = require("./library");
const media = require("./media");
const store = require("./inquiry-store");
const places = require("./google-places");
const documents = require("./documents");

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

function readBytes(req, limit, tooLargeMessage = "Use an image under 5 MB.") {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error("too large"), { status: 413, publicMessage: tooLargeMessage }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 80_000) {
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

async function listFooterLogos() {
  const dir = path.join(__dirname, "..", "public", "logo", "ANIMATIONS");
  let names = [];
  try {
    names = fs.readdirSync(dir);
  } catch {
    names = [];
  }
  const disk = names
    .filter((name) => /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.svg$/.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => ({
      src: `/logo/ANIMATIONS/${name}`,
      label: name
        .replace(/\.svg$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
    }));
  if (!documents.enabled()) return disk;
  const stored = await documents.readJson("animations");
  const extra = Array.isArray(stored) ? stored : [];
  const seen = new Set(disk.map((item) => item.src));
  return disk.concat(extra.filter((item) => item && item.src && !seen.has(item.src)));
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
      const stored = await pages.readPages();
      const office = stored.office;
      const helpOptions = stored.contact.departments.map((department) => department.label);
      const result = prepareInquiry(
        {
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
        },
        {
          orders: office.emailOrders,
          preCd: office.emailPreCd,
          processing: office.emailProcessing,
          postClosing: office.emailPostClosing,
          events: office.emailEvents,
          general: office.emailGeneral,
          helpOptions,
        },
      );
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

    if (req.method === "GET" && pathname === "/api/home") {
      const content = await home.readHome();
      const slides = [...content.heroSlides];
      const heroPath = String(content.heroImage || "").split("?")[0];
      const heroShown = slides.some((src) => String(src).split("?")[0] === heroPath);
      if (heroPath && heroPath !== "/images/home/hero.jpg" && !heroShown) slides.unshift(content.heroImage);
      const publishedSlides = slides.length ? slides : [content.heroImage];
      sendJson(res, 200, { ok: true, content, slides: publishedSlides });
      return;
    }

    if (req.method === "GET" && pathname === "/api/pages") {
      sendJson(res, 200, { ok: true, pages: await pages.readPages() });
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

    if (req.method === "POST" && pathname === "/api/admin/home") {
      const body = await readBody(req);
      const content = await home.writeHome(body.content || body);
      sendJson(res, 200, { ok: true, content });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/page") {
      const body = await readBody(req);
      const content = await pages.writePage(body.id, body.content);
      sendJson(res, 200, { ok: true, content });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/page-image") {
      const id = url.searchParams.get("id") || "";
      const slug = url.searchParams.get("slug") || "";
      const buffer = await readBytes(req, media.maxBytes);
      const added = await media.addToLibrary(buffer);
      const saved = added.library[0];
      const content = await pages.setPageImage(id, slug, saved.src);
      sendJson(res, 200, { ok: true, content, library: added.library });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/page-image/choose") {
      const body = await readBody(req);
      const image = await library.findImage(body.imageId);
      if (!image) {
        sendJson(res, 400, { ok: false, error: "That library image was not found." });
        return;
      }
      const content = await pages.setPageImage(body.id, body.slug || "", image.src);
      sendJson(res, 200, { ok: true, content, library: await library.listImages() });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/places") {
      const suggestions = await places.suggestPlaces(url.searchParams.get("q") || "");
      sendJson(res, 200, { ok: true, suggestions });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/place") {
      const address = await places.addressFromPlace(url.searchParams.get("id") || "");
      sendJson(res, 200, { ok: true, address });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/footer-logos") {
      sendJson(res, 200, { ok: true, logos: await listFooterLogos() });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/footer-logos") {
      const buffer = await readBytes(req, 1024 * 1024, "Use an SVG under 1 MB.");
      const saved = await media.saveAnimation(buffer, url.searchParams.get("name") || "");
      sendJson(res, 200, { ok: true, src: saved.src, logos: await listFooterLogos() });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/footer-logos/choose") {
      const body = await readBody(req);
      const logos = await listFooterLogos();
      const src = String(body.src || "");
      if (!logos.some((item) => item.src === src)) {
        sendJson(res, 400, { ok: false, error: "That animation was not found." });
        return;
      }
      const current = await pages.readPages();
      const content = await pages.writePage("other", { ...current.other, footerLogo: src });
      sendJson(res, 200, { ok: true, content, logos });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/footer-logos/delete") {
      const body = await readBody(req);
      const logos = await listFooterLogos();
      const src = String(body.src || "");
      if (!logos.some((item) => item.src === src)) {
        sendJson(res, 400, { ok: false, error: "That animation was not found." });
        return;
      }
      if (logos.length < 2) {
        sendJson(res, 400, { ok: false, error: "Keep at least one animation in the gallery." });
        return;
      }
      await media.deleteAnimationFile(src);
      const remaining = await listFooterLogos();
      const current = await pages.readPages();
      let content = current.other;
      if (current.other.footerLogo === src) {
        content = await pages.writePage("other", { ...current.other, footerLogo: remaining[0].src });
      }
      sendJson(res, 200, { ok: true, content, logos: remaining });
      return;
    }

    if (req.method === "GET" && pathname === "/api/admin/library") {
      const images = await library.listImages();
      sendJson(res, 200, { ok: true, images });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/library/upload") {
      const buffer = await readBytes(req, media.maxBytes);
      const result = await media.addToLibrary(buffer);
      sendJson(res, 200, { ok: true, library: result.library });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/library/delete") {
      const body = await readBody(req);
      const result = await media.deleteLibraryImage(body.id);
      sendJson(res, 200, { ok: true, content: result.content, library: result.library });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/library/choose") {
      const body = await readBody(req);
      const result = await media.chooseHomeImage(body.slot, body.id);
      sendJson(res, 200, { ok: true, content: result.content, library: result.library });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/hero-logo") {
      const buffer = await readBytes(req, 512 * 1024, "Use an SVG under 512 KB.");
      const result = await media.saveHeroLogo(buffer);
      sendJson(res, 200, { ok: true, content: result.content });
      return;
    }

    if (req.method === "POST" && pathname === "/api/admin/home-image") {
      const slot = url.searchParams.get("slot") || "";
      const buffer = await readBytes(req, media.maxBytes);
      const result = await media.saveHomeImage(slot, buffer);
      sendJson(res, 200, { ok: true, content: result.content, library: result.library });
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
    const message = error.publicMessage && status !== 500 ? error.publicMessage : "The request could not be completed.";
    sendJson(res, status, { ok: false, error: message });
  }
}

module.exports = { handleApi };
