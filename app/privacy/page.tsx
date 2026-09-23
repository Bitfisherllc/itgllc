import type { Metadata } from "next";
import { PrivacyView } from "@/components/pages/PrivacyView";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How the Integrity Title Group website handles inquiries, and what information you should not send through a form.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <PrivacyView />;
}
