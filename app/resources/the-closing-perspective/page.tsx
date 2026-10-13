import type { Metadata } from "next";
import { Suspense } from "react";
import { PerspectiveView } from "@/components/pages/PerspectiveView";

export const metadata: Metadata = {
  title: "The Closing Perspective",
  description: "Insights, Advice & Answers for Every Step of Your Real Estate Journey.",
  alternates: { canonical: "/resources/the-closing-perspective" },
  openGraph: {
    title: "The Closing Perspective",
    description: "Insights, Advice & Answers for Every Step of Your Real Estate Journey.",
    url: "/resources/the-closing-perspective",
    type: "website",
  },
};

export default function PerspectivePage() {
  return (
    <Suspense>
      <PerspectiveView />
    </Suspense>
  );
}
