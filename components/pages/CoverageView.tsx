"use client";

import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { faLocationDot, pageIcons } from "@/lib/icons";

export function CoverageView() {
  const { coverage } = usePages();

  return (
    <>
      <PageHero eyebrow={coverage.eyebrow} title={coverage.title} lede={coverage.lede} icon={pageIcons.coverage} />
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Service Locations", path: "/coverage" },
          ]}
        />
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <figure>
            <Image
              src="/images/coverage-map.jpg"
              alt={coverage.mapAlt}
              width={1920}
              height={940}
              className="h-auto w-full rounded-lg border border-line"
            />
            <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink">
              <span className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 bg-brass" aria-hidden="true" />
                {coverage.licensedLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 border border-line" style={{ background: "#e4e4e4" }} aria-hidden="true" />
                {coverage.unlicensedLabel}
              </span>
            </figcaption>
          </figure>
          <div>
            <h2 className="font-serif text-3xl">{coverage.statesHeading}</h2>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {coverage.states.map((state) => (
                <li key={state} className="flex items-center gap-2 border-b border-line py-3">
                  <Icon icon={faLocationDot} className="text-xs text-brass" />
                  {state}
                </li>
              ))}
            </ul>
            <p className="mt-8 leading-relaxed text-ink-soft">{coverage.note}</p>
            <div className="mt-8">
              <Button href="/order">{coverage.buttonLabel}</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
