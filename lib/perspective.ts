import { pageCopy, type PerspectivePost } from "@/lib/page-copy";

export type { PerspectivePost };

export const perspectiveTopics = [
  { slug: "homebuyers", label: "Homebuyers" },
  { slug: "home-sellers", label: "Home Sellers" },
  { slug: "real-estate-professionals", label: "Real Estate Professionals" },
  { slug: "title-insurance-security", label: "Title Insurance & Security" },
  { slug: "refinancing-settlement", label: "Refinancing & Settlement Services" },
  { slug: "real-estate-insights", label: "Real Estate Insights" },
] as const;

export const perspectivePosts: PerspectivePost[] = pageCopy.perspective.items;

export function getPerspectivePost(slug: string) {
  return perspectivePosts.find((post) => post.slug === slug);
}

export function topicLabel(slug: string) {
  return perspectiveTopics.find((topic) => topic.slug === slug)?.label || "Note";
}

export function todayIso(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function isLivePost(post: PerspectivePost, today = todayIso()) {
  if (!post.published || !post.slug || !post.title) return false;
  if (post.date && post.date > today) return false;
  return true;
}

export function readingMinutes(post: PerspectivePost) {
  const text = [
    post.answer,
    post.summary,
    ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs, ...(section.items || []), section.note || ""]),
    ...post.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatPostDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function headingId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
