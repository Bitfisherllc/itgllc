"use client";

import { useState } from "react";
import { Logo } from "@/components/Logo";
import { unlockSite } from "@/app/unlock-site";

export function SiteGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await unlockSite(password);
    if (!result.ok) {
      setPending(false);
      setError("That password is not correct.");
      return;
    }
    window.location.reload();
  }

  return (
    <div className="flex min-h-full flex-1 items-center bg-ink px-6 py-16 text-paper">
      <div className="mx-auto w-full max-w-md">
        <Logo tone="paper" />
        <p className="eyebrow mt-10 text-brass">Private preview</p>
        <h1 className="display mt-4 text-5xl text-paper">This site is in development.</h1>
        <p className="mt-5 text-lg leading-relaxed text-paper/80">
          Enter the password to view Integrity Title Group.
        </p>
        <form onSubmit={submit} className="mt-10">
          <label className="block text-sm font-semibold tracking-wide" htmlFor="site-password">
            Password
          </label>
          <input
            id="site-password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-3 min-h-12 w-full rounded-lg border border-white/25 bg-transparent px-4 text-paper outline-none focus:border-brass"
            required
          />
          {error ? <p className="mt-3 text-sm text-brass">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="header-action mt-6 inline-flex min-h-12 w-full items-center justify-center px-6 text-sm font-semibold uppercase tracking-wide disabled:opacity-60"
          >
            {pending ? "Checking" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
