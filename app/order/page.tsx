import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { QuoteLink } from "@/components/QuoteLink";
import { orderIcons, pageIcons } from "@/lib/icons";
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
      <PageHero
        eyebrow="Orders"
        title="Start a title order."
        lede="Purchase and refinance orders go to the orders desk. Include the sale agreement on a purchase. If you only need figures, request a quote instead of opening a file."
        icon={pageIcons.order}
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
            <li className="flex gap-3">
              <Icon icon={orderIcons[0]} className="mt-1 shrink-0 text-brass" />
              <span>Purchase orders should include the sale agreement.</span>
            </li>
            <li className="flex gap-3">
              <Icon icon={orderIcons[1]} className="mt-1 shrink-0 text-brass" />
              <span>Refinance orders can be sent on their own.</span>
            </li>
            <li className="flex gap-3">
              <Icon icon={orderIcons[2]} className="mt-1 shrink-0 text-brass" />
              <span>
                Quotes and pre-closing disclosures, if you are comparing fees, go to{" "}
                <a className="underline" href={`mailto:${departments.preCd.email}`}>
                  {departments.preCd.email}
                </a>
                .
              </span>
            </li>
            <li className="flex gap-3">
              <Icon icon={orderIcons[3]} className="mt-1 shrink-0 text-brass" />
              <span>Do not include account numbers, Social Security numbers, or wire instructions.</span>
            </li>
          </ul>
          <QuoteLink className="mt-8 inline-flex min-h-12 items-center justify-center border border-ink px-6 text-sm font-semibold hover:border-brass-deep hover:text-brass-deep">
            Request a quote
          </QuoteLink>
          <p className="mt-3 text-sm text-muted">
            The quote tool is the same secure request used for fee questions. You can also call {site.phone}.
          </p>
          <p className="mt-3 text-sm text-muted">
            <a
              href={site.qualiaConnectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Sign in to the closing platform
            </a>{" "}
            if you already have access to a file.
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
