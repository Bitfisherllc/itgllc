import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { resources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides from Integrity Title Group on orders, closing, title insurance in general terms, and what buyers, sellers, agents, and lenders should send.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Clear answers before the file gets complicated."
        lede="Practical notes on how ITG opens and completes a transaction. Educational pages are marked when they are general information rather than advice."
      />
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
          ]}
        />
        <div className="grid gap-px bg-line sm:grid-cols-2">
          {resources.map((resource) => (
            <Link
              key={resource.slug}
              href={`/resources/${resource.slug}`}
              className="bg-paper p-8 transition-colors hover:bg-white"
            >
              <h2 className="font-serif text-3xl">{resource.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{resource.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
