"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { site } from "@/lib/site";

export function TermsView() {
  const { terms } = usePages();

  return (
    <>
      <PageHero eyebrow={terms.eyebrow} title={terms.title} lede={terms.lede} />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Terms", path: "/terms" },
          ]}
        />
        <div className="space-y-5 leading-relaxed text-ink-soft">
          {terms.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
        </div>
      </article>
    </>
  );
}
