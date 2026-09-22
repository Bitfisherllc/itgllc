import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclaimer } from "@/components/Disclaimer";
import { FaqList } from "@/components/FaqList";
import { PageHero } from "@/components/PageHero";
import { iconFor, resourceIcons } from "@/lib/icons";
import { getResource, resources } from "@/lib/resources";

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};
  return {
    title: resource.title,
    description: resource.summary,
    alternates: { canonical: `/resources/${resource.slug}` },
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title={resource.title}
        lede={resource.summary}
        icon={iconFor(resourceIcons, resource.slug)}
      />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: resource.title, path: `/resources/${resource.slug}` },
          ]}
        />
        {resource.disclaimer ? (
          <div className="mb-10">
            <Disclaimer />
          </div>
        ) : null}
        {resource.slug === "faq" ? <FaqList /> : null}
        <div className="space-y-10">
          {resource.sections.map((section) => (
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
      </article>
    </>
  );
}
