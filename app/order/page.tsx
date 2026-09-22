import type { Metadata } from "next";
import Script from "next/script";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { departments, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a Title Order",
  description:
    "Open a purchase or refinance title order with Integrity Title Group, or request a quote. Include the sale agreement on a purchase.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <>
      <Script
        src="https://connect.qualia.com/quote-widget/scripts/init"
        id="qualia-quote-widget-loader"
        data-token={site.qualiaQuoteToken}
        strategy="afterInteractive"
      />
      <PageHero
        eyebrow="Orders"
        title="Start a title order."
        lede="Purchase and refinance orders go to the orders desk. Include the sale agreement on a purchase. If you only need figures, request a quote instead of opening a file."
      />
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Start an order", path: "/order" },
            ]}
          />
          <h2 className="font-serif text-3xl">Before you send it</h2>
          <ul className="mt-6 space-y-4 leading-relaxed text-ink-soft">
            <li>Purchase orders should include the sale agreement.</li>
            <li>Refinance orders can be sent on their own.</li>
            <li>
              Quotes and pre-closing disclosures, if you are comparing fees, go to{" "}
              <a className="underline" href={`mailto:${departments.preCd.email}`}>
                {departments.preCd.email}
              </a>
              .
            </li>
            <li>Do not include account numbers, Social Security numbers, or wire instructions.</li>
          </ul>
          <a
            href="#"
            className="get-qualia-quote mt-8 inline-flex min-h-12 items-center justify-center border border-ink px-6 text-sm font-semibold"
          >
            Request a quote
          </a>
          <p className="mt-3 text-sm text-muted">
            The quote tool is the same secure request used for fee questions. You can also call {site.phone}.
          </p>
        </div>
        <div className="lg:col-span-7">
          <h2 className="font-serif text-3xl">Order request</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            This sends an order request to {departments.orders.email}. A purchase still needs the sale agreement emailed separately. This form cannot take attachments.
          </p>
          <div className="mt-8">
            <InquiryForm intent="order" />
          </div>
        </div>
      </div>
    </>
  );
}
