"use client";

import { useEffect, useState } from "react";
import { HomeEditor } from "@/components/HomeEditor";

type Inquiry = {
  id: string;
  createdAt: string;
  status: "new" | "reviewed";
  intent: "contact" | "order";
  departmentEmail: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  topic: string;
  propertyState: string;
  message: string;
};

const fieldClass =
  "mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus-visible:border-brass";

export function AdminPanel() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [listError, setListError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [view, setView] = useState<"home" | "inbox">("home");

  async function loadInquiries() {
    const response = await fetch("/api/admin/inquiries");
    const body = (await response.json()) as { ok?: boolean; inquiries?: Inquiry[]; error?: string };
    if (!response.ok || !body.ok || !body.inquiries) {
      setListError(body.error || "Messages could not be loaded.");
      return;
    }
    setListError("");
    setInquiries(body.inquiries);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((body: { signedIn?: boolean }) => {
        if (cancelled) return;
        const next = Boolean(body.signedIn);
        setSignedIn(next);
        if (next) return loadInquiries();
      })
      .catch(() => {
        if (!cancelled) setSignedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const body = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !body.ok) {
      setLoginError(body.error || "Sign-in failed.");
      return;
    }
    setPassword("");
    setSignedIn(true);
    await loadInquiries();
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSignedIn(false);
    setInquiries([]);
  }

  async function setStatus(id: string, status: Inquiry["status"]) {
    setBusyId(id);
    const response = await fetch(`/api/admin/inquiries/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const body = (await response.json()) as { ok?: boolean; inquiry?: Inquiry };
    if (response.ok && body.inquiry) {
      setInquiries((current) => current.map((item) => (item.id === id ? body.inquiry! : item)));
    }
    setBusyId("");
  }

  if (signedIn === null) {
    return <p className="text-ink-soft">Checking sign-in.</p>;
  }

  if (!signedIn) {
    return (
      <form onSubmit={onLogin} className="max-w-md border border-line bg-white p-8">
        <p className="eyebrow text-brass">Private</p>
        <h1 className="display mt-4 text-5xl">Admin</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Homepage text and website inquiries are managed here. This page is not linked from the public site.
        </p>
        {loginError ? (
          <p role="alert" className="mt-6 border border-brass bg-paper-deep px-4 py-3 text-sm">
            {loginError}
          </p>
        ) : null}
        <label htmlFor="password" className="mt-6 block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={fieldClass}
        />
        <button
          type="submit"
          className="mt-6 inline-flex min-h-12 items-center justify-center bg-ink px-6 text-sm font-semibold text-paper"
        >
          Sign in
        </button>
      </form>
    );
  }

  const fresh = inquiries.filter((item) => item.status === "new").length;

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-brass">Private</p>
          <h1 className="display mt-4 text-5xl">{view === "home" ? "Homepage" : "Inquiries"}</h1>
          <p className="mt-4 text-ink-soft">
            {view === "home"
              ? "Changes appear on the public homepage after you save."
              : fresh === 0
                ? "No new messages."
                : `${fresh} new ${fresh === 1 ? "message" : "messages"}.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setView("home")}
            className={`inline-flex min-h-12 items-center justify-center border px-6 text-sm font-semibold ${
              view === "home" ? "border-ink bg-ink text-paper" : "border-ink"
            }`}
          >
            Homepage
          </button>
          <button
            type="button"
            onClick={() => setView("inbox")}
            className={`inline-flex min-h-12 items-center justify-center border px-6 text-sm font-semibold ${
              view === "inbox" ? "border-ink bg-ink text-paper" : "border-ink"
            }`}
          >
            Inquiries
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex min-h-12 items-center justify-center border border-ink px-6 text-sm font-semibold"
          >
            Sign out
          </button>
        </div>
      </div>

      {view === "home" ? (
        <div className="mt-10">
          <HomeEditor />
        </div>
      ) : (
        <>
      {listError ? (
        <p role="alert" className="mt-8 border border-brass bg-paper-deep px-4 py-3 text-sm">
          {listError}
        </p>
      ) : null}

      {inquiries.length === 0 ? (
        <p className="mt-10 border border-line bg-white p-8 text-ink-soft">No website inquiries yet.</p>
      ) : (
        <ul className="mt-10 grid gap-4">
          {inquiries.map((item) => (
            <li key={item.id} className="border border-line bg-white p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-brass-deep">
                    {item.status === "new" ? "New" : "Reviewed"} · {item.intent === "order" ? "Order" : "Contact"}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">{item.name}</h2>
                  <p className="mt-2 text-sm text-ink-soft">
                    {new Date(item.createdAt).toLocaleString()} · {item.departmentEmail}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => setStatus(item.id, item.status === "new" ? "reviewed" : "new")}
                  className="inline-flex min-h-10 items-center justify-center border border-ink px-4 text-sm font-semibold disabled:opacity-60"
                >
                  {item.status === "new" ? "Mark reviewed" : "Mark new"}
                </button>
              </div>
              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd>
                    <a className="underline" href={`mailto:${item.email}`}>
                      {item.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Phone</dt>
                  <dd>{item.phone}</dd>
                </div>
                <div>
                  <dt className="text-muted">Role</dt>
                  <dd>{item.role}</dd>
                </div>
                <div>
                  <dt className="text-muted">{item.intent === "order" ? "Transaction" : "Request"}</dt>
                  <dd>
                    {item.topic}
                    {item.propertyState ? ` · ${item.propertyState}` : ""}
                  </dd>
                </div>
                {item.company ? (
                  <div>
                    <dt className="text-muted">Company</dt>
                    <dd>{item.company}</dd>
                  </div>
                ) : null}
              </dl>
              <p className="mt-6 whitespace-pre-wrap leading-relaxed">{item.message}</p>
            </li>
          ))}
        </ul>
      )}
        </>
      )}
    </div>
  );
}
