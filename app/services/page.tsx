import type { Metadata } from "next";
import { ServicesView } from "@/components/pages/ServicesView";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Title and settlement services from Integrity Title Group: purchases, refinances, processing, closing, post-closing, quotes, and a secure document portal.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesView />;
}
