import type { MetadataRoute } from "next";
import { resources } from "@/lib/resources";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/about",
    "/services",
    "/resources",
    "/coverage",
    "/contact",
    "/order",
    "/privacy",
    "/terms",
    ...services.map((service) => `/services/${service.slug}`),
    ...resources.map((resource) => `/resources/${resource.slug}`),
  ];

  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
