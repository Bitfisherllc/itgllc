import type { Metadata } from "next";
import { ArticlesView } from "@/components/pages/ArticlesView";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Archived articles from Integrity Title Group on industry alerts and housing-market commentary.",
  alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
  return <ArticlesView />;
}
