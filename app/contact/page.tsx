import type { Metadata } from "next";
import { ContactView } from "@/components/pages/ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call, fax, or email Integrity Title Group in Nottingham, Maryland. Department addresses for orders, processing, disclosures, and post-closing.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView />;
}
