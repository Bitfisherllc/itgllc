import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
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
            <p className="mt-4 leading-relaxed text-ink-soft">{formatAddress()}</p>
            <p className="mt-4">
              <a href={site.phoneHref} className="text-lg font-semibold">
                {site.phone}
              </a>
            </p>
            <p className="mt-1 text-ink-soft">Fax {site.fax}</p>
          </address>
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {Object.values(departments).map((department) => (
              <li key={department.email} className="py-4">
                <p className="text-sm font-semibold">{department.label}</p>
                <a href={`mailto:${department.email}`} className="text-sm text-brass-deep">
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
            The form prepares an email to the desk that matches your question. It does not store a copy on this website.
          </p>
          <div className="mt-8">
            <InquiryForm intent="contact" />
          </div>
        </div>
      </div>
    </>
  );
}
