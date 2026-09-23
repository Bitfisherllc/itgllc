"use client";

import { Icon } from "@/components/Icon";
import { faHouseHeart } from "@/lib/icons";

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
      className={className ? `get-qualia-quote inline-flex items-center gap-2 ${className}` : "get-qualia-quote inline-flex items-center gap-2"}
      onClick={(event) => {
        event.preventDefault();
        onOpen?.();
      }}
    >
      <Icon icon={faHouseHeart} className="text-lg text-current" />
      {children}
    </a>
  );
}
