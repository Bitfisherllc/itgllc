import { pageCopy, type ResourceCopy, type ResourceSectionCopy } from "@/lib/page-copy";

export type ResourceSection = ResourceSectionCopy;
export type Resource = ResourceCopy;

export const resources: Resource[] = pageCopy.resources.items;
export const faqs = pageCopy.resources.faqs;

export function getResource(slug: string) {
  return resources.find((resource) => resource.slug === slug);
}
