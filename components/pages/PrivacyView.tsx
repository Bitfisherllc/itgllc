"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";

export function PrivacyView() {
  const { privacy } = usePages();

  return (
    <>
      <PageHero eyebrow={privacy.eyebrow} title={privacy.title} lede={privacy.lede} />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Privacy", path: "/privacy" },
          ]}
        />
        <div className="space-y-5 leading-relaxed text-ink-soft">
          {privacy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </>
  );
}
