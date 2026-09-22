const sources = {
  paper: "/logo/ITG-LIGHT.svg",
  ink: "/logo/ITG.svg",
} as const;

export function Logo({
  tone = "ink",
  compact = false,
}: {
  tone?: "ink" | "paper";
  compact?: boolean;
}) {
  return (
    <span className="inline-flex flex-col">
      <img
        src={sources[tone]}
        alt=""
        className={compact ? "h-10 w-auto" : "h-14 w-auto"}
      />
      {compact ? null : (
        <span className="mt-3 text-[0.62rem] font-medium tracking-[0.16em] uppercase opacity-70">
          Integrity Title Group
        </span>
      )}
    </span>
  );
}
