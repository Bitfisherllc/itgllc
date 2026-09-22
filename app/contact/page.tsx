import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { faEnvelope, faFax, faLocationDot, faPhone, pageIcons } from "@/lib/icons";
import { departments, formatAddress, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call, fax, or email Integrity Title Group in Nottingham, Maryland. Department addresses for orders, processing, disclosures, and post-closing.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="The right desk, the first time."
        lede="There are many steps in a settlement. For the fastest general answer, call during business hours. Use a department address when you already know which part of the file you need."
        icon={pageIcons.contact}
      />
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]}
          />
          <address className="not-italic">
            <p className="font-serif text-3xl">{site.legalName}</p>
            <p className="mt-4 flex items-start gap-3 leading-relaxed text-ink-soft">
              <Icon icon={faLocationDot} className="mt-1 text-brass" />
              <span>{formatAddress()}</span>
            </p>
            <p className="mt-4">
              <a href={site.phoneHref} className="inline-flex items-center gap-3 text-lg font-semibold">
                <Icon icon={faPhone} className="text-brass" />
                {site.phone}
              </a>
            </p>
            <p className="mt-2 flex items-center gap-3 text-ink-soft">
              <Icon icon={faFax} className="text-brass" />
              Fax {site.fax}
            </p>
          </address>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {Object.values(departments).map((department) => (
              <li key={department.email} className="py-4">
                <p className="text-sm font-semibold">{department.label}</p>
                <a href={`mailto:${department.email}`} className="inline-flex items-center gap-2 text-sm text-brass-deep">
                  <Icon icon={faEnvelope} className="text-xs text-brass" />
                  {department.email}
                </a>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{department.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <h2 className="font-serif text-3xl">Send a message</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">
            The form sends your message to ITG and routes it to the desk that matches your question.
          </p>
          <div className="mt-8">
            <InquiryForm intent="contact" />
          </div>
        </div>
      </div>
    </>
  );
}
