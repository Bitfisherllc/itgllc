"use client";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { QuoteLink } from "@/components/QuoteLink";
import { menuItemActive, menuSectionActive, previewPath, targetFor, useAdminNav } from "@/components/AdminNav";
import { usePages } from "@/components/usePages";
import { faFileLines, iconFor, pageIcons, resourceIcons, serviceIcons } from "@/lib/icons";
import { type PageCopy } from "@/lib/page-copy";
import { nav, site } from "@/lib/site";

const navIcons: Record<string, IconDefinition> = {
  "/services": pageIcons.services,
  "/about": pageIcons.about,
  "/resources": pageIcons.resources,
  "/contact": pageIcons.contact,
};

function childrenFor(pages: PageCopy): Record<string, { href: string; label: string; icon: IconDefinition }[]> {
  return {
    "/services": pages.services.items.map((service) => ({
      href: `/services/${service.slug}`,
      label: service.title,
      icon: iconFor(serviceIcons, service.slug),
    })),
    "/about": [
      { href: "/about", label: "The office", icon: pageIcons.about },
      { href: "/team", label: "Our team", icon: pageIcons.team },
      { href: "/coverage", label: "Service Locations", icon: pageIcons.coverage },
    ],
    "/resources": [
      ...[...pages.resources.items.filter((resource) => resource.slug === "search"), ...pages.resources.items.filter((resource) => resource.slug !== "search")].map((resource) => ({
        href: `/resources/${resource.slug}`,
        label: resource.title,
        icon: iconFor(resourceIcons, resource.slug),
      })),
      { href: "/articles", label: "Articles", icon: pageIcons.articles },
    ],
  };
}

