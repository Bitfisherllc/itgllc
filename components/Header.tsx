"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { QuoteLink } from "@/components/QuoteLink";
import { resources } from "@/lib/resources";
import { services } from "@/lib/services";
import { nav, site } from "@/lib/site";

const childrenByHref: Record<string, { href: string; label: string }[]> = {
  "/services": services.map((service) => ({
    href: `/services/${service.slug}`,
    label: service.title,
  })),
  "/about": [
    { href: "/about", label: "The office" },
    { href: "/coverage", label: "Where we work" },
  ],
  "/resources": resources.map((resource) => ({
    href: `/resources/${resource.slug}`,
    label: resource.title,
  })),
};

function activeHref(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
    setMobileSection(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      const current = document.activeElement;
      if (current instanceof HTMLElement && current.closest("header")) current.blur();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-white text-ink ${
        scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.06)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 md:px-8">
        <Link href="/" aria-label="ITG, Integrity Title Group, home">
          <Logo tone="ink" compact />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const children = childrenByHref[item.href];
            const active = activeHref(pathname, item.href);
            if (!children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-2 text-sm font-semibold ${
                    active ? "text-brass-deep" : "hover:text-brass-deep"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold ${
                    active ? "text-brass-deep" : "hover:text-brass-deep"
                  }`}
                >
                  {item.label}
                  <Chevron />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div
                    className={`border border-line bg-white p-3 shadow-[0_18px_50px_rgba(0,0,0,0.14)] ${
                      children.length > 4 ? "grid w-[34rem] grid-cols-2 gap-1" : "grid w-64 gap-1"
                    }`}
                  >
                    {children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="px-3 py-2.5 text-sm leading-snug hover:bg-paper-deep hover:text-brass-deep"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <QuoteLink
            className="hidden text-sm font-semibold hover:text-brass-deep lg:inline"
            onOpen={() => setOpen(false)}
          >
            Get a quote
          </QuoteLink>
          <a
            href={site.qualiaConnectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-semibold hover:text-brass-deep xl:inline"
          >
            Closing platform
          </a>
          <Link
            href="/order"
            className="hidden min-h-11 items-center bg-ink px-5 text-sm font-semibold text-paper hover:bg-brass-deep sm:inline-flex"
          >
            Start an Order
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-line lg:hidden"
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

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-white lg:hidden">
        <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col px-6 py-4">
          {nav.map((item) => {
            const children = childrenByHref[item.href];
            if (!children) {
              return (
                <Link key={item.href} href={item.href} className="border-b border-line py-4 text-lg font-semibold">
                  {item.label}
                </Link>
              );
            }
            const expanded = mobileSection === item.href;
            return (
              <div key={item.href} className="border-b border-line">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold"
                  aria-expanded={expanded}
                  onClick={() => setMobileSection(expanded ? null : item.href)}
                >
                  {item.label}
                  <Chevron open={expanded} />
                </button>
                {expanded ? (
                  <div className="grid gap-1 pb-4">
                    <Link href={item.href} className="px-3 py-2 text-sm font-semibold text-brass-deep">
                      View {item.label.toLowerCase()}
                    </Link>
                    {children.map((child) => (
                      <Link key={child.href} href={child.href} className="px-3 py-2 text-sm hover:bg-paper-deep">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          <QuoteLink
            className="border-b border-line py-4 text-lg font-semibold"
            onOpen={() => setOpen(false)}
          >
            Get a quote
          </QuoteLink>
          <a
            href={site.qualiaConnectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-line py-4 text-lg font-semibold"
          >
            Closing platform
          </a>
          <Link
            href="/order"
            className="mt-4 inline-flex min-h-12 items-center justify-center bg-ink px-5 text-sm font-semibold text-paper"
          >
            Start an Order
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <Icon
      icon={faChevronDown}
      className={`text-[0.65rem] text-current transition ${open ? "rotate-180" : "group-hover:rotate-180 group-focus-within:rotate-180"}`}
    />
  );
}
