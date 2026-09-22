import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { iconFor, pageIcons, serviceIcons } from "@/lib/icons";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Title and settlement services from Integrity Title Group: purchases, refinances, processing, closing, post-closing, quotes, and a secure document portal.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What the office actually handles."
        lede="Every service below is part of how ITG opens, processes, settles, and completes a purchase or refinance file. Nothing here is a product the office has not described."
        icon={pageIcons.services}
      />
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]}
        />
        <div className="divide-y divide-line border-y border-line">
          {services.map((service, index) => (
            <article key={service.slug} className="grid gap-4 py-8 md:grid-cols-12 md:items-start">
              <p className="flex items-center gap-3 text-xs tracking-[0.18em] text-brass md:col-span-2">
                <Icon icon={iconFor(serviceIcons, service.slug)} className="text-lg text-brass" />
                0{index + 1}
              </p>
              <div className="md:col-span-4">
                <h2 className="font-serif text-3xl">
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
