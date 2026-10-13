import type { MetadataRoute } from "next";
import { locationPages } from "@/lib/locations";
import { isLivePost, perspectivePosts } from "@/lib/perspective";
import { resources } from "@/lib/resources";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/about",
    "/about/dan-heart",
    "/team",
    "/services",
    "/resources",
    "/resources/the-closing-perspective",
    "/coverage",
    "/contact",
    "/order",
    "/privacy",
    "/terms",
    ...services.map((service) => `/services/${service.slug}`),
    ...locationPages().map((location) => `/coverage/${location.slug}`),
    ...resources.map((resource) => `/resources/${resource.slug}`),
    ...perspectivePosts.filter((post) => isLivePost(post)).map((post) => `/resources/the-closing-perspective/${post.slug}`),
  ];

  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
