"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { iconFor, pageIcons, resourceIcons } from "@/lib/icons";

export function ResourcesView() {
  const { resources, articles } = usePages();

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
        <div className="grid gap-px bg-line sm:grid-cols-2">
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
        <div className="mt-16">
          <h2 className="font-serif text-3xl">{resources.articlesHeading}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{resources.articlesLede}</p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {articles.items.map((article) => (
              <li key={article.slug}>
                <Link href={`/articles/${article.slug}`} className="block py-5 font-serif text-2xl hover:text-brass-deep">
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
