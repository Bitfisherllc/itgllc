import Image from "next/image";
import Link from "next/link";
import { AudienceTabs } from "@/components/AudienceTabs";
import { Button } from "@/components/Button";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { coverageStates, site } from "@/lib/site";
import { services } from "@/lib/services";

export default function HomePage() {
  return (
    <>
      <section className="bg-ink text-paper">
        <div className="grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-6 py-16 md:px-10 lg:order-1 lg:px-14 lg:py-20">
            <p className="eyebrow rise text-brass">{site.legalName}</p>
            <h1 className="display rise mt-6 max-w-xl text-5xl text-paper sm:text-6xl xl:text-7xl" style={{ animationDelay: "80ms" }}>
              Integrity at every closing.
            </h1>
            <p className="rise mt-6 max-w-md text-lg leading-relaxed text-paper/80" style={{ animationDelay: "160ms" }}>
              Professional title and settlement services for purchase and refinance transactions — secure, accurate, and straightforward from the opened order through recording.
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
          <div className="relative order-1 min-h-[58vw] overflow-hidden lg:order-2 lg:min-h-full">
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
          {[
            ["Accurate", "Title orders are opened with the documents the file actually needs, starting with the sale agreement on a purchase."],
            ["Secure", "Lenders, agents, and clients exchange documents through Qualia, the secure portal ITG uses for the closing."],
            ["Responsive", "Client care, processing, and post-closing each have a desk, so a question reaches the people who have the file."],
          ].map(([title, text]) => (
            <div key={title} className="border-t border-brass pt-5">
              <h2 className="font-serif text-3xl">{title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-brass">Services</p>
            <h2 className="display mt-4 max-w-xl text-5xl">Title work, carried through recording.</h2>
          </div>
          <p className="max-w-sm leading-relaxed text-ink-soft">
            Real estate transactions turn on documents, deadlines, and funds. ITG stays with the file from the first order to the recording process.
          </p>
        </div>
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-paper p-7 transition-colors hover:bg-white"
            >
              <p className="text-xs tracking-[0.18em] text-brass">0{index + 1}</p>
              <h3 className="mt-4 font-serif text-3xl group-hover:text-brass-deep">{service.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-ink-soft">{service.summary}</p>
              <span className="mt-6 inline-block text-sm font-semibold tracking-wide">Learn more</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep/40">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <p className="eyebrow text-brass">Who we serve</p>
          <h2 className="display mt-4 max-w-2xl text-5xl">The people at the closing table.</h2>
          <div className="mt-12">
            <AudienceTabs />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="eyebrow text-brass">The closing process</p>
        <h2 className="display mt-4 max-w-3xl text-5xl">From the opened order to recording.</h2>
        <div className="mt-12">
          <ProcessTimeline />
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
            <p className="eyebrow text-brass">About ITG</p>
            <h2 className="display mt-4 text-5xl">Built around the file, not around noise.</h2>
            <p className="mt-6 leading-relaxed text-paper/80">
              {site.legalName} is a Maryland title and settlement office. The practice was shaped by real estate insiders, with more than 30 years of combined title experience, and the mission was written with clients in mind.
            </p>
            <p className="mt-4 leading-relaxed text-paper/80">
              Client care opens the relationship. Processing works the order. Post-closing carries funding, recording, and the document audit. That is the whole promise: a clear handoff, and someone accountable at each stage.
            </p>
            <div className="mt-8">
              <Button href="/about" variant="inverse">
                About Integrity Title Group
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="eyebrow text-brass">Why ITG</p>
        <h2 className="display mt-4 max-w-2xl text-5xl">A quieter kind of confidence.</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {[
            ["Integrity", "The work is organized around the client’s transaction, with a first point of contact and a team that stays through recording."],
            ["Attention to detail", "Purchase orders start with the sale agreement. Complicated files stay with processors who are assigned to them."],
            ["Responsive service", "Each stage has an address: orders, processing, pre-closing disclosures, and post-closing. A question does not have to wander."],
            ["Smooth closings", "The path is the same one the office already runs: open, process, sign, fund, and record — without extra ceremony."],
          ].map(([title, text]) => (
            <article key={title} className="border-t border-ink pt-5">
              <h3 className="font-serif text-3xl">{title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow text-brass">Where we work</p>
            <h2 className="display mt-4 text-5xl">Eleven states, one office.</h2>
            <p className="mt-6 leading-relaxed text-ink-soft">
              Title and settlement services are offered in {coverageStates.slice(0, -1).join(", ")}, and {coverageStates.at(-1)}. Help beyond that area may be available through partners. Call before you assume a property is covered.
            </p>
            <div className="mt-8">
              <Button href="/coverage">View coverage</Button>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 self-center text-sm tracking-wide sm:grid-cols-3">
            {coverageStates.map((state) => (
              <li key={state} className="border-b border-line py-3">
                {state}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-brass">Begin</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">Open the order, or ask the question first.</h2>
          </div>
          <p className="leading-relaxed text-ink-soft">
            Send a purchase or refinance request, ask for a quote, or call {site.phone}. Do not include account numbers or wire instructions in a website message.
          </p>
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
