import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <Reveal>
        <p className="title-kicker eyebrow text-brass">404</p>
        <h1 className="title-slide display mt-4 text-6xl">Page not found.</h1>
        <p className="title-copy mt-6 max-w-md leading-relaxed text-ink-soft">
          The address may have changed. Return to the homepage, or contact the office if you need a title order.
        </p>
        <div className="title-copy mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/">Home</Button>
          <Button href="/contact" variant="ghost">
            Contact
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
