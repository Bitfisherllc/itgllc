"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclaimer } from "@/components/Disclaimer";
import { glossaryAnchor, ResourceSearch } from "@/components/ResourceSearch";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { iconFor, resourceIcons } from "@/lib/icons";
import type { GlossaryEntry } from "@/lib/page-copy";

export function ResourceView({ slug }: { slug: string }) {
  const { resources } = usePages();
  const resource = resources.items.find((item) => item.slug === slug);
  if (!resource) notFound();

  return (
    <>
      <PageHero
        eyebrow={resources.eyebrow}
        title={resource.title}
        lede={resource.summary}
        icon={iconFor(resourceIcons, resource.slug)}
      />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: resource.title, path: `/resources/${resource.slug}` },
          ]}
        />
        {resource.slug === "search" ? (
          <ResourceSearch />
        ) : null}
        {resource.slug !== "search" && resource.disclaimer ? (
          <div className="mb-10">
            <Disclaimer />
          </div>
        ) : null}
        {resource.slug === "faq" ? (
          <div className="mb-10 divide-y divide-line border-y border-line">
            {resources.faqs.map((faq) => (
              <details key={faq.question} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-xl marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span aria-hidden="true" className="text-brass transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 leading-relaxed text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>
        ) : null}
        <div className="space-y-10">
          {resource.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-3xl">{section.heading}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        {resource.entries?.length ? <Glossary entries={resource.entries} /> : null}
      </article>
    </>
  );
}

function Glossary({ entries }: { entries: GlossaryEntry[] }) {
  const [query, setQuery] = useState("");
  const terms = entries
    .filter((entry) => entry.term)
    .slice()
    .sort((a, b) => a.term.localeCompare(b.term, "en"));
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? terms.filter((entry) => `${entry.term} ${entry.definition}`.toLowerCase().includes(needle))
    : terms;
  const letters = [...new Set(visible.map((entry) => entry.term[0]?.toUpperCase()).filter(Boolean))];

  return (
    <div className="mt-16">
      <label htmlFor="glossary-search" className="text-sm font-semibold">
        Search the glossary
      </label>
      <input
        id="glossary-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus-visible:border-brass"
      />
      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {needle ? `${visible.length} ${visible.length === 1 ? "term" : "terms"}` : "\u00a0"}
      </p>
      <nav aria-label="Glossary letters" className="mt-6 flex flex-wrap gap-2">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#glossary-${letter}`}
            className="inline-flex h-10 w-10 items-center justify-center border border-line text-sm font-semibold hover:border-brass-deep hover:text-brass-deep"
          >
            {letter}
          </a>
        ))}
      </nav>
      {needle && visible.length === 0 ? (
        <p className="mt-10 leading-relaxed text-ink-soft">No terms match that search.</p>
      ) : (
      <div className="mt-12 space-y-14">
        {letters.map((letter) => (
          <section key={letter} id={`glossary-${letter}`} className="scroll-mt-24">
            <h2 className="font-serif text-3xl">{letter}</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {visible
                .filter((entry) => entry.term[0]?.toUpperCase() === letter)
                .map((entry) => (
                  <div key={entry.term} id={glossaryAnchor(entry.term)} className="scroll-mt-24 py-6">
                    <dt className="font-serif text-2xl">{entry.term}</dt>
                    <dd className="mt-3 leading-relaxed text-ink-soft">{entry.definition}</dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </div>
      )}
    </div>
  );
}
