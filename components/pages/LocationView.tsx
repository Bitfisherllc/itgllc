"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { pageIcons } from "@/lib/icons";
import { getLocation, locationPages } from "@/lib/locations";

export function LocationView({ slug }: { slug: string }) {
  const { coverage } = usePages();
  const location = getLocation(slug, coverage.states);
  if (!location) notFound();
  const others = locationPages(coverage.states).filter((item) => item.slug !== location.slug);

  return (
    <>
      <PageHero eyebrow="Service Locations" title={location.title} lede={location.lede} icon={pageIcons.coverage} />
      <article className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Service Locations", path: "/coverage" },
            { name: location.state, path: `/coverage/${location.slug}` },
          ]}
        />
        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div>
            <div className="max-w-3xl space-y-12">
              {location.sections.map((section) => (
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
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Button href="/order">Start a Title Order</Button>
              <Button href="/contact" variant="ghost">
                Contact the office
              </Button>
            </div>
          </div>
          <aside>
            <h2 className="font-serif text-2xl">Other states</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link href={`/coverage/${item.slug}`} className="text-ink-soft hover:text-brass-deep">
                    {item.state}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </article>
    </>
  );
}
