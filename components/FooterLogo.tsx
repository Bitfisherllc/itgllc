"use client";

import { useEffect, useRef } from "react";

const templates = new Map<string, Promise<SVGSVGElement | null>>();

function loadTemplate(src: string) {
  const cached = templates.get(src);
  if (cached) return cached;
  const pending = fetch(src)
    .then((response) => response.text())
    .then((text) => {
      const svg = new DOMParser().parseFromString(text, "image/svg+xml").querySelector("svg");
      svg?.querySelectorAll("script").forEach((script) => script.remove());
      return svg;
    })
    .catch(() => null);
  templates.set(src, pending);
  return pending;
}

function restingCopy(svg: SVGSVGElement) {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.querySelectorAll("animate, animateTransform, animateMotion").forEach((node) => {
    node.setAttribute("begin", "indefinite");
  });
  return copy;
}

function showLogo(node: HTMLElement, svg: SVGSVGElement, playing: boolean, fit: "width" | "height" = "width") {
  const copy = playing ? (svg.cloneNode(true) as SVGSVGElement) : restingCopy(svg);
  copy.setAttribute("role", "img");
  copy.setAttribute("aria-label", "Integrity Title Group");
  if (fit === "height") {
    copy.style.height = "100%";
    copy.style.width = "auto";
    copy.style.maxWidth = "100%";
  } else {
    copy.setAttribute("class", "h-auto w-full");
  }
  node.replaceChildren(copy);
  if (!playing) return;
  copy.querySelectorAll("animate, animateTransform, animateMotion").forEach((item) => {
    (item as SVGAnimateElement).beginElement();
  });
}

export function LogoAnimationPreview({ src, frameClass }: { src: string; frameClass: string }) {
  const host = useRef<HTMLDivElement>(null);
  const template = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const node = host.current;
    if (!node || !src) return;
    let cancelled = false;
    template.current = null;
    loadTemplate(src).then((svg) => {
      if (cancelled || !svg) return;
      template.current = svg;
      showLogo(node, svg, false, "height");
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-black ${frameClass}`}>
      <div ref={host} className="flex h-full w-full items-center justify-center px-3" />
      <button
        type="button"
        onClick={() => {
          const node = host.current;
          const svg = template.current;
          if (!node || !svg) return;
          showLogo(node, svg, true, "height");
        }}
        className="absolute bottom-2 right-2 inline-flex min-h-8 items-center bg-brass px-3 text-xs font-semibold text-ink"
      >
        Play
      </button>
    </div>
  );
}

export function FooterLogo({ src }: { src: string }) {
  const host = useRef<HTMLDivElement>(null);
  const template = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const node = host.current;
    if (!node || !src) return;
    let cancelled = false;
    template.current = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function place(playing: boolean) {
      const svg = template.current;
      if (!node || !svg) return;
      showLogo(node, svg, playing);
    }

    loadTemplate(src).then((svg) => {
      if (cancelled || !svg) return;
      template.current = svg;
      place(false);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!template.current || reduce) return;
        place(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.5 },
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [src]);

  return <div ref={host} className="w-40 max-w-full" />;
}
