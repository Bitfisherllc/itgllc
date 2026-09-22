import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Integrity Title Group is a Maryland title and settlement office. Client care, processing, and post-closing stay with the file from order to recording.",
  alternates: { canonical: "/about" },
};

const teams = [
  {
    title: "Client care",
    text: "The first point of contact. The relationship starts here, before a processor is assigned and before a file has a life of its own.",
  },
  {
    title: "Title processing",
    text: "Once the order is in, a processor takes the file — including complicated matters — and becomes the contact for that order.",
  },
  {
    title: "Post-closing and funding",
    text: "After signing, this team handles funding, recording, and document audits, with authorization and layered verification.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A title office organized around the closing."
        lede="Integrity Title Group provides title and settlement services with a client-first standard: open the order properly, work it carefully, and carry it through recording."
      />
      <article className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]}
        />
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/agreement.jpg"
              alt="A closing handshake over documents and a calculator on a conference table."
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-xl">
            <p className="leading-relaxed text-ink-soft">
              {site.legalName} is based in Nottingham, Maryland. The practice was created by real estate insiders, with more than 30 years of combined title experience. The mission was written with clients in mind: take the unfamiliar parts of a transaction and give them a clear owner.
            </p>
            <p className="mt-5 leading-relaxed text-ink-soft">
              When it comes to title, the office measures itself by speed and accuracy. That shows up in ordinary details — sending the sale agreement with a purchase order, routing a fee question to the disclosure desk, and leaving funding and recording with post-closing after the papers are signed.
            </p>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Documents move through Qualia, the secure portal shared with lenders, real estate agents, and clients. The portal is how the file stays in one place. Payment instructions are still confirmed by calling the published office number.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="display text-4xl md:text-5xl">Three desks. One file.</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {teams.map((team) => (
              <article key={team.title} className="border-t border-brass pt-5">
                <h3 className="font-serif text-2xl">{team.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{team.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Button href="/contact">Contact the office</Button>
        </div>
      </article>
    </>
  );
}
