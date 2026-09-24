"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { PageCopy } from "@/lib/page-copy";

export type AdminTarget =
  | { kind: "home"; label: string }
  | { kind: "library"; label: string }
  | { kind: "inbox"; label: string }
  | { kind: "page"; id: keyof PageCopy; slug?: string; label: string };

const AdminNavContext = createContext<{
  target: AdminTarget;
  setTarget: (target: AdminTarget) => void;
  preview: boolean;
  setPreview: (preview: boolean) => void;
  signedIn: boolean | null;
  setSignedIn: (signedIn: boolean) => void;
  logout: () => Promise<void>;
} | null>(null);

export function AdminNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [target, setTarget] = useState<AdminTarget>({ kind: "home", label: "Homepage" });
  const [preview, setPreview] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const targetKey = target.kind === "page" ? `${target.id}:${target.slug ?? ""}` : target.kind;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((body: { signedIn?: boolean }) => {
        if (!cancelled) setSignedIn(Boolean(body.signedIn));
      })
      .catch(() => {
        if (!cancelled) setSignedIn(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPreview(false);
  }, [targetKey]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setSignedIn(false);
    setPreview(false);
    setTarget({ kind: "home", label: "Homepage" });
    router.push("/");
  }

  return (
    <AdminNavContext.Provider value={{ target, setTarget, preview, setPreview, signedIn, setSignedIn, logout }}>
      {children}
    </AdminNavContext.Provider>
  );
}

export function useAdminNav() {
  const value = useContext(AdminNavContext);
  if (!value) {
    throw new Error("Admin navigation is unavailable.");
  }
  return value;
}

export function previewPath(target: AdminTarget) {
  if (target.kind === "home" || (target.kind === "page" && target.id === "other")) return "/";
  if (target.kind === "page" && target.id === "office") return "/contact";
  if (target.kind !== "page") return null;
  if (target.id === "about") return "/about";
  if (target.id === "team") return "/team";
  if (target.id === "services") return target.slug ? `/services/${target.slug}` : "/services";
  if (target.id === "coverage") return "/coverage";
  if (target.id === "contact") return "/contact";
  if (target.id === "resources") return target.slug ? `/resources/${target.slug}` : "/resources";
  if (target.id === "articles") return "/articles";
  if (target.id === "order") return "/order";
  if (target.id === "privacy") return "/privacy";
  if (target.id === "terms") return "/terms";
  return null;
}

export function targetFor(href: string, label: string): AdminTarget {
  if (href === "/" || href === "") return { kind: "home", label: "Homepage" };
  if (href === "/services") return { kind: "page", id: "services", label };
  const service = href.match(/^\/services\/([^/]+)$/);
  if (service) return { kind: "page", id: "services", slug: service[1], label };
  if (href === "/about") return { kind: "page", id: "about", label };
  if (href === "/team") return { kind: "page", id: "team", label };
  if (href === "/coverage") return { kind: "page", id: "coverage", label };
  if (href === "/resources") return { kind: "page", id: "resources", label };
  const resource = href.match(/^\/resources\/([^/]+)$/);
  if (resource) return { kind: "page", id: "resources", slug: resource[1], label };
  if (href === "/articles") return { kind: "page", id: "articles", label };
  if (href === "/contact") return { kind: "page", id: "contact", label };
  return { kind: "home", label: "Homepage" };
}

export function menuItemActive(href: string, target: AdminTarget) {
  if (target.kind !== "page") return false;
  if (href === "/services") return target.id === "services" && !target.slug;
  if (href.startsWith("/services/")) return target.id === "services" && href === `/services/${target.slug}`;
  if (href === "/about") return target.id === "about";
  if (href === "/team") return target.id === "team";
  if (href === "/coverage") return target.id === "coverage";
  if (href === "/resources") return target.id === "resources" && !target.slug;
  if (href.startsWith("/resources/")) return target.id === "resources" && href === `/resources/${target.slug}`;
  if (href === "/articles") return target.id === "articles";
  if (href === "/contact") return target.id === "contact";
  return false;
}

export function menuSectionActive(href: string, target: AdminTarget) {
  if (target.kind !== "page") return false;
  if (href === "/services") return target.id === "services";
  if (href === "/about") return target.id === "about" || target.id === "team" || target.id === "coverage";
  if (href === "/resources") return target.id === "resources" || target.id === "articles";
  if (href === "/contact") return target.id === "contact";
  return false;
}
