import type { Metadata } from "next";
import { OrderView } from "@/components/pages/OrderView";

export const metadata: Metadata = {
  title: "Start a Title Order",
  description:
    "Open a purchase or refinance title order with Integrity Title Group, or request a quote. Include the sale agreement on a purchase.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return <OrderView />;
}
