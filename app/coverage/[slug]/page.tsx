import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationView } from "@/components/pages/LocationView";
import { getLocation, locationPages } from "@/lib/locations";

export function generateStaticParams() {
  return locationPages().map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  return {
    title: location.title,
    description: location.description,
    alternates: { canonical: `/coverage/${location.slug}` },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getLocation(slug)) notFound();
  return <LocationView slug={slug} />;
}
