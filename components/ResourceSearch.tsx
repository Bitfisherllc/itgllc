"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePages } from "@/components/usePages";

export function glossaryAnchor(term: string) {
  const slug = term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `glossary-${slug || "term"}`;
}

type Hit = {
  kind: string;
  href: string;
  title: string;
  text: string;
};

const groups = ["Guides", "Questions", "Glossary", "Articles"];

export function ResourceSearch() {
  const { resources, articles } = usePages();
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const hits = useMemo(() => {
    if (!needle) return [] as Hit[];
    const found: Hit[] = [];

    for (const item of resources.items) {
      if (item.slug === "search") continue;
      const guide = [item.title, item.summary, ...item.sections.flatMap((section) => [section.heading, ...section.paragraphs])].join(" ");
      if (guide.toLowerCase().includes(needle)) {
        found.push({
          kind: "Guides",
          href: `/resources/${item.slug}`,
          title: item.title,
          text: item.summary,
        });
      }
      if (item.entries) {
        for (const entry of item.entries) {
          if (!`${entry.term} ${entry.definition}`.toLowerCase().includes(needle)) continue;
          found.push({
            kind: "Glossary",
            href: `/resources/glossary#${glossaryAnchor(entry.term)}`,
            title: entry.term,
            text: entry.definition,
          });
        }
      }
    }

    for (const faq of resources.faqs) {
      if (!`${faq.question} ${faq.answer}`.toLowerCase().includes(needle)) continue;
      found.push({
        kind: "Questions",
        href: "/resources/faq",
        title: faq.question,
        text: faq.answer,
      });
    }

    for (const article of articles.items) {
      const copy = [
        article.title,
        article.summary,
        ...article.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.items ?? [])]),
      ].join(" ");
      if (!copy.toLowerCase().includes(needle)) continue;
      found.push({
        kind: "Articles",
        href: `/articles/${article.slug}`,
        title: article.title,
        text: article.summary,
      });
    }

    return found;
  }, [articles.items, needle, resources.faqs, resources.items]);

  return (
    <div>
      <label htmlFor="resource-search" className="text-sm font-semibold">
        Search resources
      </label>
      <input
        id="resource-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus-visible:border-brass"
      />
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {needle ? `${hits.length} ${hits.length === 1 ? "result" : "results"}` : "Guides, questions, glossary terms, and articles."}
      </p>
      {needle && hits.length === 0 ? (
        <p className="mt-10 leading-relaxed text-ink-soft">No pages match that search.</p>
      ) : (
        <div className="mt-12 space-y-14">
          {groups.map((kind) => {
            const items = hits.filter((hit) => hit.kind === kind);
            if (!items.length) return null;
            return (
              <section key={kind}>
                <h2 className="font-serif text-3xl">{kind}</h2>
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {items.map((hit) => (
                    <li key={`${hit.kind}-${hit.href}-${hit.title}`}>
                      <Link href={hit.href} className="block py-6 hover:text-brass-deep">
                        <span className="font-serif text-2xl">{hit.title}</span>
                        <span className="mt-3 block leading-relaxed text-ink-soft">{hit.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
