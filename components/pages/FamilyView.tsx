"use client";

import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { usePages } from "@/components/usePages";
import { familyPath } from "@/lib/page-copy";

export function FamilyPhoto({
  src,
  alt,
  wide = false,
}: {
  src: string;
  alt: string;
  wide?: boolean;
}) {
  const ratio = wide ? "aspect-[3/2]" : "aspect-[4/5]";
  if (!src) {
    return <div className={`${ratio} rounded-lg border border-line bg-paper-deep`} aria-hidden="true" />;
  }

  return (
    <div className={`photo-shadow relative overflow-hidden rounded-lg ${ratio}`}>
      <Image src={src} alt={alt} fill sizes={wide ? "100vw" : "(min-width: 1024px) 24rem, 100vw"} className="object-cover" />
    </div>
  );
}

export function FamilyView() {
  const { about } = usePages();
  const family = about.family;

  return (
    <>
      <header className="bg-ink text-paper">
        <div className="grid md:grid-cols-2">
          <div className="order-2 flex flex-col items-end justify-center px-6 py-16 text-right md:order-1 md:px-10 lg:px-14 lg:py-20">
            <p className="eyebrow text-brass">{family.supporting}</p>
            <h1 className="display mt-6 max-w-xl text-5xl text-paper sm:text-6xl xl:text-7xl">{family.heroTitle}</h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/80">{family.heroLede}</p>
          </div>
          <div className="order-1 p-4 sm:p-6 md:order-2 lg:p-8">
            <div className="relative h-56 overflow-hidden rounded-lg sm:h-64 md:h-full md:min-h-80">
              {family.heroImage ? (
                <Image
                  src={family.heroImage}
                  alt={family.heroImageAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover object-[center_35%]"
                />
              ) : (
                <div className="h-full bg-white/10" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: family.navLabel, path: familyPath },
          ]}
        />
        <section className="mt-12" aria-labelledby="story-heading">
          <h2 id="story-heading" className="display text-4xl">
            {family.storyHeading}
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
            {family.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
        <section className="mt-16" aria-labelledby="message-heading">
          <h2 id="message-heading" className="display text-4xl">
            {family.messageHeading}
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>{family.summary}</p>
            {family.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <footer className="mt-12 border-t border-line pt-8">
            <p className="font-semibold text-ink">{family.signature}</p>
            <p className="mt-1 text-ink-soft">{family.role}</p>
          </footer>
        </section>
      </article>
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
          <h2 className="display max-w-3xl text-4xl md:text-5xl">{family.ctaHeading}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/80">{family.ctaText}</p>
          <div className="mt-8">
            <Button href="/contact" variant="inverse">
              {family.ctaButton}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
