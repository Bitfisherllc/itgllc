"use client";

import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { iconFor, pageIcons, serviceIcons } from "@/lib/icons";

export function ServicesView() {
  const { services } = usePages();

  return (
    <>
      <PageHero eyebrow={services.eyebrow} title={services.title} lede={services.lede} icon={pageIcons.services} />
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]}
        />
        <div className="divide-y divide-line border-y border-line">
          {services.items.map((service, index) => (
            <article key={service.slug} className="grid gap-4 py-8 md:grid-cols-12 md:items-start">
              <p className="text-xs tracking-[0.18em] text-brass md:col-span-1">0{index + 1}</p>
              <div className="md:col-span-5">
                <h2 className="flex items-start gap-3 font-serif text-3xl">
                  <Icon icon={iconFor(serviceIcons, service.slug)} className="mt-1 shrink-0 text-2xl text-brass" />
                  <Link href={`/services/${service.slug}`} className="hover:text-brass-deep">
                    {service.title}
                  </Link>
                </h2>
              </div>
              <p className="leading-relaxed text-ink-soft md:col-span-5">{service.summary}</p>
              <Link
                href={`/services/${service.slug}`}
                className="text-sm font-semibold tracking-wide md:col-span-1 md:text-right"
              >
                View
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
