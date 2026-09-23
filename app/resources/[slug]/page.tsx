import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceView } from "@/components/pages/ResourceView";
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
  if (!getResource(slug)) notFound();
  return <ResourceView slug={slug} />;
}
