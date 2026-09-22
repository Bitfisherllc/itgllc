"use client";

import { useEffect, useState } from "react";
import { defaultHomeContent, type HomeContent } from "@/lib/home-content";

const fieldClass =
  "mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus-visible:border-brass";

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

export function HomeEditor() {
  const [content, setContent] = useState<HomeContent>(defaultHomeContent);
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
      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Hero</h2>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.heroEyebrow} onChange={(heroEyebrow) => update({ heroEyebrow })} />
          <Field label="Headline" rows={2} value={content.heroHeadline} onChange={(heroHeadline) => update({ heroHeadline })} />
          <Field label="Introduction" value={content.heroLede} onChange={(heroLede) => update({ heroLede })} />
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Three points</h2>
        <div className="mt-6 grid gap-8">
          {content.pillars.map((item, index) => (
            <div key={index} className="grid gap-5">
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
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">About</h2>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.aboutEyebrow} onChange={(aboutEyebrow) => update({ aboutEyebrow })} />
          <Field label="Heading" rows={2} value={content.aboutHeading} onChange={(aboutHeading) => update({ aboutHeading })} />
          <Field label="First paragraph" value={content.aboutLead} onChange={(aboutLead) => update({ aboutLead })} />
          <Field label="Second paragraph" value={content.aboutBody} onChange={(aboutBody) => update({ aboutBody })} />
        </div>
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
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Coverage</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">The state list beside this paragraph stays as published.</p>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.coverageEyebrow} onChange={(coverageEyebrow) => update({ coverageEyebrow })} />
          <Field label="Heading" rows={2} value={content.coverageHeading} onChange={(coverageHeading) => update({ coverageHeading })} />
          <Field label="Paragraph" value={content.coverageText} onChange={(coverageText) => update({ coverageText })} />
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Closing invitation</h2>
        <div className="mt-6 grid gap-5">
          <Field label="Eyebrow" rows={1} value={content.ctaEyebrow} onChange={(ctaEyebrow) => update({ ctaEyebrow })} />
          <Field label="Heading" rows={2} value={content.ctaHeading} onChange={(ctaHeading) => update({ ctaHeading })} />
          <Field label="Paragraph" value={content.ctaText} onChange={(ctaText) => update({ ctaText })} />
        </div>
      </section>

      {error ? (
        <p role="alert" className="border border-brass bg-paper-deep px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}
      {status ? <p className="text-sm font-semibold">{status}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-12 w-fit items-center justify-center bg-ink px-6 text-sm font-semibold text-paper disabled:opacity-60"
      >
        {saving ? "Saving" : "Save homepage"}
      </button>
    </form>
  );
}
