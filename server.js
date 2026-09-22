const { spawn } = require("node:child_process");

const port = process.env.PORT || "3000";
const child = spawn(
  process.execPath,
  [
    require.resolve("next/dist/bin/next"),
    "start",
    "--hostname",
    "0.0.0.0",
    "--port",
    String(port),
  ],
  { stdio: "inherit" },
);

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
