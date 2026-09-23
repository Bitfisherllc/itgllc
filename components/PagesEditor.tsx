"use client";

import { useEffect, useState } from "react";
import { LogoAnimationPreview } from "@/components/FooterLogo";
import { OfficeAddressField } from "@/components/OfficeAddressField";
import { refreshPages } from "@/components/usePages";
import { pageCopy, pageLabels, type PageCopy } from "@/lib/page-copy";

const fieldClass =
  "mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus-visible:border-brass";

const saveButtonClass =
  "inline-flex min-h-12 w-fit items-center justify-center bg-ink px-6 text-sm font-semibold text-paper disabled:opacity-60";

const hidden = new Set(["slug", "image", "disclaimer", "entries", "lat", "lon", "placeId"]);

const labels: Record<string, string> = {
  eyebrow: "Eyebrow",
  title: "Headline",
  lede: "Introduction",
  imageAlt: "Photograph description",
  paragraphs: "Paragraphs",
  teamsHeading: "Teams heading",
  teams: "Teams",
  buttonLabel: "Button",
  items: "Entries",
  summary: "Summary",
  sections: "Sections",
  heading: "Heading",
  faqs: "Questions",
  question: "Question",
  answer: "Answer",
  mapAlt: "Map description",
  licensedLabel: "Licensed label",
  unlicensedLabel: "Unlicensed label",
  statesHeading: "States heading",
  states: "States",
  note: "Note",
  formHeading: "Form heading",
  formIntro: "Form introduction",
  departments: "Departments",
  label: "Label",
  detail: "Detail",
  articlesHeading: "Articles heading",
  articlesLede: "Articles introduction",
  beforeHeading: "Checklist heading",
  notes: "Checklist",
  quoteLabel: "Quote button",
  quoteNote: "Quote note",
  platformLabel: "Platform link",
  platformNote: "Platform note",
  text: "Text",
  footer: "Footer",
  phone: "Phone",
  fax: "Fax",
  street: "Street address",
  city: "City",
  region: "State",
  postalCode: "Postal code",
  emailGeneral: "General email",
  emailOrders: "New orders email",
  emailPostClosing: "Post-closing email",
  emailPreCd: "Pre-closing disclosures email",
  emailProcessing: "Processing email",
  emailEvents: "Events email",
  name: "Name",
  role: "Title",
  excerpt: "Excerpt",
  people: "People",
};

type LibraryImage = { id: string; src: string };
type FooterLogo = { src: string; label: string };
type Path = (string | number)[];

function photoPath(src: string) {
  return src.split("?")[0];
}

