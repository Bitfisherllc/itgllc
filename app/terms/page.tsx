import type { Metadata } from "next";
import { TermsView } from "@/components/pages/TermsView";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms for using the Integrity Title Group website, including the limits of educational pages and online inquiries.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <TermsView />;
}
