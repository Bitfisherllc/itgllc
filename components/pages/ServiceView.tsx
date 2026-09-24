"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { iconFor, serviceIcons } from "@/lib/icons";

export function ServiceView({ slug }: { slug: string }) {
  const { services } = usePages();
  const service = services.items.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        eyebrow={services.eyebrow}
        title={service.title}
        lede={service.summary}
        icon={iconFor(serviceIcons, service.slug)}
      />
      <article className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]}
        />
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-xl">
            <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
              {service.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Button href="/order">Start a Title Order</Button>
              <Button href="/services" variant="ghost">
                All services
              </Button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
