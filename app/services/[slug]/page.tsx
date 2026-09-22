import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { iconFor, serviceIcons } from "@/lib/icons";
import { getService, services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={service.title}
        lede={service.summary}
        icon={iconFor(serviceIcons, service.slug)}
      />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]}
        />
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
      </article>
    </>
  );
}
