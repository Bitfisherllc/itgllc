"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { pageIcons } from "@/lib/icons";

export function TeamView() {
  const { team } = usePages();
  const people = team.people.filter((person) => person.name);

  return (
    <>
      <PageHero eyebrow={team.eyebrow} title={team.title} lede={team.lede} icon={pageIcons.team} />
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Our team", path: "/team" },
          ]}
        />
        {people.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => (
              <li key={`${person.name}-${person.role}`} className="border border-line bg-white p-6">
                {person.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={person.image} alt={person.name} className="mb-5 h-auto w-full rounded-lg" />
                ) : null}
                <h2 className="font-serif text-2xl">{person.name}</h2>
                {person.role ? <p className="mt-2 text-sm font-semibold text-brass-deep">{person.role}</p> : null}
                {person.excerpt ? <p className="mt-4 leading-relaxed text-ink-soft">{person.excerpt}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}
