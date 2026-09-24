"use client";

import { useEffect, useState } from "react";
import { defaultHomeContent, type HomeContent } from "@/lib/home-content";

const fieldClass =
  "mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus-visible:border-brass";

const saveButtonClass =
  "inline-flex min-h-12 w-fit items-center justify-center bg-ink px-6 text-sm font-semibold text-paper disabled:opacity-60";

type LibraryImage = { id: string; src: string };

function imagePath(src: string) {
  return src.split("?")[0];
}

function isVideo(src: string) {
  return imagePath(src).endsWith(".mp4");
}

function posterFor(src: string) {
  return imagePath(src).replace(/\.mp4$/, "-poster.jpg");
}

const endingLogos = [
  { src: "/logo/ITG-LIGHT.svg", label: "White and green" },
  { src: "/logo/White-Green.svg", label: "White and green, open" },
  { src: "/logo/ITG.svg", label: "Black and green" },
  { src: "/logo/Black-Green-transparent.svg", label: "Black and green, transparent" },
  { src: "/logo/Green-Dark Green-transparent.svg", label: "Green and dark green" },
];

function ImageField({
  label,
  slot,
  src,
  library,
  libraryOpen,
  onToggleLibrary,
  onUploaded,
  onError,
}: {
  label: string;
  slot: string;
  src: string;
  library: LibraryImage[];
  libraryOpen: boolean;
  onToggleLibrary: () => void;
  onUploaded: (content: HomeContent, library: LibraryImage[]) => void;
  onError: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const current = imagePath(src);

  async function finish(response: Response) {
    const body = (await response.json()) as {
      ok?: boolean;
      content?: HomeContent;
      library?: LibraryImage[];
      error?: string;
    };
    setBusy(false);
    if (!response.ok || !body.ok || !body.content || !body.library) {
      onError(body.error || "The image could not be saved.");
      return;
    }
    onUploaded(body.content, body.library);
  }

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    onError("");
    const response = await fetch(`/api/admin/home-image?slot=${encodeURIComponent(slot)}`, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    await finish(response);
  }

  async function choose(id: string) {
    setBusy(true);
    onError("");
    const response = await fetch("/api/admin/library/choose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot, id }),
    });
    await finish(response);
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this image from the library?")) return;
    setBusy(true);
    onError("");
    const response = await fetch("/api/admin/library/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await finish(response);
  }

  return (
    <div>
      <span className="text-sm font-semibold">{label}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="mt-2 h-auto w-full max-w-sm" />
      <div className="mt-3 flex flex-wrap gap-2">
        <label className="inline-flex min-h-11 cursor-pointer items-center border border-line px-4 text-sm font-semibold">
          {busy ? "Saving" : "Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={busy}
            onChange={onFile}
          />
        </label>
        <button
          type="button"
          className="inline-flex min-h-11 items-center border border-line px-4 text-sm font-semibold"
          aria-expanded={libraryOpen}
          disabled={busy}
          onClick={onToggleLibrary}
        >
          {libraryOpen ? "Hide library" : "Choose from library"}
        </button>
      </div>
      {libraryOpen ? (
        <div className="mt-4 grid max-h-80 grid-cols-2 gap-2 overflow-auto sm:grid-cols-3">
          {library.length ? (
            library.map((image, index) => {
              const selected = imagePath(image.src) === current;
              return (
                <div key={image.id} className="relative">
                  <button
                    type="button"
                    disabled={busy}
                    aria-pressed={selected}
                    aria-label={`Use library image ${index + 1}`}
                    className={`relative block w-full border ${selected ? "border-brass-deep" : "border-line"}`}
                    onClick={() => choose(image.id)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} alt="" className="h-auto w-full" />
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    aria-label={`Delete library image ${index + 1}`}
                    className="absolute right-1 top-1 bg-white px-2 py-1 text-xs font-semibold"
                    onClick={() => remove(image.id)}
                  >
                    Delete
                  </button>
                </div>
              );
            })
          ) : (
            <p className="col-span-full text-sm text-ink-soft">No library images yet. Upload one to start the library.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {rows === 1 ? (
        <input value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass} />
      ) : (
        <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className={fieldClass} />
      )}
    </label>
  );
}

function SlideshowField({
  content,
  library,
  busy,
  onSaving,
  onSaved,
  onError,
}: {
  content: HomeContent;
  library: LibraryImage[];
  busy: boolean;
  onSaving: (busy: boolean) => void;
  onSaved: (content: HomeContent) => void;
  onError: (message: string) => void;
}) {
  const selected = content.heroSlides.length ? content.heroSlides : [content.heroImage];
  const photographs = selected.filter((src) => !isVideo(src));

  async function save(heroSlides: string[]) {
    if (!heroSlides.length) {
      onError("Keep at least one slide in the slideshow.");
      return;
    }
    onError("");
    onSaving(true);
    const heroImage = heroSlides.find((src) => !isVideo(src)) || content.heroImage;
    const response = await fetch("/api/admin/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { ...content, heroSlides, heroImage } }),
    });
    const body = (await response.json()) as { ok?: boolean; content?: HomeContent; error?: string };
    onSaving(false);
    if (!response.ok || !body.ok || !body.content) {
      onError(body.error || "The slideshow could not be saved.");
      return;
    }
    onSaved(body.content);
  }

  function toggle(src: string) {
    const path = imagePath(src);
    const has = selected.some((item) => imagePath(item) === path);
    if (has) {
      void save(selected.filter((item) => imagePath(item) !== path));
      return;
    }
    void save([...selected, src]);
  }

  function move(index: number, direction: number) {
    const target = index + direction;
    if (target < 0 || target >= selected.length) return;
    const next = [...selected];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    void save(next);
  }

  return (
    <div>
      <h3 className="font-serif text-2xl">Slideshow</h3>
      <p className="mt-2 text-sm text-ink-soft">
        Slide 1 opens the homepage. Move up plays a slide sooner. Move down plays it later. No photograph leaves only the movie.
      </p>
      <button
        type="button"
        disabled={busy}
        aria-pressed={photographs.length === 0}
        onClick={() => {
          if (!photographs.length) return;
          const movies = selected.filter(isVideo);
          if (!movies.length) {
            onError("Add the movie before removing every photograph.");
            return;
          }
          void save(movies);
        }}
        className={`mt-4 inline-flex min-h-11 items-center border px-4 text-sm font-semibold disabled:opacity-60 ${
          photographs.length === 0 ? "border-ink bg-ink text-paper" : "border-line"
        }`}
      >
        No photograph
      </button>
      <ol className="mt-4 grid gap-3">
        {selected.map((src, index) => (
          <li key={src} className="flex flex-wrap items-center gap-3 border border-line p-3">
            {isVideo(src) ? (
              <video src={src} poster={posterFor(src)} muted playsInline preload="metadata" className="h-auto w-24" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="h-auto w-24" />
            )}
            <span className="text-sm font-semibold">Slide {index + 1}</span>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <button
                type="button"
                className="min-h-11 border border-ink px-3 text-sm font-semibold disabled:opacity-40"
                disabled={busy || index === 0}
                aria-label={`Move slide ${index + 1} up`}
                onClick={() => move(index, -1)}
              >
                Move up
              </button>
              <button
                type="button"
                className="min-h-11 border border-ink px-3 text-sm font-semibold disabled:opacity-40"
                disabled={busy || index === selected.length - 1}
                aria-label={`Move slide ${index + 1} down`}
                onClick={() => move(index, 1)}
              >
                Move down
              </button>
              <button
                type="button"
                className="min-h-11 border border-line px-3 text-sm font-semibold disabled:opacity-60"
                disabled={busy}
                onClick={() => toggle(src)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ol>
      <VideoEnding
        content={content}
        busy={busy}
        onSaving={onSaving}
        onSaved={onSaved}
        onError={onError}
      />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {library.map((image) => {
          const included = selected.some((src) => imagePath(src) === imagePath(image.src));
          return (
            <button
              key={image.id}
              type="button"
              disabled={busy}
              onClick={() => toggle(image.src)}
              className={`border p-2 text-left text-sm font-semibold disabled:opacity-60 ${
                included ? "border-ink" : "border-line"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt="" className="h-auto w-full" />
              <span className="mt-2 block">{included ? "In the slideshow" : "Add to slideshow"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function VideoEnding({
  content,
  busy,
  onSaving,
  onSaved,
  onError,
}: {
  content: HomeContent;
  busy: boolean;
  onSaving: (busy: boolean) => void;
  onSaved: (content: HomeContent) => void;
  onError: (message: string) => void;
}) {
  const [size, setSize] = useState(content.heroLogoSize);

  useEffect(() => {
    setSize(content.heroLogoSize);
  }, [content.heroLogoSize]);

  async function save(heroLogo: string, heroLogoSize: number) {
    onError("");
    onSaving(true);
    const response = await fetch("/api/admin/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { ...content, heroLogo, heroLogoSize } }),
    });
    const body = (await response.json()) as { ok?: boolean; content?: HomeContent; error?: string };
    onSaving(false);
    if (!response.ok || !body.ok || !body.content) {
      onError(body.error || "The video ending could not be saved.");
      return;
    }
    onSaved(body.content);
  }

  return (
    <div className="mt-8 border-t border-line pt-6">
      <h3 className="font-serif text-2xl">Video ending</h3>
      <p className="mt-2 text-sm text-ink-soft">
        The movie holds its last frame, fades to black, then fades in the logo. Width is a share of the hero.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <label className="inline-flex min-h-11 cursor-pointer items-center border border-line px-4 text-sm font-semibold">
          {busy ? "Saving" : "Upload SVG"}
          <input
            type="file"
            accept="image/svg+xml,.svg"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              void (async () => {
                onError("");
                onSaving(true);
                const response = await fetch("/api/admin/hero-logo", {
                  method: "POST",
                  headers: { "Content-Type": file.type || "image/svg+xml" },
                  body: file,
                });
                const body = (await response.json()) as { ok?: boolean; content?: HomeContent; error?: string };
                onSaving(false);
                if (!response.ok || !body.ok || !body.content) {
                  onError(body.error || "The SVG could not be saved.");
                  return;
                }
                onSaved(body.content);
              })();
            }}
          />
        </label>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {(content.heroLogo.split("?")[0].startsWith("/logo/custom/")
          ? [...endingLogos, { src: content.heroLogo, label: "Uploaded SVG" }]
          : endingLogos
        ).map((item) => {
          const selected = content.heroLogo.split("?")[0] === item.src.split("?")[0];
          return (
            <button
              key={item.src}
              type="button"
              disabled={busy}
              aria-pressed={selected}
              onClick={() => void save(item.src, size)}
              className={`border p-2 text-left text-sm font-semibold disabled:opacity-60 ${
                selected ? "border-ink" : "border-line"
              }`}
            >
              <span className="flex h-24 items-center justify-center bg-ink px-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt="" className="h-auto max-h-16 w-auto" />
              </span>
              <span className="mt-2 block">{item.label}</span>
            </button>
          );
        })}
      </div>
      <label className="mt-5 block text-sm font-semibold">
        Logo width, {size} percent
        <input
          type="range"
          min={20}
          max={80}
          step={1}
          value={size}
          disabled={busy}
          onChange={(event) => setSize(Number(event.target.value))}
          onPointerUp={(event) => void save(content.heroLogo, Number(event.currentTarget.value))}
          onKeyUp={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
            void save(content.heroLogo, Number(event.currentTarget.value));
          }}
          className="mt-2 w-full"
        />
      </label>
      <div className="mt-4 flex h-48 items-center justify-center bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={content.heroLogo} alt="" style={{ width: `${size}%` }} className="h-auto max-h-full" />
      </div>
    </div>
  );
}

export function HomeEditor() {
  const [content, setContent] = useState<HomeContent>(defaultHomeContent);
  const [library, setLibrary] = useState<LibraryImage[]>([]);
  const [openLibrary, setOpenLibrary] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/home")
      .then((response) => response.json())
      .then((body: { content?: HomeContent }) => {
        if (!cancelled && body.content) setContent(body.content);
      })
      .catch(() => {
        if (!cancelled) setError("Homepage text could not be loaded.");
      });
    fetch("/api/admin/library")
      .then((response) => response.json())
      .then((body: { images?: LibraryImage[] }) => {
        if (!cancelled && body.images) setLibrary(body.images);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  function update(patch: Partial<HomeContent>) {
    setContent((current) => ({ ...current, ...patch }));
    setStatus("");
  }

  async function onSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    const response = await fetch("/api/admin/home", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const body = (await response.json()) as { ok?: boolean; content?: HomeContent; error?: string };
    setSaving(false);
    if (!response.ok || !body.ok || !body.content) {
      setError(body.error || "The homepage could not be saved.");
      return;
    }
    setContent(body.content);
    setStatus("Saved. The homepage is updated.");
  }

  return (
    <form onSubmit={onSave} className="grid gap-8">
      <div className="sticky top-16 z-40 flex flex-wrap items-center gap-x-4 gap-y-2 border border-line bg-white px-4 py-3">
        <button type="submit" disabled={saving} className={saveButtonClass}>
          {saving ? "Saving" : "Save homepage"}
        </button>
        {error ? (
          <p role="alert" className="text-sm">
            {error}
          </p>
        ) : status ? (
          <p className="text-sm font-semibold">{status}</p>
        ) : (
          <p className="text-sm text-ink-soft">Saves the text on this page. Photographs and slideshow order save as you change them.</p>
        )}
      </div>
      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Hero</h2>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.heroEyebrow} onChange={(heroEyebrow) => update({ heroEyebrow })} />
          <Field label="Headline" rows={2} value={content.heroHeadline} onChange={(heroHeadline) => update({ heroHeadline })} />
          <Field label="Introduction" value={content.heroLede} onChange={(heroLede) => update({ heroLede })} />
          <ImageField
            label="Photograph, optional"
            slot="hero"
            src={content.heroImage}
            library={library}
            libraryOpen={openLibrary === "hero"}
            onToggleLibrary={() => setOpenLibrary((current) => (current === "hero" ? null : "hero"))}
            onUploaded={(next, images) => {
              setContent(next);
              setLibrary(images);
              setStatus("Saved. The homepage photograph is updated.");
            }}
            onError={setError}
          />
          <p className="text-sm text-ink-soft">
            Choosing a photograph places it first in the hero. The slideshow can add more slides after it.
          </p>
          <SlideshowField
            content={content}
            library={library}
            busy={saving}
            onSaving={setSaving}
            onSaved={(next) => {
              setContent(next);
              setStatus("Saved. The slideshow is updated.");
            }}
            onError={setError}
          />
        </div>
        <SectionSave saving={saving} />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Three points</h2>
        <div className="mt-6 grid gap-8">
          {content.pillars.map((item, index) => (
            <div key={index} className="grid gap-5">
              <ImageField
                label={`${item.title || `Point ${index + 1}`} photograph`}
                slot={`pillar-${index}`}
                src={item.image}
                library={library}
                libraryOpen={openLibrary === `pillar-${index}`}
                onToggleLibrary={() =>
                  setOpenLibrary((current) => (current === `pillar-${index}` ? null : `pillar-${index}`))
                }
                onUploaded={(next, images) => {
                  setContent(next);
                  setLibrary(images);
                  setStatus("Saved. That photograph is updated.");
                }}
                onError={setError}
              />
              <Field
                label={`Point ${index + 1} title`}
                rows={1}
                value={item.title}
                onChange={(title) =>
                  update({
                    pillars: content.pillars.map((pillar, pillarIndex) =>
                      pillarIndex === index ? { ...pillar, title } : pillar,
                    ),
                  })
                }
              />
              <Field
                label={`Point ${index + 1} text`}
                value={item.text}
                onChange={(text) =>
                  update({
                    pillars: content.pillars.map((pillar, pillarIndex) =>
                      pillarIndex === index ? { ...pillar, text } : pillar,
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>
        <SectionSave saving={saving} />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Services introduction</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          The service cards themselves stay tied to the services pages.
        </p>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.servicesEyebrow} onChange={(servicesEyebrow) => update({ servicesEyebrow })} />
          <Field label="Heading" rows={2} value={content.servicesHeading} onChange={(servicesHeading) => update({ servicesHeading })} />
          <Field label="Introduction" value={content.servicesLede} onChange={(servicesLede) => update({ servicesLede })} />
        </div>
        <SectionSave saving={saving} />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Who we serve</h2>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.audienceEyebrow} onChange={(audienceEyebrow) => update({ audienceEyebrow })} />
          <Field label="Heading" rows={2} value={content.audienceHeading} onChange={(audienceHeading) => update({ audienceHeading })} />
          {content.audiences.map((item, index) => (
            <div key={item.id} className="grid gap-5 border-t border-line pt-5">
              <Field
                label={`${item.id} label`}
                rows={1}
                value={item.label}
                onChange={(label) =>
                  update({
                    audiences: content.audiences.map((audience, audienceIndex) =>
                      audienceIndex === index ? { ...audience, label } : audience,
                    ),
                  })
                }
              />
              <Field
                label={`${item.id} text`}
                value={item.text}
                onChange={(text) =>
                  update({
                    audiences: content.audiences.map((audience, audienceIndex) =>
                      audienceIndex === index ? { ...audience, text } : audience,
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>
        <SectionSave saving={saving} />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Closing process</h2>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.processEyebrow} onChange={(processEyebrow) => update({ processEyebrow })} />
          <Field label="Heading" rows={2} value={content.processHeading} onChange={(processHeading) => update({ processHeading })} />
          {content.steps.map((item, index) => (
            <div key={item.n} className="grid gap-5 border-t border-line pt-5">
              <Field
                label={`Step ${item.n} title`}
                rows={1}
                value={item.title}
                onChange={(title) =>
                  update({
                    steps: content.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, title } : step)),
                  })
                }
              />
              <Field
                label={`Step ${item.n} text`}
                value={item.text}
                onChange={(text) =>
                  update({
                    steps: content.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, text } : step)),
                  })
                }
              />
            </div>
          ))}
        </div>
        <SectionSave saving={saving} />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">About</h2>
        <div className="mt-6 grid gap-5">
          <ImageField
            label="Photograph"
            slot="about"
            src={content.aboutImage}
            library={library}
            libraryOpen={openLibrary === "about"}
            onToggleLibrary={() => setOpenLibrary((current) => (current === "about" ? null : "about"))}
            onUploaded={(next, images) => {
              setContent(next);
              setLibrary(images);
              setStatus("Saved. The about photograph is updated.");
            }}
            onError={setError}
          />
          <Field label="Eyebrow" rows={1} value={content.aboutEyebrow} onChange={(aboutEyebrow) => update({ aboutEyebrow })} />
          <Field label="Heading" rows={2} value={content.aboutHeading} onChange={(aboutHeading) => update({ aboutHeading })} />
          <Field label="First paragraph" value={content.aboutLead} onChange={(aboutLead) => update({ aboutLead })} />
          <Field label="Second paragraph" value={content.aboutBody} onChange={(aboutBody) => update({ aboutBody })} />
        </div>
        <SectionSave saving={saving} />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Why ITG</h2>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.whyEyebrow} onChange={(whyEyebrow) => update({ whyEyebrow })} />
          <Field label="Heading" rows={2} value={content.whyHeading} onChange={(whyHeading) => update({ whyHeading })} />
          {content.reasons.map((item, index) => (
            <div key={index} className="grid gap-5 border-t border-line pt-5">
              <Field
                label={`Reason ${index + 1} title`}
                rows={1}
                value={item.title}
                onChange={(title) =>
                  update({
                    reasons: content.reasons.map((reason, reasonIndex) =>
                      reasonIndex === index ? { ...reason, title } : reason,
                    ),
                  })
                }
              />
              <Field
                label={`Reason ${index + 1} text`}
                value={item.text}
                onChange={(text) =>
                  update({
                    reasons: content.reasons.map((reason, reasonIndex) =>
                      reasonIndex === index ? { ...reason, text } : reason,
                    ),
                  })
                }
              />
            </div>
          ))}
        </div>
        <SectionSave saving={saving} />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Coverage</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">The state list beside this paragraph stays as published.</p>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.coverageEyebrow} onChange={(coverageEyebrow) => update({ coverageEyebrow })} />
          <Field label="Heading" rows={2} value={content.coverageHeading} onChange={(coverageHeading) => update({ coverageHeading })} />
          <Field label="Paragraph" value={content.coverageText} onChange={(coverageText) => update({ coverageText })} />
        </div>
        <SectionSave saving={saving} />
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Closing invitation</h2>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.ctaEyebrow} onChange={(ctaEyebrow) => update({ ctaEyebrow })} />
          <Field label="Heading" rows={2} value={content.ctaHeading} onChange={(ctaHeading) => update({ ctaHeading })} />
          <Field label="Paragraph" value={content.ctaText} onChange={(ctaText) => update({ ctaText })} />
        </div>
        <SectionSave saving={saving} />
      </section>
    </form>
  );
}

function SectionSave({ saving }: { saving: boolean }) {
  return (
    <button type="submit" disabled={saving} className={`mt-6 ${saveButtonClass}`}>
      {saving ? "Saving" : "Save"}
    </button>
  );
}
