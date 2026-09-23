"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { HomeAudience } from "@/lib/home-content";
import { audienceIcons, iconFor } from "@/lib/icons";

export function AudienceTabs({ audiences }: { audiences: HomeAudience[] }) {
  const [active, setActive] = useState(audiences[0]?.id ?? "buyers");
  const current = audiences.find((item) => item.id === active) ?? audiences[0];

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div role="tablist" aria-label="Who ITG works with" className="lg:col-span-5">
        {audiences.map((item) => {
          const selected = item.id === active;
          return (
            <div key={item.id}>
              <button
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`panel-${item.id}`}
                onClick={() => setActive(item.id)}
                className={`flex w-full items-center justify-between border-b border-line py-4 text-left font-serif text-2xl transition-colors ${
                  selected ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon icon={iconFor(audienceIcons, item.id)} className="text-base text-brass" />
                  {item.label}
                </span>
                <span aria-hidden="true" className={selected ? "text-brass" : "opacity-0"}>
                  —
                </span>
              </button>
              {selected ? (
                <div
                  role="tabpanel"
                  id={`panel-${item.id}`}
                  aria-labelledby={`tab-${item.id}`}
                  className="mb-2 border border-line bg-white/50 p-6 lg:hidden"
                >
                  <p className="eyebrow text-brass">Who we serve</p>
                  <h3 className="display mt-4 text-3xl">{item.label}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`panel-${current.id}-wide`}
        aria-labelledby={`tab-${current.id}`}
        className="hidden border border-line bg-white/50 p-8 lg:col-span-7 lg:block lg:p-12"
      >
        <p className="eyebrow text-brass">Who we serve</p>
        <h3 className="display mt-4 text-4xl">{current.label}</h3>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">{current.text}</p>
      </div>
    </div>
  );
}
