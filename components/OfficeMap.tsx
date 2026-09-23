"use client";

import { Reveal } from "@/components/Reveal";
import { usePages } from "@/components/usePages";
import { formatOfficeAddress, googleDirectionsUrl, googleMapEmbedUrl, telHref } from "@/lib/office";

export function OfficeMap() {
  const office = usePages().office;
  const address = formatOfficeAddress(office);
  const directions = googleDirectionsUrl(office);

  return (
    <section className="mt-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <p className="title-kicker eyebrow text-brass">
            {office.city}, {office.region}
          </p>
          <h2 className="title-slide display mt-4 text-4xl md:text-5xl">The office</h2>
          <p className="title-copy mt-4 leading-relaxed text-ink-soft">{address}</p>
          <p className="title-copy mt-2">
            <a href={telHref(office.phone)} className="font-semibold hover:text-brass-deep">
              {office.phone}
            </a>
          </p>
        </Reveal>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 w-fit items-center justify-center border border-ink bg-ink px-6 text-sm font-semibold tracking-wide text-paper transition-colors hover:border-brass-deep hover:bg-brass-deep"
        >
          Get Directions
        </a>
      </div>
      <iframe
        key={address}
        title={`Map of the Integrity Title Group office in ${office.city}, ${office.region}`}
        src={googleMapEmbedUrl(office)}
        className="mt-8 h-80 w-full border-0 md:h-[28rem]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
