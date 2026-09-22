import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHero } from "@/components/PageHero";
import { departments, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How the Integrity Title Group website handles inquiries, and what information you should not send through a form.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="What this website keeps."
        lede="The public site is a way to reach the office. It is not a place to send financial account numbers or government identifiers."
      />
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Privacy", path: "/privacy" },
          ]}
        />
        <div className="space-y-5 leading-relaxed text-ink-soft">
          <p>
            Contact and order forms on this website check what you typed, then prepare an email to the appropriate {site.legalName} address. The form does not save a copy of the message on the website server. Your email application sends it when you choose to send.
          </p>
          <p>
            Do not include Social Security numbers, bank account numbers, wire instructions, or similar financial details in a website form. Confirm payment instructions by calling {site.phone}.
          </p>
          <p>
            If you email the office directly, that message is handled by the desk you wrote to — orders, processing, pre-closing disclosures, post-closing, events, or {departments.general.email}. Closing files also move through Qualia, the secure portal used with lenders, agents, and clients.
          </p>
          <p>
            This site may be hosted on infrastructure that records ordinary technical logs, such as browser type and pages requested, to keep the site operating. Those logs are not a customer list.
          </p>
          <p>
            To ask a privacy question about a message you sent, write to {departments.general.email} or call the office.
          </p>
        </div>
      </article>
    </>
  );
}
