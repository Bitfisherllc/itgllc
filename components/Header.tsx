"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { nav } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  const onHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const tone = onHero ? "paper" : "ink";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        onHero
          ? "border-transparent bg-ink text-paper"
          : "border-line bg-paper/95 text-ink backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-6 md:px-8">
        <Link href="/" aria-label="ITG, Integrity Title Group, home">
          <Logo tone={tone} compact />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm tracking-wide ${
                  active
                    ? onHero
                      ? "text-brass"
                      : "text-brass-deep"
                    : onHero
                      ? "text-paper/85 hover:text-paper"
                      : "hover:text-brass-deep"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/order"
            className={`hidden min-h-11 items-center px-5 text-sm font-semibold tracking-wide sm:inline-flex ${
              onHero
                ? "bg-paper text-ink hover:bg-white"
                : "bg-ink text-paper hover:bg-ink-soft"
            }`}
          >
            Start an Order
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-current/30 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="flex w-4 flex-col gap-1.5">
              <span className={`h-px bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className={`border-t border-line bg-paper text-ink lg:hidden ${
          open ? "rise" : ""
        }`}
      >
        <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col px-6 py-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-line py-4 text-2xl font-serif"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/order"
            className="mt-6 inline-flex min-h-12 items-center justify-center bg-ink px-5 text-sm font-semibold text-paper"
          >
            Start an Order
          </Link>
        </nav>
      </div>
    </header>
  );
}
