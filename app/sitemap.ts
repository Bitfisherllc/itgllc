import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { resources } from "@/lib/resources";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/about",
    "/team",
    "/services",
    "/resources",
    "/articles",
    "/coverage",
    "/contact",
    "/order",
    "/privacy",
    "/terms",
    ...services.map((service) => `/services/${service.slug}`),
    ...resources.map((resource) => `/resources/${resource.slug}`),
    ...articles.map((article) => `/articles/${article.slug}`),
  ];

  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
