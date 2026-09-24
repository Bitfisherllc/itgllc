import { createRequire } from "node:module";
import { Readable } from "node:stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const require = createRequire(import.meta.url);
const { handleApi } = require("../../../server/api.js");

type NodeLike = Readable & {
  method: string;
  url: string;
  headers: Record<string, string>;
  socket: { remoteAddress: string };
};

function toNodeRequest(request: Request): NodeLike {
  const url = new URL(request.url);
  const body = request.body ? Readable.fromWeb(request.body as import("node:stream/web").ReadableStream) : Readable.from([]);
  const req = body as NodeLike;
  req.method = request.method;
  req.url = `${url.pathname}${url.search}`;
  req.headers = {};
  request.headers.forEach((value, key) => {
    req.headers[key] = value;
  });
  req.socket = { remoteAddress: "" };
  return req;
}

async function handle(request: Request) {
  const req = toNodeRequest(request);
  const headers: Record<string, string> = {};
  let status = 200;
  let payload = "";
  const res = {
    writeHead(code: number, extra?: Record<string, string>) {
      status = code;
      if (extra) Object.assign(headers, extra);
    },
    end(body?: string) {
      payload = body || "";
    },
  };
  await handleApi(req, res);
  return new Response(payload, { status, headers });
}

export const GET = handle;
export const POST = handle;
