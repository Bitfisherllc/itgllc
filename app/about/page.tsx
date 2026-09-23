import type { Metadata } from "next";
import { AboutView } from "@/components/pages/AboutView";

export const metadata: Metadata = {
  title: "About",
  description:
    "Integrity Title Group is a Maryland title and settlement office. Client care, processing, and post-closing stay with the file from order to recording.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutView />;
}
