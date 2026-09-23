"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { LinkedText } from "@/components/LinkedText";
import { PageHero } from "@/components/PageHero";
import { QuoteLink } from "@/components/QuoteLink";
import { usePages } from "@/components/usePages";
import { orderIcons, pageIcons } from "@/lib/icons";
import { site } from "@/lib/site";

export function OrderView() {
  const { order } = usePages();

  return (
    <>
      <PageHero eyebrow={order.eyebrow} title={order.title} lede={order.lede} icon={pageIcons.order} />
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Start an order", path: "/order" },
            ]}
          />
          <h2 className="font-serif text-3xl">{order.beforeHeading}</h2>
          <ul className="mt-6 space-y-4 leading-relaxed text-ink-soft">
            {order.notes.map((note, index) => (
              <li key={note} className="flex gap-3">
                <Icon icon={orderIcons[index] ?? orderIcons[0]} className="mt-1 shrink-0 text-brass" />
                <span>
                  <LinkedText text={note} />
                </span>
              </li>
            ))}
          </ul>
          <QuoteLink className="mt-8 inline-flex min-h-12 items-center justify-center border border-ink px-6 text-sm font-semibold hover:border-brass-deep hover:text-brass-deep">
            {order.quoteLabel}
          </QuoteLink>
          <p className="mt-3 text-sm text-muted">{order.quoteNote}</p>
          <p className="mt-3 text-sm text-muted">
            <a href={site.qualiaConnectUrl} target="_blank" rel="noopener noreferrer" className="underline">
              {order.platformLabel}
            </a>{" "}
            {order.platformNote}
          </p>
        </div>
        <div className="lg:col-span-7">
          <h2 className="font-serif text-3xl">{order.formHeading}</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            <LinkedText text={order.formIntro} />
          </p>
          <div className="mt-8">
            <InquiryForm intent="order" />
          </div>
        </div>
      </div>
    </>
  );
}
