import { site } from "@/lib/site";

export function Logo({
  tone = "ink",
  compact = false,
}: {
  tone?: "ink" | "paper";
  compact?: boolean;
}) {
  const mark = tone === "paper" ? "text-paper" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-3 ${mark}`}>
      <svg viewBox="0 0 36 36" className="h-9 w-9 shrink-0" aria-hidden="true">
        <path
          d="M7 32V6h22v26"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M12 32V11h12v21"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.65rem] tracking-[0.18em]">
          {site.name}
        </span>
        {compact ? null : (
          <span className="mt-1 text-[0.62rem] font-medium tracking-[0.16em] uppercase opacity-70">
            Integrity Title Group
          </span>
        )}
      </span>
    </span>
  );
}