function activeHref(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const admin = pathname === "/admin";
  const { target, setTarget, preview, setPreview, signedIn, logout } = useAdminNav();
  const previewHref = previewPath(target);
  const childrenByHref = childrenFor(usePages());
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  function choosePage(event: React.MouseEvent, href: string, label: string) {
    if (!admin) return;
    event.preventDefault();
    setTarget(targetFor(href, label));
    setOpen(false);
    window.scrollTo({ top: 0 });
  }

  function chooseOther(item: "office" | "footer" | "library" | "inbox") {
    if (item === "library") setTarget({ kind: "library", label: "Library" });
    else if (item === "inbox") setTarget({ kind: "inbox", label: "Inquiries" });
    else if (item === "office") setTarget({ kind: "page", id: "office", label: "Contact details" });
    else setTarget({ kind: "page", id: "other", label: "Footer" });
    setOpen(false);
    setMobileSection(null);
    window.scrollTo({ top: 0 });
  }

  const otherActive =
    (target.kind === "page" && (target.id === "other" || target.id === "office")) ||
    target.kind === "library" ||
    target.kind === "inbox";
  const otherItems = [
    {
      id: "office" as const,
      label: "Contact details",
      icon: pageIcons.contact,
      active: target.kind === "page" && target.id === "office",
    },
    { id: "footer" as const, label: "Footer", icon: faFileLines, active: target.kind === "page" && target.id === "other" },
    { id: "library" as const, label: "Library", icon: pageIcons.library, active: target.kind === "library" },
    { id: "inbox" as const, label: "Inquiries", icon: pageIcons.inquiries, active: target.kind === "inbox" },
  ];

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
    document.body.style.overflow = open || (admin && preview) ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, admin, preview]);

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
      className={`sticky top-0 z-50 border-b ${
        admin
          ? "border-white/15 bg-ink text-paper"
          : `border-line bg-white text-ink ${scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.06)]" : ""}`
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6 md:px-8">
        {admin ? (
          <button
            type="button"
            onClick={() => {
              setTarget({ kind: "home", label: "Homepage" });
              setOpen(false);
              window.scrollTo({ top: 0 });
            }}
            className="inline-flex items-center gap-3"
            aria-current={target.kind === "home" ? "page" : undefined}
          >
            <Logo tone="paper" compact />
            <span className="text-sm font-semibold tracking-[0.2em]">ADMIN</span>
          </button>
        ) : (
          <Link href="/" aria-label="ITG, Integrity Title Group, home">
            <Logo tone="ink" compact />
          </Link>
        )}

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const children = childrenByHref[item.href];
            const active = admin ? menuSectionActive(item.href, target) : activeHref(pathname, item.href);
            if (!children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) => choosePage(event, item.href, item.label)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold ${
                    active ? (admin ? "text-brass" : "text-brass-deep") : admin ? "hover:text-brass" : "hover:text-brass-deep"
                  }`}
                >
                  <Icon icon={navIcons[item.href]} className="text-sm text-brass" />
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
                  onClick={(event) => choosePage(event, item.href, item.label)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold ${
                    active ? (admin ? "text-brass" : "text-brass-deep") : admin ? "hover:text-brass" : "hover:text-brass-deep"
                  }`}
                >
                  <Icon icon={navIcons[item.href]} className="text-sm text-brass" />
                  {item.label}
                  <Chevron />
                </Link>
                <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div
                    className={`border border-line bg-white p-3 text-ink shadow-[0_18px_50px_rgba(0,0,0,0.14)] ${
                      children.length > 4 ? "grid w-[34rem] grid-cols-2 gap-1" : "grid w-64 gap-1"
                    }`}
                  >
                    {children.map((child) => {
                      const childActive = admin && menuItemActive(child.href, target);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          aria-current={childActive ? "page" : undefined}
                          onClick={(event) => choosePage(event, child.href, child.label)}
                          className={`flex items-start gap-2.5 px-3 py-2.5 text-sm leading-snug hover:bg-paper-deep hover:text-brass-deep ${
                            childActive ? "bg-paper-deep text-brass-deep" : ""
                          }`}
                        >
                          <Icon icon={child.icon} className={`mt-0.5 shrink-0 text-sm ${admin ? "text-brass-deep" : "text-brass"}`} />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          {admin ? (
            <div className="group relative">
              <button
                type="button"
                aria-current={otherActive ? "page" : undefined}
                aria-haspopup="true"
                onClick={() => chooseOther("footer")}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold ${
                  otherActive ? "text-brass" : "hover:text-brass"
                }`}
              >
                <Icon icon={pageIcons.other} className="text-sm text-brass" />
                Other
                <Chevron />
              </button>
              <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="grid w-56 gap-1 border border-line bg-white p-3 text-ink shadow-[0_18px_50px_rgba(0,0,0,0.14)]">
                  {otherItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-current={item.active ? "page" : undefined}
                      onClick={() => chooseOther(item.id)}
                      className={`flex items-start gap-2.5 px-3 py-2.5 text-left text-sm leading-snug hover:bg-paper-deep hover:text-brass-deep ${
                        item.active ? "bg-paper-deep text-brass-deep" : ""
                      }`}
                    >
                      <Icon icon={item.icon} className="mt-0.5 shrink-0 text-sm text-brass-deep" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {admin && signedIn && previewHref ? (
            <div className="inline-flex border border-white/50 text-sm font-semibold" role="group" aria-label="Page view">
              <button
                type="button"
                aria-pressed={!preview}
                onClick={() => setPreview(false)}
                className={`min-h-10 px-3 ${preview ? "text-paper" : "bg-paper text-ink"}`}
              >
                Edit
              </button>
              <button
                type="button"
                aria-pressed={preview}
                onClick={() => setPreview(true)}
                className={`min-h-10 px-3 ${preview ? "bg-paper text-ink" : "text-paper"}`}
              >
                Preview
              </button>
            </div>
          ) : null}
          {admin && signedIn ? (
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-brass px-6 text-sm font-semibold text-ink"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                X
              </span>
              logout
            </button>
          ) : null}
          {admin ? null : (
            <>
              <QuoteLink
                className="!hidden bg-brass px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink hover:bg-brass-deep hover:text-paper lg:!inline-flex"
                onOpen={() => setOpen(false)}
              >
                Get a quote
              </QuoteLink>
              <a
                href={site.qualiaConnectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden text-sm font-semibold hover:text-brass-deep lg:inline"
              >
                Login
              </a>
            </>
          )}
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center border lg:hidden ${
              admin ? "border-white/40" : "border-line"
            }`}
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

      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-white text-ink lg:hidden">
        <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col px-6 py-4">
          {nav.map((item) => {
            const children = childrenByHref[item.href];
            if (!children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(event) => choosePage(event, item.href, item.label)}
                  className="flex items-center gap-3 border-b border-line py-4 text-lg font-semibold"
                >
                  <Icon icon={navIcons[item.href]} className={`text-lg ${admin ? "text-brass-deep" : "text-brass"}`} />
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
                  <span className="inline-flex items-center gap-3">
                    <Icon icon={navIcons[item.href]} className={`text-lg ${admin ? "text-brass-deep" : "text-brass"}`} />
                    {item.label}
                  </span>
                  <Chevron open={expanded} />
                </button>
                {expanded ? (
                  <div className="grid gap-1 pb-4">
                    <Link
                      href={item.href}
                      onClick={(event) => choosePage(event, item.href, item.label)}
                      className="px-3 py-2 text-sm font-semibold text-brass-deep"
                    >
                      View {item.label.toLowerCase()}
                    </Link>
                    {children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={(event) => choosePage(event, child.href, child.label)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-paper-deep"
                      >
                        <Icon icon={child.icon} className={`shrink-0 text-sm ${admin ? "text-brass-deep" : "text-brass"}`} />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          {admin ? (
            <div className="border-b border-line">
              <button
                type="button"
                className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold"
                aria-expanded={mobileSection === "/other"}
                onClick={() => setMobileSection(mobileSection === "/other" ? null : "/other")}
              >
                <span className="inline-flex items-center gap-3">
                  <Icon icon={pageIcons.other} className="text-lg text-brass-deep" />
                  Other
                </span>
                <Chevron open={mobileSection === "/other"} />
              </button>
              {mobileSection === "/other" ? (
                <div className="grid gap-1 pb-4">
                  {otherItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-current={item.active ? "page" : undefined}
                      onClick={() => chooseOther(item.id)}
                      className="flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-paper-deep"
                    >
                      <Icon icon={item.icon} className="shrink-0 text-sm text-brass-deep" />
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          {admin ? null : (
            <>
              <QuoteLink
                className="mt-4 justify-center bg-brass px-4 py-3 text-sm font-semibold uppercase tracking-wide text-ink"
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
                Login
              </a>
            </>
          )}
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
