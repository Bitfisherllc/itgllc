import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createRequire } from "node:module";
import { PerspectiveView } from "@/components/pages/PerspectiveView";
import { getPerspectivePost, isLivePost, perspectivePosts } from "@/lib/perspective";

const auth = createRequire(import.meta.url)("../../../../server/auth.js") as {
  tokenIsValid: (token: string) => boolean;
};

export function generateStaticParams() {
  return perspectivePosts.filter((post) => isLivePost(post)).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPerspectivePost(slug);
  if (!post || !isLivePost(post)) return {};
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.summary;
  const path = `/resources/the-closing-perspective/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      images: post.image ? [{ url: post.image, alt: post.imageAlt }] : undefined,
    },
  };
}

export default async function PerspectivePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPerspectivePost(slug);
  if (!post) notFound();
  if (!isLivePost(post)) {
    const token = (await cookies()).get("itg_admin")?.value || "";
    if (!auth.tokenIsValid(token)) notFound();
  }
  return <PerspectiveView slug={slug} />;
}
