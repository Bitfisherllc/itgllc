import type { Metadata } from "next";
import { ResourcesView } from "@/components/pages/ResourcesView";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "The Closing Perspective, office questions, a glossary, and search. Explanations of closing and title insurance live in the journal.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return <ResourcesView />;
}
