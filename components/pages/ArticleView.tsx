"use client";

import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclaimer } from "@/components/Disclaimer";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { pageIcons } from "@/lib/icons";

export function ArticleView({ slug }: { slug: string }) {
  const { articles } = usePages();
  const article = articles.items.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <>
      <PageHero eyebrow={articles.eyebrow} title={article.title} lede={article.summary} icon={pageIcons.articles} />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: article.title, path: `/articles/${article.slug}` },
          ]}
        />
        <div className="mb-10">
          <Disclaimer />
        </div>
        <div className="space-y-10">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-3xl">{section.heading}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
