"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { pageIcons } from "@/lib/icons";

export function ArticlesView() {
  const { articles } = usePages();

  return (
    <>
      <PageHero eyebrow={articles.eyebrow} title={articles.title} lede={articles.lede} icon={pageIcons.articles} />
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
          ]}
        />
        <div className="divide-y divide-line border-y border-line">
          {articles.items.map((article) => (
            <article key={article.slug} className="grid gap-3 py-8 md:grid-cols-12 md:items-start">
              <div className="md:col-span-11">
                <h2 className="font-serif text-3xl">
                  <Link href={`/articles/${article.slug}`} className="hover:text-brass-deep">
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{article.summary}</p>
              </div>
              <Link
                href={`/articles/${article.slug}`}
                className="text-sm font-semibold tracking-wide md:col-span-1 md:text-right"
              >
                Read
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