function PhotoField({
  src,
  pageId,
  slug,
  library,
  onSaved,
  onError,
  onUpload,
  onChoose,
}: {
  src: string;
  pageId: string;
  slug?: string;
  library: LibraryImage[];
  onSaved: (content: PageCopy[keyof PageCopy], library: LibraryImage[]) => void;
  onError: (message: string) => void;
  onUpload?: (file: File) => Promise<void>;
  onChoose?: (imageId: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const current = photoPath(src);

  async function finish(response: Response) {
    const body = (await response.json()) as {
      ok?: boolean;
      content?: PageCopy[keyof PageCopy];
      library?: LibraryImage[];
      error?: string;
    };
    setBusy(false);
    if (!response.ok || !body.ok || !body.content || !body.library) {
      onError(body.error || "The photograph could not be saved.");
      return;
    }
    onSaved(body.content, body.library);
  }

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    onError("");
    if (onUpload) {
      try {
        await onUpload(file);
      } catch (reason) {
        onError(reason instanceof Error ? reason.message : "The photograph could not be saved.");
      } finally {
        setBusy(false);
      }
      return;
    }
    const query = `id=${encodeURIComponent(pageId)}${slug ? `&slug=${encodeURIComponent(slug)}` : ""}`;
    const response = await fetch(`/api/admin/page-image?${query}`, {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    await finish(response);
  }

  async function choose(imageId: string) {
    setBusy(true);
    onError("");
    if (onChoose) {
      try {
        await onChoose(imageId);
        setOpen(false);
      } catch (reason) {
        onError(reason instanceof Error ? reason.message : "The photograph could not be saved.");
      } finally {
        setBusy(false);
      }
      return;
    }
    const response = await fetch("/api/admin/page-image/choose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pageId, slug: slug || "", imageId }),
    });
    await finish(response);
  }

  return (
    <div>
      <span className="text-sm font-semibold">Photograph</span>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="mt-2 h-auto w-full max-w-sm" />
      ) : (
        <p className="mt-2 text-sm text-ink-soft">No photograph yet.</p>
      )}
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
          aria-expanded={open}
          disabled={busy}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Hide library" : "Choose from library"}
        </button>
      </div>
      {open ? (
        <div className="mt-4 grid max-h-80 grid-cols-2 gap-2 overflow-auto sm:grid-cols-3">
          {library.length ? (
            library.map((image, index) => {
              const selected = photoPath(image.src) === current;
              return (
                <button
                  key={image.id}
                  type="button"
                  disabled={busy}
                  aria-pressed={selected}
                  aria-label={`Use library image ${index + 1}`}
                  className={`block w-full border ${selected ? "border-brass-deep" : "border-line"}`}
                  onClick={() => choose(image.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.src} alt="" className="h-auto w-full" />
                </button>
              );
            })
          ) : (
            <p className="text-sm text-ink-soft">No library images yet.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function labelFor(key: string) {
  if (labels[key]) return labels[key];
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function setIn<T>(source: T, path: Path, value: string): T {
  const next = structuredClone(source) as Record<string, unknown> | unknown[];
  let cursor: unknown = next;
  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = (cursor as Record<string, unknown>)[path[index] as string];
  }
  (cursor as Record<string, unknown>)[path[path.length - 1] as string] = value;
  return next as T;
}

function itemHeading(value: unknown, index: number) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const name = record.title || record.heading || record.question || record.label;
    if (typeof name === "string" && name) return name;
  }
  return `Item ${index + 1}`;
}

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  const lines = rows ?? (value.length > 140 ? 6 : value.length > 60 ? 3 : 1);
  return (
    <label className="block text-sm font-semibold">
      {label}
      {lines === 1 ? (
        <input className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <textarea className={fieldClass} rows={lines} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function itemLabel(key: string, index: number) {
  const names: Record<string, string> = {
    paragraphs: "Paragraph",
    states: "State",
    notes: "Note",
    items: "Line",
  };
  return `${names[key] ?? "Item"} ${index + 1}`;
}

function Fields({
  value,
  path,
  onChange,
}: {
  value: unknown;
  path: Path;
  onChange: (path: Path, value: string) => void;
}) {
  if (typeof value === "string") {
    const key = String(path[path.length - 1] ?? "Text");
    return <Field label={labelFor(key)} value={value} onChange={(next) => onChange(path, next)} />;
  }
  if (Array.isArray(value)) {
    const key = String(path[path.length - 1] ?? "items");
    return (
      <div className="grid gap-6">
        {value.map((item, index) =>
          typeof item === "string" ? (
            <Field
              key={index}
              label={itemLabel(key, index)}
              value={item}
              onChange={(next) => onChange([...path, index], next)}
            />
          ) : (
            <div key={index} className="border-t border-line pt-5">
              <h3 className="font-serif text-2xl">{itemHeading(item, index)}</h3>
              <div className="mt-4 grid gap-5">
                <Fields value={item} path={[...path, index]} onChange={onChange} />
              </div>
            </div>
          ),
        )}
      </div>
    );
  }
  if (value && typeof value === "object") {
    return (
      <div className="grid gap-5">
        {Object.entries(value)
          .filter(([key]) => !hidden.has(key))
          .map(([key, child]) => (
            <Fields key={key} value={child} path={[...path, key]} onChange={onChange} />
          ))}
      </div>
    );
  }
  return null;
}

export function PagesEditor({
  id,
  slug,
  label,
}: {
  id: keyof PageCopy;
  slug?: string;
  label: string;
}) {
  const [pages, setPages] = useState<PageCopy>(pageCopy);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [library, setLibrary] = useState<LibraryImage[]>([]);
  const [logos, setLogos] = useState<FooterLogo[]>([]);
  const [logoBusy, setLogoBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/pages")
      .then((response) => response.json())
      .then((body: { pages?: PageCopy }) => {
        if (!cancelled && body.pages) setPages(body.pages);
      })
      .catch(() => {
        if (!cancelled) setError("Page text could not be loaded.");
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

  useEffect(() => {
    if (id !== "other") return;
    let cancelled = false;
    fetch("/api/admin/footer-logos")
      .then((response) => response.json())
      .then((body: { logos?: FooterLogo[] }) => {
        if (!cancelled && body.logos) setLogos(body.logos);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setStatus("");
    setError("");
  }, [id, slug]);

  const content = pages[id];
  const focused =
    slug && "items" in content
      ? content.items.findIndex((item: { slug: string }) => item.slug === slug)
      : -1;
  const focusedItem = focused >= 0 && "items" in content ? content.items[focused] : null;
  const indexOnly = (id === "services" || id === "resources") && !slug;
  const indexKeys =
    id === "services"
      ? ["eyebrow", "title", "lede"]
      : ["eyebrow", "title", "lede", "articlesHeading", "articlesLede"];
  const entries = Object.entries(content).filter(([key]) => !hidden.has(key));
  const scalars = (
    indexOnly ? entries.filter(([key]) => indexKeys.includes(key)) : focusedItem ? [] : entries
  )
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .filter(([key]) => key !== "footerLogo");
  const groups = focusedItem || indexOnly ? [] : entries.filter((entry) => typeof entry[1] !== "string" && entry[0] !== "people");
  const teamPeople = id === "team" && "people" in content ? content.people : null;
  const glossaryEntries =
    id === "resources" && focusedItem && "entries" in focusedItem && Array.isArray(focusedItem.entries)
      ? focusedItem.entries
      : null;

  const itemImage = focusedItem && "image" in focusedItem ? focusedItem.image : "";
  const pageImage = !focusedItem && "image" in content ? content.image : "";

  function onPhoto(next: PageCopy[keyof PageCopy], images: LibraryImage[]) {
    setPages((current) => ({ ...current, [id]: next }));
    setLibrary(images);
    setStatus("Saved. The photograph is updated.");
    setError("");
  }

  async function addAnimations(event: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    if (!files.length || id !== "other") return;
    setLogoBusy(true);
    setError("");
    setStatus("");
    const problems: string[] = [];
    let added = 0;
    for (const file of files) {
      const response = await fetch(`/api/admin/footer-logos?name=${encodeURIComponent(file.name)}`, {
        method: "POST",
        headers: { "Content-Type": file.type || "image/svg+xml" },
        body: file,
      });
      const body = (await response.json()) as { ok?: boolean; logos?: FooterLogo[]; error?: string };
      if (!response.ok || !body.ok || !body.logos) {
        problems.push(file.name);
        continue;
      }
      added += 1;
      setLogos(body.logos);
    }
    setLogoBusy(false);
    if (added) setStatus(added === 1 ? "1 animation added to the gallery." : `${added} animations added to the gallery.`);
    if (problems.length) setError("Use an SVG under 1 MB.");
  }

  async function useAnimation(src: string) {
    if (id !== "other" || !("footerLogo" in pages.other)) return;
    setLogoBusy(true);
    setError("");
    setStatus("");
    const response = await fetch("/api/admin/footer-logos/choose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src }),
    });
    const body = (await response.json()) as { ok?: boolean; content?: PageCopy["other"]; error?: string };
    setLogoBusy(false);
    if (!response.ok || !body.ok || !body.content) {
      setError(body.error || "That animation could not be used.");
      return;
    }
    setPages((current) => ({ ...current, other: { ...current.other, footerLogo: body.content?.footerLogo || src } }));
    refreshPages();
    setStatus("This animation is on the site.");
  }

  async function removeAnimation(src: string) {
    if (!window.confirm("Remove this animation from the gallery?")) return;
    setLogoBusy(true);
    setError("");
    setStatus("");
    const response = await fetch("/api/admin/footer-logos/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ src }),
    });
    const body = (await response.json()) as {
      ok?: boolean;
      content?: PageCopy["other"];
      logos?: FooterLogo[];
      error?: string;
    };
    setLogoBusy(false);
    if (!response.ok || !body.ok || !body.logos) {
      setError(body.error || "That animation could not be removed.");
      return;
    }
    setLogos(body.logos);
    if (body.content && "footerLogo" in pages.other) {
      setPages((current) => ({
        ...current,
        other: { ...current.other, footerLogo: body.content?.footerLogo || current.other.footerLogo },
      }));
      refreshPages();
    }
    setStatus("Removed from the gallery.");
  }

  function onChange(path: Path, value: string) {
    setPages((current) => ({ ...current, [id]: setIn(current[id], path, value) }));
    setStatus("");
  }

  async function savePersonPhoto(index: number, src: string, images?: LibraryImage[]) {
    if (id !== "team" || !("people" in pages.team)) return;
    const content = {
      ...pages.team,
      people: pages.team.people.map((person, personIndex) =>
        personIndex === index ? { ...person, image: src } : person,
      ),
    };
    const response = await fetch("/api/admin/page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "team", content }),
    });
    const body = (await response.json()) as { ok?: boolean; content?: PageCopy["team"]; error?: string };
    if (!response.ok || !body.ok || !body.content) {
      throw new Error(body.error || "The photograph could not be saved.");
    }
    setPages((current) => ({ ...current, team: body.content as PageCopy["team"] }));
    if (images) setLibrary(images);
    refreshPages();
    setStatus("Saved. The photograph is updated.");
    setError("");
  }

  async function uploadPersonPhoto(index: number, file: File) {
    const response = await fetch("/api/admin/library/upload", {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    const body = (await response.json()) as { ok?: boolean; library?: LibraryImage[]; error?: string };
    const image = body.library?.[0];
    if (!response.ok || !body.ok || !image) {
      throw new Error(body.error || "The photograph could not be saved.");
    }
    await savePersonPhoto(index, `${image.src}?v=${Date.now()}`, body.library);
  }

  async function choosePersonPhoto(index: number, imageId: string) {
    const image = library.find((item) => item.id === imageId);
    if (!image) throw new Error("That library image was not found.");
    await savePersonPhoto(index, image.src);
  }

  function addPerson() {
    if (id !== "team") return;
    setPages((current) => ({
      ...current,
      team: {
        ...current.team,
        people: [...current.team.people, { name: "", role: "", excerpt: "", image: "" }],
      },
    }));
    setStatus("");
  }

  function changeEntries(next: { term: string; definition: string }[]) {
    if (id !== "resources" || focused < 0) return;
    setPages((current) => ({
      ...current,
      resources: {
        ...current.resources,
        items: current.resources.items.map((item, index) => (index === focused ? { ...item, entries: next } : item)),
      },
    }));
    setStatus("");
  }

  function removePerson(index: number) {
    if (id !== "team") return;
    setPages((current) => ({
      ...current,
      team: {
        ...current.team,
        people: current.team.people.filter((_, itemIndex) => itemIndex !== index),
      },
    }));
    setStatus("");
  }

  async function onSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    const response = await fetch("/api/admin/page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, content: pages[id] }),
    });
    const body = (await response.json()) as { ok?: boolean; content?: PageCopy[typeof id]; error?: string };
    setSaving(false);
    if (!response.ok || !body.ok || !body.content) {
      setError(body.error || "The page could not be saved.");
      return;
    }
    setPages((current) => ({ ...current, [id]: body.content as PageCopy[typeof id] }));
    refreshPages();
    setStatus("Saved. This page is updated.");
  }

  return (
    <form onSubmit={onSave} className="mt-10 grid gap-8">
      <div className="sticky top-16 z-40 flex flex-wrap items-center gap-x-4 gap-y-2 border border-line bg-white px-4 py-3">
        <button type="submit" disabled={saving} className={saveButtonClass}>
          {saving ? "Saving" : "Save page"}
        </button>
        {error ? (
          <p role="alert" className="text-sm">
            {error}
          </p>
        ) : status ? (
          <p className="text-sm font-semibold">{status}</p>
        ) : (
          <p className="text-sm text-ink-soft">Saves the text for {label}.</p>
        )}
      </div>

      {focusedItem ? (
        <section className="border border-line bg-white p-6">
          <h2 className="font-serif text-3xl">{label}</h2>
          <div className="mt-6 grid gap-5">
            {itemImage ? (
              <PhotoField
                src={itemImage}
                pageId={id}
                slug={slug}
                library={library}
                onSaved={onPhoto}
                onError={setError}
              />
            ) : null}
            <Fields value={focusedItem} path={["items", focused]} onChange={onChange} />
          </div>
          {id === "resources" && slug === "faq" && "faqs" in content ? (
            <div className="mt-8">
              <h3 className="font-serif text-2xl">Questions</h3>
              <div className="mt-6">
                <Fields value={content.faqs} path={["faqs"]} onChange={onChange} />
              </div>
            </div>
          ) : null}
          {glossaryEntries ? (
            <div className="mt-8 grid gap-8">
              <h3 className="font-serif text-2xl">Terms</h3>
              {glossaryEntries.map((entry, index) => (
                <div key={index} className="grid gap-5 border-t border-line pt-5">
                  <Field
                    label="Term"
                    value={entry.term}
                    onChange={(next) => onChange(["items", focused, "entries", index, "term"], next)}
                  />
                  <Field
                    label="Definition"
                    value={entry.definition}
                    rows={4}
                    onChange={(next) => onChange(["items", focused, "entries", index, "definition"], next)}
                  />
                  <button
                    type="button"
                    className="w-fit text-sm font-semibold underline"
                    onClick={() => changeEntries(glossaryEntries.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="inline-flex min-h-11 w-fit items-center border border-line px-4 text-sm font-semibold"
                onClick={() => changeEntries([...glossaryEntries, { term: "", definition: "" }])}
              >
                Add a term
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <>
          <section className="border border-line bg-white p-6">
            <h2 className="font-serif text-3xl">{label || pageLabels[id]}</h2>
            {id === "office" ? (
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
                These details are used for the phone, fax, address, and email addresses across the site. The office map and Get Directions follow the address chosen below.
              </p>
            ) : null}
            <div className="mt-6 grid gap-5">
              {id === "other" && "footerLogo" in content ? (
                <div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold">Animation gallery</p>
                      <p className="mt-1 text-sm text-ink-soft">
                        Choose the animation used in the footer. Play previews it. Use puts it on the site.
                      </p>
                    </div>
                    <label className="inline-flex min-h-11 cursor-pointer items-center justify-center bg-ink px-5 text-sm font-semibold text-paper">
                      {logoBusy ? "Working" : "Add animations"}
                      <input
                        type="file"
                        accept="image/svg+xml,.svg"
                        multiple
                        className="sr-only"
                        disabled={logoBusy}
                        onChange={addAnimations}
                      />
                    </label>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {logos.map((item) => {
                      const selected = content.footerLogo === item.src;
                      return (
                        <div key={item.src} className={`border p-3 ${selected ? "border-ink" : "border-line"}`}>
                          <LogoAnimationPreview src={item.src} frameClass="h-40" />
                          <p className="mt-3 text-sm font-semibold">{item.label}</p>
                          <div className="mt-3 flex flex-wrap gap-3">
                            <button
                              type="button"
                              aria-pressed={selected}
                              disabled={logoBusy || selected}
                              onClick={() => useAnimation(item.src)}
                              className="inline-flex min-h-11 items-center bg-ink px-4 text-sm font-semibold text-paper disabled:opacity-60"
                            >
                              {selected ? "In use" : "Use this animation"}
                            </button>
                            <button
                              type="button"
                              disabled={logoBusy}
                              onClick={() => removeAnimation(item.src)}
                              className="inline-flex min-h-11 items-center text-sm font-semibold underline disabled:opacity-60"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              {pageImage ? (
                <PhotoField
                  src={pageImage}
                  pageId={id}
                  library={library}
                  onSaved={onPhoto}
                  onError={setError}
                />
              ) : null}
              {id === "office" && "street" in content ? (
                <OfficeAddressField
                  office={content}
                  onSelect={(address) => {
                    setPages((current) => ({ ...current, office: { ...current.office, ...address } }));
                    setStatus("");
                  }}
                />
              ) : null}
              {scalars
                .filter(([key]) => !(id === "office" && ["street", "city", "region", "postalCode"].includes(key)))
                .map(([key, value]) => (
                <Field key={key} label={labelFor(key)} value={value} onChange={(next) => onChange([key], next)} />
              ))}
            </div>
          </section>

          {groups.map(([key, value]) => (
            <section key={key} className="border border-line bg-white p-6">
              <h2 className="font-serif text-3xl">{labelFor(key)}</h2>
              <div className="mt-6">
                <Fields value={value} path={[key]} onChange={onChange} />
              </div>
            </section>
          ))}

          {teamPeople ? (
            <section className="border border-line bg-white p-6">
              <h2 className="font-serif text-3xl">People</h2>
              <div className="mt-6 grid gap-8">
                {teamPeople.map((person, index) => (
                  <div key={index} className="grid gap-5 border-t border-line pt-5 first:border-t-0 first:pt-0">
                    <PhotoField
                      src={person.image || ""}
                      pageId="team"
                      library={library}
                      onSaved={onPhoto}
                      onError={setError}
                      onUpload={(file) => uploadPersonPhoto(index, file)}
                      onChoose={(imageId) => choosePersonPhoto(index, imageId)}
                    />
                    <Field label="Name" value={person.name} onChange={(next) => onChange(["people", index, "name"], next)} />
                    <Field label="Title" value={person.role} onChange={(next) => onChange(["people", index, "role"], next)} />
                    <Field
                      label="Excerpt"
                      value={person.excerpt}
                      rows={4}
                      onChange={(next) => onChange(["people", index, "excerpt"], next)}
                    />
                    <button
                      type="button"
                      className="w-fit text-sm font-semibold underline"
                      onClick={() => removePerson(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="inline-flex min-h-11 w-fit items-center border border-line px-4 text-sm font-semibold"
                  onClick={addPerson}
                >
                  Add a person
                </button>
              </div>
            </section>
          ) : null}
        </>
      )}
    </form>
  );
}
