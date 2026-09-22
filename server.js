const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const { handleApi } = require("./server/api");
const { loadEnvFile } = require("./server/env");

loadEnvFile();

const root = path.join(__dirname, "out");
const port = Number.parseInt(process.env.PORT || "3000", 10);

if (!Number.isInteger(port) || port <= 0) {
  console.error("PORT must be a positive integer.");
  process.exit(1);
}

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function insideRoot(filePath) {
  const resolved = path.resolve(filePath);
  return resolved === root || resolved.startsWith(root + path.sep);
}

function resolveFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }

  const relative = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "").replace(/^[/\\]+/, "");
  const base = path.join(root, relative);
  if (!insideRoot(base)) return null;

  const candidates = [base];
  if (!path.extname(base)) {
    candidates.push(`${base}.html`, path.join(base, "index.html"));
  }

  for (const candidate of candidates) {
    if (!insideRoot(candidate)) continue;
    try {
      if (fs.statSync(candidate).isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }

  return null;
}

function send(res, status, filePath) {
  const type = types[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  res.writeHead(status, { "Content-Type": type });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const pathname = (req.url || "/").split("?")[0];
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    handleApi(req, res);
    return;
  }

  const filePath = resolveFile(req.url || "/");
  if (filePath) {
    send(res, 200, filePath);
    return;
  }

  const notFound = path.join(root, "404.html");
  if (fs.existsSync(notFound)) {
    send(res, 404, notFound);
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Listening on 0.0.0.0:${port}`);
});
