import { pageCopy, type ArticleCopy, type ArticleSectionCopy } from "@/lib/page-copy";

export type ArticleSection = ArticleSectionCopy;
export type Article = ArticleCopy;

export const articles: Article[] = pageCopy.articles.items;

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
