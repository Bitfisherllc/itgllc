"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { iconFor, pageIcons, resourceIcons } from "@/lib/icons";

export function ResourcesView() {
  const { resources, perspective } = usePages();

  return (
    <>
      <PageHero
        eyebrow={resources.eyebrow}
        title={resources.title}
        lede={resources.lede}
        icon={pageIcons.resources}
      />
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
          ]}
        />
        <section className="border-y border-line">
          <div className="flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow text-brass">{perspective.eyebrow}</p>
              <h2 className="mt-3 font-serif text-4xl">
                <Link href="/resources/the-closing-perspective" className="hover:text-brass-deep">
                  {perspective.title}
                </Link>
              </h2>
              <p className="mt-4 leading-relaxed text-ink-soft">{perspective.lede}</p>
            </div>
            <Link href="/resources/the-closing-perspective" className="text-sm font-semibold tracking-wide hover:text-brass-deep">
              {perspective.items.length ? `${perspective.items.length} notes` : "Visit the journal"}
            </Link>
          </div>
        </section>
        <div className="mt-16 grid gap-px bg-line sm:grid-cols-2">
          {[...resources.items.filter((resource) => resource.slug === "search"), ...resources.items.filter((resource) => resource.slug !== "search")].map((resource) => (
            <Link
              key={resource.slug}
              href={`/resources/${resource.slug}`}
              className="bg-paper p-8 transition-colors hover:bg-white"
            >
              <h2 className="flex items-start gap-3 font-serif text-3xl">
                <Icon icon={iconFor(resourceIcons, resource.slug)} className="mt-1 shrink-0 text-2xl text-brass" />
                {resource.title}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{resource.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
