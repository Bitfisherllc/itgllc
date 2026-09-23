import type { Metadata } from "next";
import { CoverageView } from "@/components/pages/CoverageView";

export const metadata: Metadata = {
  title: "Service Locations",
  description:
    "Integrity Title Group offers title and settlement services in eleven states from its Nottingham, Maryland office, with partner help possible elsewhere.",
  alternates: { canonical: "/coverage" },
};

export default function CoveragePage() {
  return <CoverageView />;
}
