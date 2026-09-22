import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <p className="eyebrow text-brass">404</p>
      <h1 className="display mt-4 text-6xl">This page is not on the file.</h1>
      <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
        The address may have changed. Return home, or start a title order if you already know what you need.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/">Home</Button>
        <Button href="/contact" variant="ghost">
          Contact
        </Button>
      </div>
    </div>
  );
}
