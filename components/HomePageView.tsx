"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AudienceTabs } from "@/components/AudienceTabs";
import { Button } from "@/components/Button";
import { QuoteLink } from "@/components/QuoteLink";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { Icon } from "@/components/Icon";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { Reveal } from "@/components/Reveal";
import { faLocationDot, iconFor, pillarIcons, reasonIcons, serviceIcons } from "@/lib/icons";
import { usePages } from "@/components/usePages";
import { type HomeContent } from "@/lib/home-content";
import { fillTree } from "@/lib/office";
import savedHome from "@/data/home.json";

const publishedHome = savedHome as HomeContent;
const publishedSlides = publishedHome.heroSlides?.length ? publishedHome.heroSlides : [publishedHome.heroImage];

export function HomePageView() {
  const pages = usePages();
  const [copy, setCopy] = useState<HomeContent>(publishedHome);
  const [slides, setSlides] = useState<string[]>(publishedSlides);
  const view = useMemo(() => fillTree(copy, pages.office) as HomeContent, [copy, pages.office]);

  useEffect(() => {
    let cancelled = false;
    function load() {
      fetch("/api/home")
        .then((response) => response.json())
        .then((body: { content?: HomeContent; slides?: string[] }) => {
          if (cancelled) return;
          if (body.content) setCopy(body.content);
          if (body.slides?.length) setSlides(body.slides);
        })
        .catch(() => undefined);
    }
    load();
    window.addEventListener("focus", load);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", load);
    };
  }, []);

  return (
    <>
      <section className="bg-ink text-paper">
        <div className="grid md:grid-cols-2">
          <Reveal className="order-2 flex flex-col items-end justify-center px-6 py-16 text-right md:order-1 md:px-10 lg:px-14 lg:py-20">
            <p className="title-kicker eyebrow text-brass">{view.heroEyebrow}</p>
            <h1 className="title-slide display mt-6 max-w-xl text-5xl text-paper sm:text-6xl xl:text-7xl">
              {view.heroHeadline}
            </h1>
            <p className="title-copy mt-6 max-w-md text-lg leading-relaxed text-paper/80">{view.heroLede}</p>
            <div className="title-copy mt-10 flex flex-col items-end gap-3 sm:flex-row sm:justify-end">
              <QuoteLink className="min-h-12 justify-center border border-paper bg-paper px-6 text-sm font-semibold tracking-wide text-ink hover:bg-paper-deep">
                Get an Instant Quote
              </QuoteLink>
              <Button href="/services" variant="ghost">
                Explore Our Services
              </Button>
            </div>
          </Reveal>
          <div className="relative order-1 h-56 overflow-hidden sm:h-64 md:order-2 md:h-auto">
            <HeroSlideshow images={slides} logo={view.heroLogo} logoSize={view.heroLogoSize} />
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3 md:px-8 md:py-16">
          {view.pillars.map((item, index) => (
            <div key={item.title}>
              <div className="relative aspect-[3/2] overflow-hidden bg-paper-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="mt-5 border-t border-brass pt-5">
                <h2 className="flex items-center gap-3 font-serif text-3xl">
                  <Icon icon={pillarIcons[index] ?? pillarIcons[0]} className="shrink-0 text-2xl text-brass" />
                  {item.title}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="title-kicker eyebrow text-brass">{view.servicesEyebrow}</p>
            <h2 className="title-slide display mt-4 max-w-xl text-5xl">{view.servicesHeading}</h2>
          </div>
          <p className="title-copy max-w-sm leading-relaxed text-ink-soft">{view.servicesLede}</p>
        </Reveal>
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {pages.services.items.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-paper p-7 transition-colors hover:bg-white"
            >
              <p className="text-xs tracking-[0.18em] text-brass">0{index + 1}</p>
              <h3 className="mt-4 flex items-start gap-3 font-serif text-3xl group-hover:text-brass-deep">
                <Icon icon={iconFor(serviceIcons, service.slug)} className="mt-1 shrink-0 text-2xl text-brass" />
                {service.title}
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{service.summary}</p>
              <span className="mt-6 inline-block text-sm font-semibold tracking-wide">Learn more</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep/40">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <Reveal>
            <p className="title-kicker eyebrow text-brass">{view.audienceEyebrow}</p>
            <h2 className="title-slide display mt-4 max-w-2xl text-5xl">{view.audienceHeading}</h2>
          </Reveal>
          <div className="mt-12">
            <AudienceTabs audiences={view.audiences} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="title-kicker eyebrow text-brass">{view.processEyebrow}</p>
          <h2 className="title-slide display mt-4 max-w-3xl text-5xl">{view.processHeading}</h2>
        </Reveal>
        <div className="mt-12">
          <ProcessTimeline steps={view.steps} />
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:px-8 lg:grid-cols-2 lg:py-28">
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={view.aboutImage}
              alt="Photograph beside the Integrity Title Group introduction."
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <Reveal>
            <p className="title-kicker eyebrow text-brass">{view.aboutEyebrow}</p>
            <h2 className="title-slide display mt-4 text-5xl">{view.aboutHeading}</h2>
            <p className="title-copy mt-6 leading-relaxed text-paper/80">{view.aboutLead}</p>
            <p className="title-copy mt-4 leading-relaxed text-paper/80">{view.aboutBody}</p>
            <div className="mt-8">
              <Button href="/about" variant="inverse">
                About Integrity Title Group
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <Reveal>
          <p className="title-kicker eyebrow text-brass">{view.whyEyebrow}</p>
          <h2 className="title-slide display mt-4 max-w-2xl text-5xl">{view.whyHeading}</h2>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {view.reasons.map((item, index) => (
            <article key={item.title} className="border-t border-ink pt-5">
              <h3 className="flex items-center gap-3 font-serif text-3xl">
                <Icon icon={reasonIcons[index] ?? reasonIcons[0]} className="shrink-0 text-2xl text-brass" />
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:px-8 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <p className="title-kicker eyebrow text-brass">{view.coverageEyebrow}</p>
            <h2 className="title-slide display mt-4 text-5xl">{view.coverageHeading}</h2>
            <p className="title-copy mt-6 leading-relaxed text-ink-soft">{view.coverageText}</p>
            <div className="mt-8">
              <Button href="/coverage">View coverage</Button>
            </div>
          </Reveal>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 self-center text-sm tracking-wide sm:grid-cols-3">
            {pages.coverage.states.map((state) => (
              <li key={state} className="flex items-center gap-2 border-b border-line py-3">
                <Icon icon={faLocationDot} className="text-xs text-brass" />
                {state}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <Reveal className="grid items-end gap-8 lg:grid-cols-2">
          <div>
            <p className="title-kicker eyebrow text-brass">{view.ctaEyebrow}</p>
            <h2 className="title-slide display mt-4 text-5xl md:text-6xl">{view.ctaHeading}</h2>
          </div>
          <p className="title-copy leading-relaxed text-ink-soft">{view.ctaText}</p>
        </Reveal>
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
