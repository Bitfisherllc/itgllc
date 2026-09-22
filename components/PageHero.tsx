import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "@/components/Icon";

export function PageHero({
  eyebrow,
  title,
  lede,
  icon,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  icon?: IconDefinition;
}) {
  return (
    <header className="border-b border-line bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
        <p className="eyebrow flex items-center gap-2 text-brass">
          {icon ? <Icon icon={icon} className="text-sm text-brass" /> : null}
          {eyebrow}
        </p>
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
