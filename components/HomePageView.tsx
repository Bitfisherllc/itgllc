"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AudienceTabs } from "@/components/AudienceTabs";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { faLocationDot, iconFor, pillarIcons, reasonIcons, serviceIcons } from "@/lib/icons";
import { coverageStates } from "@/lib/site";
import { services } from "@/lib/services";
import { defaultHomeContent, type HomeContent } from "@/lib/home-content";

export function HomePageView() {
  const [copy, setCopy] = useState<HomeContent>(defaultHomeContent);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/home")
      .then((response) => response.json())
      .then((body: { content?: HomeContent }) => {
        if (!cancelled && body.content) setCopy(body.content);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="bg-ink text-paper">
        <div className="grid md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:px-10 lg:px-14 lg:py-20">
            <p className="eyebrow rise text-brass">{copy.heroEyebrow}</p>
            <h1 className="display rise mt-6 max-w-xl text-5xl text-paper sm:text-6xl xl:text-7xl" style={{ animationDelay: "80ms" }}>
              {copy.heroHeadline}
            </h1>
            <p className="rise mt-6 max-w-md text-lg leading-relaxed text-paper/80" style={{ animationDelay: "160ms" }}>
              {copy.heroLede}
            </p>
            <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
              <Button href="/order" variant="inverse">
                Start a Title Order
              </Button>
              <Button href="/services" variant="ghost">
                Explore Our Services
              </Button>
            </div>
          </div>
          <div className="relative order-1 h-56 overflow-hidden sm:h-64 md:order-2 md:h-auto">
            <Image
              src="/images/baltimore-harbor.jpg"
              alt="Baltimore harbor and skyline at dusk, near Integrity Title Group’s Maryland office."
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="hero-photo object-cover"
            />
            <div className="pointer-events-none absolute inset-5 border border-white/35 md:inset-8" />
            <div className="pointer-events-none absolute inset-8 border border-brass/80 md:inset-12" />
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:px-8 md:py-16">
          {copy.pillars.map((item, index) => (
            <div key={item.title} className="border-t border-brass pt-5">
              <Icon icon={pillarIcons[index] ?? pillarIcons[0]} className="text-xl text-brass" />
              <h2 className="mt-4 font-serif text-3xl">{item.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-brass">{copy.servicesEyebrow}</p>
            <h2 className="display mt-4 max-w-xl text-5xl">{copy.servicesHeading}</h2>
          </div>
          <p className="max-w-sm leading-relaxed text-ink-soft">{copy.servicesLede}</p>
        </div>
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-paper p-7 transition-colors hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs tracking-[0.18em] text-brass">0{index + 1}</p>
                <Icon icon={iconFor(serviceIcons, service.slug)} className="text-lg text-brass" />
              </div>
              <h3 className="mt-4 font-serif text-3xl group-hover:text-brass-deep">{service.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{service.summary}</p>
              <span className="mt-6 inline-block text-sm font-semibold tracking-wide">Learn more</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep/40">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <p className="eyebrow text-brass">{copy.audienceEyebrow}</p>
          <h2 className="display mt-4 max-w-2xl text-5xl">{copy.audienceHeading}</h2>
          <div className="mt-12">
            <AudienceTabs audiences={copy.audiences} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="eyebrow text-brass">{copy.processEyebrow}</p>
        <h2 className="display mt-4 max-w-3xl text-5xl">{copy.processHeading}</h2>
        <div className="mt-12">
          <ProcessTimeline steps={copy.steps} />
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:px-8 lg:grid-cols-2 lg:py-28">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/closing-review.jpg"
              alt="Professionals reviewing closing documents together at a conference table."
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow text-brass">{copy.aboutEyebrow}</p>
            <h2 className="display mt-4 text-5xl">{copy.aboutHeading}</h2>
            <p className="mt-6 leading-relaxed text-paper/80">{copy.aboutLead}</p>
            <p className="mt-4 leading-relaxed text-paper/80">{copy.aboutBody}</p>
            <div className="mt-8">
              <Button href="/about" variant="inverse">
                About Integrity Title Group
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="eyebrow text-brass">{copy.whyEyebrow}</p>
        <h2 className="display mt-4 max-w-2xl text-5xl">{copy.whyHeading}</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {copy.reasons.map((item, index) => (
            <article key={item.title} className="border-t border-ink pt-5">
              <Icon icon={reasonIcons[index] ?? reasonIcons[0]} className="text-xl text-brass" />
              <h3 className="mt-4 font-serif text-3xl">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow text-brass">{copy.coverageEyebrow}</p>
            <h2 className="display mt-4 text-5xl">{copy.coverageHeading}</h2>
            <p className="mt-6 leading-relaxed text-ink-soft">{copy.coverageText}</p>
            <div className="mt-8">
              <Button href="/coverage">View coverage</Button>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 self-center text-sm tracking-wide sm:grid-cols-3">
            {coverageStates.map((state) => (
              <li key={state} className="flex items-center gap-2 border-b border-line py-3">
                <Icon icon={faLocationDot} className="text-xs text-brass" />
                {state}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-brass">{copy.ctaEyebrow}</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">{copy.ctaHeading}</h2>
          </div>
          <p className="leading-relaxed text-ink-soft">{copy.ctaText}</p>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/order">Start a Title Order</Button>
          <Button href="/contact" variant="ghost">
            Contact the office
          </Button>
        </div>
      </section>
    </>
  );
}
