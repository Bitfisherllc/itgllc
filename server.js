const { startServer } = require("next/dist/server/lib/start-server");

const port = Number.parseInt(process.env.PORT || "3000", 10);

if (!Number.isInteger(port) || port <= 0) {
  console.error("PORT must be a positive integer.");
  process.exit(1);
}

startServer({
  dir: __dirname,
  isDev: false,
  hostname: "0.0.0.0",
  port,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
