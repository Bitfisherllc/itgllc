import type { Metadata } from "next";
import { ResourcesView } from "@/components/pages/ResourcesView";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides from Integrity Title Group on orders, closing, title insurance in general terms, and what buyers, sellers, agents, and lenders should send.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return <ResourcesView />;
}
