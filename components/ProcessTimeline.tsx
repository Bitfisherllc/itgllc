"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { HomeStep } from "@/lib/home-content";
import { stepIcons } from "@/lib/icons";

export function ProcessTimeline({ steps }: { steps: HomeStep[] }) {
  const [active, setActive] = useState(0);
  const current = steps[active] ?? steps[0];
  if (!current) return null;

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
                style={{ borderColor: selected ? "#32b44a" : "rgba(0,0,0,0.14)" }}
              >
                <span className="text-xs tracking-[0.18em] text-brass">{step.n}</span>
                <span className="mt-3 flex items-start gap-2 font-serif text-xl leading-tight">
                  <Icon icon={stepIcons[index] ?? stepIcons[0]} className="mt-1 shrink-0 text-base text-brass" />
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
        <p role="tabpanel" className="mt-8 max-w-3xl text-lg leading-relaxed text-ink-soft">
          {current.text}
        </p>
      </div>

      <ol className="space-y-8 border-l border-line pl-6 md:hidden">
        {steps.map((step, index) => (
          <li key={step.n} className="relative">
            <span className="absolute -left-[1.7rem] top-1 h-3 w-3 border border-brass bg-paper" aria-hidden="true" />
            <p className="text-xs tracking-[0.18em] text-brass">{step.n}</p>
            <h3 className="mt-2 flex items-center gap-3 font-serif text-2xl">
              <Icon icon={stepIcons[index] ?? stepIcons[0]} className="shrink-0 text-xl text-brass" />
              {step.title}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
