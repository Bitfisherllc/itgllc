"use client";

import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { OfficeMap } from "@/components/OfficeMap";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { pageIcons, teamIcons } from "@/lib/icons";
import { familyPath } from "@/lib/page-copy";
import { FamilyPhoto } from "@/components/pages/FamilyView";

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
            <div className="mt-8">
              <Button href="/team">Meet the team</Button>
            </div>
          </div>
        </div>

        <OfficeMap />

        <div className="mt-20 border-t border-line pt-16">
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

        <section className="mt-20 border-t border-line pt-16" aria-labelledby="owner-heading">
          <div className="grid items-start gap-10 md:grid-cols-[16rem_1fr] md:gap-12">
            <div className="max-w-xs">
              <FamilyPhoto src={about.family.portrait} alt={about.family.portraitAlt} />
            </div>
            <div className="max-w-xl">
              <h2 id="owner-heading" className="display text-4xl md:text-5xl">
                {about.family.introHeading}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">“{about.family.introQuote}”</p>
              <div className="mt-8">
                <Button href={familyPath}>{about.family.introButton}</Button>
              </div>
            </div>
          </div>
        </section>

      </article>
    </>
  );
}
