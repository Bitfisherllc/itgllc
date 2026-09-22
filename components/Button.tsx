import Link from "next/link";

const styles = {
  primary:
    "bg-ink text-paper hover:bg-brass-deep hover:border-brass-deep border border-ink",
  inverse:
    "bg-paper text-ink hover:bg-paper-deep border border-paper",
  ghost:
    "bg-transparent text-current border border-current/30 hover:border-current",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center px-6 text-sm font-semibold tracking-wide transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
