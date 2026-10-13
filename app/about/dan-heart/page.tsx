import type { Metadata } from "next";
import { FamilyView } from "@/components/pages/FamilyView";

export const metadata: Metadata = {
  title: "Meet the Owner",
  description:
    "Meet Dan Heart, owner of Integrity Title Group, and the family and team behind the Nottingham, Maryland office.",
  alternates: { canonical: "/about/dan-heart" },
};

export default function FamilyPage() {
  return <FamilyView />;
}
