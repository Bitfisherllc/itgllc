"use client";

import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { OfficeMap } from "@/components/OfficeMap";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { pageIcons, teamIcons } from "@/lib/icons";

export function AboutView() {
  const { about } = usePages();

  return (
    <>
      <PageHero eyebrow={about.eyebrow} title={about.title} lede={about.lede} icon={pageIcons.about} />
      <article className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]}
        />
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="photo-shadow relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={about.image}
              alt={about.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-xl">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-5 leading-relaxed text-ink-soft first:mt-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <OfficeMap />

        <div className="mt-20">
          <h2 className="display text-4xl md:text-5xl">{about.teamsHeading}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {about.teams.map((team, index) => (
              <article key={team.title} className="border-t border-brass pt-5">
                <h3 className="flex items-center gap-3 font-serif text-2xl">
                  <Icon icon={teamIcons[index] ?? teamIcons[0]} className="shrink-0 text-xl text-brass" />
                  {team.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{team.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-3">
          <Button href="/team" variant="ghost">
            Our team
          </Button>
          <Button href="/contact">{about.buttonLabel}</Button>
        </div>
      </article>
    </>
  );
}
