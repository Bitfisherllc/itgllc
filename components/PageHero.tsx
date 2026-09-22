export function PageHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <p className="eyebrow text-brass">{eyebrow}</p>
        <h1 className="display mt-5 max-w-4xl text-5xl text-paper sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/80">
          {lede}
        </p>
      </div>
    </header>
  );
}
