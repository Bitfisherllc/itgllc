"use client";

import { useEffect, useRef, useState } from "react";

const HOLD_MS = 6500;
const LAST_FRAME_MS = 700;
const FADE_MS = 1000;
const LOGO_HOLD_MS = 2200;

function isVideo(src: string) {
  return src.split("?")[0].endsWith(".mp4");
}

function posterFor(src: string) {
  return src.split("?")[0].replace(/\.mp4$/, "-poster.jpg");
}

type Phase = "playing" | "frame" | "black" | "logo";

export function HeroSlideshow({
  images,
  logo,
  logoSize,
}: {
  images: string[];
  logo: string;
  logoSize: number;
}) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [phase, setPhase] = useState<Phase>("playing");
  const videos = useRef<Record<string, HTMLVideoElement | null>>({});
  const timers = useRef<number[]>([]);
  const ending = useRef(false);
  const active = slides.length ? index % slides.length : 0;
  const activeSrc = slides[active] || "";

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }

  function later(ms: number, action: () => void) {
    const id = window.setTimeout(action, ms);
    timers.current.push(id);
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || slides.length < 2 || isVideo(activeSrc)) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion, slides.length, activeSrc]);

  useEffect(() => {
    if (slides.length < 2) return;
    const next = slides[(active + 1) % slides.length];
    if (!next || isVideo(next)) return;
    const image = new Image();
    image.src = next;
  }, [active, slides]);

  useEffect(() => {
    ending.current = false;
    clearTimers();
    setPhase("playing");
    for (const [src, video] of Object.entries(videos.current)) {
      if (!video) continue;
      if (src === activeSrc && !reduceMotion) {
        video.currentTime = 0;
        if (!paused) video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    }
  }, [activeSrc, reduceMotion]);

  useEffect(() => {
    const video = videos.current[activeSrc];
    if (!video || !isVideo(activeSrc) || reduceMotion || ending.current) return;
    if (paused) video.pause();
    else video.play().catch(() => undefined);
  }, [paused, activeSrc, reduceMotion]);

  useEffect(() => clearTimers, []);

  if (!slides.length) return null;

  function finishVideo(src: string) {
    if (ending.current || src !== activeSrc) return;
    ending.current = true;
    const video = videos.current[src];
    if (video && Number.isFinite(video.duration)) {
      video.currentTime = Math.max(0, video.duration - 0.05);
      video.pause();
    }
    setPhase("frame");
    later(LAST_FRAME_MS, () => setPhase("black"));
    later(LAST_FRAME_MS + FADE_MS, () => setPhase("logo"));
    if (slides.length > 1) {
      later(LAST_FRAME_MS + FADE_MS + FADE_MS + LOGO_HOLD_MS, () => {
        setIndex((current) => (current + 1) % slides.length);
      });
    }
  }

  function step(direction: number) {
    setIndex((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <div className="absolute inset-0">
      {slides.map((src, slideIndex) => {
        const showing = slideIndex === active;
        const hidden = showing ? undefined : true;
        if (isVideo(src)) {
          if (reduceMotion) {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={posterFor(src)}
                alt={showing ? "Video on the Integrity Title Group homepage." : ""}
                aria-hidden={hidden}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                  showing ? "opacity-100" : "opacity-0"
                }`}
              />
            );
          }
          const endingThis = showing && phase !== "playing";
          return (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${showing ? "opacity-100" : "opacity-0"}`}
              aria-hidden={hidden}
            >
              <video
                ref={(node) => {
                  videos.current[src] = node;
                }}
                src={src}
                poster={posterFor(src)}
                muted
                playsInline
                preload={slideIndex === 0 ? "auto" : "metadata"}
                aria-label={showing ? "Video on the Integrity Title Group homepage." : undefined}
                onTimeUpdate={(event) => {
                  const video = event.currentTarget;
                  if (!showing || ending.current || !Number.isFinite(video.duration)) return;
                  if (video.currentTime < video.duration - 0.08) return;
                  finishVideo(src);
                }}
                onEnded={() => finishVideo(src)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-black transition-opacity ease-in-out ${
                  phase === "playing" || phase === "frame" ? "opacity-0" : "opacity-100"
                }`}
                style={{ transitionDuration: `${FADE_MS}ms` }}
              />
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={endingThis && phase === "logo" ? "Integrity Title Group" : ""}
                  className={`absolute left-1/2 top-1/2 h-auto -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity ease-in-out ${
                    phase === "logo" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ width: `${logoSize}%`, transitionDuration: `${FADE_MS}ms` }}
                />
              ) : null}
            </div>
          );
        }
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={showing ? "Photograph on the Integrity Title Group homepage." : ""}
            aria-hidden={hidden}
            fetchPriority={slideIndex === 0 ? "high" : "low"}
            className={`hero-photo absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              showing ? "opacity-100" : "opacity-0"
            }`}
          />
        );
      })}
      {slides.length > 1 && !reduceMotion ? (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 bg-ink/70 px-2 py-1 text-xs font-semibold text-paper">
          <button type="button" className="min-h-9 px-2" onClick={() => step(-1)} aria-label="Previous slide">
            Previous
          </button>
          <span aria-live="polite">
            {active + 1} / {slides.length}
          </span>
          <button type="button" className="min-h-9 px-2" onClick={() => step(1)} aria-label="Next slide">
            Next
          </button>
          <button type="button" className="min-h-9 px-2" onClick={() => setPaused((current) => !current)}>
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
