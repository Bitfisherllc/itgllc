import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms for using the Integrity Title Group website, including the limits of educational pages and online inquiries.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="How to read this website."
        lede="The site introduces Integrity Title Group and explains how to start a conversation. It does not complete a closing by itself."
      />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Terms", path: "/terms" },
          ]}
        />
        <div className="space-y-5 leading-relaxed text-ink-soft">
          <p>
            Content on this website is published by {site.legalName} for general information. Resource pages that discuss title insurance or the closing process are not legal advice, not a title policy, and not a quote. Coverage, exceptions, and fees depend on the specific transaction.
          </p>
          <p>
            An inquiry prepared by a form is not an opened title order until the office receives it and accepts the file. A purchase request should include the sale agreement. Sending a message does not create an attorney-client relationship or a commitment to insure title.
          </p>
          <p>
            Service-area statements describe where title and settlement services are offered. Properties outside those states should be confirmed with the office. Partner assistance, where it exists, is not a promise of coverage.
          </p>
          <p>
            The quote tool is provided through Qualia. Its availability can change, and a quote is not a completed title examination.
          </p>
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
        </div>
      </article>
    </>
  );
}
