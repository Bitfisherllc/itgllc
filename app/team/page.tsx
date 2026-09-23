import type { Metadata } from "next";
import { TeamView } from "@/components/pages/TeamView";

export const metadata: Metadata = {
  title: "Our team",
  description:
    "The people at Integrity Title Group who open, process, and complete a title file.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return <TeamView />;
}
