import { pageCopy, type ServiceCopy } from "@/lib/page-copy";

export type Service = ServiceCopy;

export const services: Service[] = pageCopy.services.items;

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
