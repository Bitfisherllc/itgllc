const http = require("node:http");
const next = require("next");
const { handleApi } = require("./api");
const { loadEnvFile } = require("./env");

loadEnvFile();

const port = Number.parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: true, hostname: "localhost", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      const pathname = (req.url || "/").split("?")[0];
      if (pathname === "/api" || pathname.startsWith("/api/")) {
        handleApi(req, res);
        return;
      }
      handle(req, res);
    })
    .listen(port, "0.0.0.0", () => {
      console.log(`Dev server at http://localhost:${port}`);
    });
});
