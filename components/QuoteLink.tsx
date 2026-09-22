"use client";

export function QuoteLink({
  children,
  className,
  onOpen,
}: {
  children: string;
  className?: string;
  onOpen?: () => void;
}) {
  return (
    <a
      href="#"
      className={className ? `get-qualia-quote ${className}` : "get-qualia-quote"}
      onClick={(event) => {
        event.preventDefault();
        onOpen?.();
      }}
    >
      {children}
    </a>
  );
}
