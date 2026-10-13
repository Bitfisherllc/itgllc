"use server";

import { createRequire } from "node:module";
import { cookies } from "next/headers";

const require = createRequire(import.meta.url);
const gate = require("../server/site-gate.js") as {
  COOKIE: string;
  MAX_AGE: number;
  enabled: () => boolean;
  token: () => string;
  passwordMatches: (input: string) => boolean;
  tokenMatches: (value: string) => boolean;
};

export async function siteIsOpen() {
  if (!gate.enabled()) return true;
  const value = (await cookies()).get(gate.COOKIE)?.value || "";
  return gate.tokenMatches(value);
}

export async function unlockSite(password: string) {
  if (!gate.passwordMatches(password)) return { ok: false as const };
  const jar = await cookies();
  jar.set(gate.COOKIE, gate.token(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: gate.MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return { ok: true as const };
}
