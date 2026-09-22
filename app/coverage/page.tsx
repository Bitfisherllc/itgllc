import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { coverageStates, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Where We Work",
  description:
    "Integrity Title Group offers title and settlement services in eleven states from its Nottingham, Maryland office, with partner help possible elsewhere.",
  alternates: { canonical: "/coverage" },
};

export default function CoveragePage() {
  return (
    <>
      <PageHero
        eyebrow="Coverage"
        title="Where the work is offered."
        lede="Integrity Title Group is a Maryland office offering title and settlement services across a defined set of states. Outside that list, ask — partner help may be available, and it is not automatic."
      />
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Where we work", path: "/coverage" },
          ]}
        />
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <figure>
            <Image
              src="/images/coverage-map.jpg"
              alt="Map of the United States highlighting Maryland, Pennsylvania, Virginia, Delaware, Indiana, Ohio, Kentucky, North Carolina, South Carolina, Florida, and New Jersey."
              width={1920}
              height={1080}
              className="h-auto w-full border border-line"
            />
            <figcaption className="mt-3 text-sm text-muted">
              Highlighted states are where title and settlement services are offered. The map’s legend uses the office’s published licensed / unlicensed labels.
            </figcaption>
          </figure>
          <div>
            <h2 className="font-serif text-3xl">States</h2>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {coverageStates.map((state) => (
                <li key={state} className="border-b border-line py-3">
                  {state}
                </li>
              ))}
            </ul>
            <p className="mt-8 leading-relaxed text-ink-soft">
              The office is at {site.address.street}, {site.address.city}, {site.address.region} {site.address.postalCode}. Call {site.phone} before opening an order on a property outside the highlighted states.
            </p>
            <div className="mt-8">
              <Button href="/order">Start a Title Order</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
