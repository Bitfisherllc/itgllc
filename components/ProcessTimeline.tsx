"use client";

import { useState } from "react";

const steps = [
  {
    n: "01",
    title: "Order opened",
    text: "Client care opens a purchase or refinance order. On a purchase, the sale agreement should come with the request so processing is not waiting on basic information.",
  },
  {
    n: "02",
    title: "Title processing",
    text: "A processor is assigned and works the file, including complicated matters. Questions about the open order go to the processing desk.",
  },
  {
    n: "03",
    title: "Review and preparation",
    text: "The file is prepared for settlement. If you are still comparing fees, a pre-closing disclosure can be requested before the order moves ahead.",
  },
  {
    n: "04",
    title: "Closing",
    text: "The parties sign and the transaction is settled. The office remains available for questions through that signing.",
  },
  {
    n: "05",
    title: "Recording and completion",
    text: "Post-closing handles funding, recording, and a document audit, with authorization and layered verification.",
  },
] as const;

export function ProcessTimeline() {
  const [active, setActive] = useState(0);
  const current = steps[active];

  return (
    <div>
      <div className="hidden md:block">
        <div role="tablist" aria-label="Closing process" className="grid grid-cols-5 gap-4">
          {steps.map((step, index) => {
            const selected = index === active;
            return (
              <button
                key={step.n}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(index)}
                className="border-t-2 pt-5 text-left"
                style={{ borderColor: selected ? "#8a7048" : "rgba(20,32,43,0.14)" }}
              >
                <span className="text-xs tracking-[0.18em] text-brass">{step.n}</span>
                <span className="mt-3 block font-serif text-xl leading-tight">{step.title}</span>
              </button>
            );
          })}
        </div>
        <p role="tabpanel" className="mt-8 max-w-3xl text-lg leading-relaxed text-ink-soft">
          {current.text}
        </p>
      </div>

      <ol className="space-y-8 border-l border-line pl-6 md:hidden">
        {steps.map((step) => (
          <li key={step.n} className="relative">
            <span className="absolute -left-[1.7rem] top-1 h-3 w-3 border border-brass bg-paper" aria-hidden="true" />
            <p className="text-xs tracking-[0.18em] text-brass">{step.n}</p>
            <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
