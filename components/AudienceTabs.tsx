"use client";

import { useState } from "react";

const audiences = [
  {
    id: "buyers",
    label: "Home buyers",
    text: "A purchase file opens with the sale agreement. ITG’s client-care and processing teams use that contract to start the title order, then stay with the file through settlement.",
  },
  {
    id: "sellers",
    label: "Home sellers",
    text: "Sellers are part of the same purchase settlement. The sale agreement starts the order, and post-closing carries funding, recording, and the document audit after signing.",
  },
  {
    id: "refinance",
    label: "Homeowners refinancing",
    text: "Refinance orders are opened on their own. If you are still comparing fees, request a pre-closing disclosure before the file is treated as an opened order.",
  },
  {
    id: "agents",
    label: "Real estate agents",
    text: "Agents send purchase and refinance orders, with the sale agreement on a purchase. Qualia is the secure portal for documents once the file is underway.",
  },
  {
    id: "lenders",
    label: "Lenders",
    text: "Lenders share that same portal with agents and clients. Processing handles the open file, including complicated matters, and post-closing takes funding and recording.",
  },
] as const;

export function AudienceTabs() {
  const [active, setActive] = useState<(typeof audiences)[number]["id"]>("buyers");
  const current = audiences.find((item) => item.id === active) ?? audiences[0];

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div role="tablist" aria-label="Who ITG works with" className="lg:col-span-5">
        {audiences.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
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
              {item.label}
              <span aria-hidden="true" className={selected ? "text-brass" : "opacity-0"}>
                —
              </span>
            </button>
          );
        })}
      </div>
      <div
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
        className="border border-line bg-white/50 p-8 lg:col-span-7 lg:p-12"
      >
        <p className="eyebrow text-brass">Who we serve</p>
        <h3 className="display mt-4 text-4xl">{current.label}</h3>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">{current.text}</p>
      </div>
    </div>
  );
}
