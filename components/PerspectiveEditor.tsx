"use client";

import { useState } from "react";
import { perspectiveTopics, todayIso, type PerspectivePost } from "@/lib/perspective";
import type { PageCopy } from "@/lib/page-copy";

const fieldClass =
  "mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus-visible:border-brass";

type Page = PageCopy["perspective"];

function blankPost(): PerspectivePost {
  return {
    slug: `new-note-${todayIso()}`,
    title: "New note",
    summary: "",
    category: "homebuyers",
    published: false,
    featured: false,
    date: todayIso(),
    updated: "",
    author: "Integrity Title Group",
    image: "",
    imageAlt: "",
    answer: "",
    sections: [{ heading: "", paragraphs: [""], items: [], note: "" }],
    faqs: [],
    seoTitle: "",
    seoDescription: "",
  };
}

export function PerspectiveEditor({
  page,
  slug,
  library,
  onChange,
}: {
  page: Page;
  slug?: string;
  library: { src: string }[];
  onChange: (next: Page) => void;
}) {
  const initial = slug ? page.items.findIndex((item) => item.slug === slug) : -1;
  const [open, setOpen] = useState(initial);

  function setItems(items: PerspectivePost[]) {
    onChange({ ...page, items });
  }

  function update(index: number, next: PerspectivePost) {
    setItems(page.items.map((item, itemIndex) => (itemIndex === index ? next : item)));
  }

  function feature(index: number) {
    setItems(page.items.map((item, itemIndex) => ({ ...item, featured: itemIndex === index })));
  }

  return (
    <div className="grid gap-8">
      <section className="border border-line bg-white p-6">
        <h2 className="font-serif text-3xl">Publication</h2>
        <div className="mt-6 grid gap-5">
          <label className="block text-sm font-semibold">
            Eyebrow
            <input className={fieldClass} value={page.eyebrow} onChange={(event) => onChange({ ...page, eyebrow: event.target.value })} />
          </label>
          <label className="block text-sm font-semibold">
            Publication name
            <input className={fieldClass} value={page.title} onChange={(event) => onChange({ ...page, title: event.target.value })} />
          </label>
          <label className="block text-sm font-semibold">
            Tagline
            <textarea className={fieldClass} rows={3} value={page.lede} onChange={(event) => onChange({ ...page, lede: event.target.value })} />
          </label>
        </div>
      </section>

      <section className="border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-3xl">Notes</h2>
          <button
            type="button"
            className="inline-flex min-h-11 items-center bg-ink px-4 text-sm font-semibold text-paper"
            onClick={() => {
              setItems([blankPost(), ...page.items]);
              setOpen(0);
            }}
          >
            New note
          </button>
        </div>
        <div className="mt-6 grid gap-4">
          {page.items.map((item, index) => (
            <div key={`${item.slug}-${index}`} className="border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.title || "Untitled"}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {item.published ? "Published" : "Draft"}
                    {item.date ? ` · ${item.date}` : ""}
                    {item.featured ? " · Featured" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-semibold">
                  <button type="button" className="underline" onClick={() => setOpen(open === index ? -1 : index)}>
                    {open === index ? "Close" : "Edit"}
                  </button>
                  <button
                    type="button"
                    className="underline"
                    onClick={() => {
                      const copy = {
                        ...item,
                        title: `Copy of ${item.title}`,
                        slug: `${item.slug}-copy`,
                        published: false,
                        featured: false,
                      };
                      const items = [...page.items];
                      items.splice(index + 1, 0, copy);
                      setItems(items);
                      setOpen(index + 1);
                    }}
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="underline"
                    onClick={() => {
                      if (!window.confirm(`Delete “${item.title || "this note"}”?`)) return;
                      setItems(page.items.filter((_, itemIndex) => itemIndex !== index));
                      setOpen(-1);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {open === index ? (
                <PostForm
                  post={item}
                  library={library}
                  onChange={(next) => update(index, next)}
                  onFeature={() => feature(index)}
                />
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PostForm({
  post,
  library,
  onChange,
  onFeature,
}: {
  post: PerspectivePost;
  library: { src: string }[];
  onChange: (next: PerspectivePost) => void;
  onFeature: () => void;
}) {
  return (
    <div className="mt-6 grid gap-5 border-t border-line pt-6">
      <label className="block text-sm font-semibold">
        Headline
        <input className={fieldClass} value={post.title} onChange={(event) => onChange({ ...post, title: event.target.value })} />
      </label>
      <label className="block text-sm font-semibold">
        URL slug
        <input className={fieldClass} value={post.slug} onChange={(event) => onChange({ ...post, slug: event.target.value })} />
      </label>
      <label className="block text-sm font-semibold">
        Excerpt
        <textarea className={fieldClass} rows={3} value={post.summary} onChange={(event) => onChange({ ...post, summary: event.target.value })} />
      </label>
      <label className="block text-sm font-semibold">
        Topic
        <select className={fieldClass} value={post.category} onChange={(event) => onChange({ ...post, category: event.target.value })}>
          {perspectiveTopics.map((topic) => (
            <option key={topic.slug} value={topic.slug}>
              {topic.label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-6 text-sm font-semibold">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={post.published}
            onChange={(event) => onChange({ ...post, published: event.target.checked })}
          />
          Published
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={post.featured} onChange={(event) => (event.target.checked ? onFeature() : onChange({ ...post, featured: false }))} />
          Featured
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold">
          Publication date
          <input className={fieldClass} value={post.date} placeholder="YYYY-MM-DD" onChange={(event) => onChange({ ...post, date: event.target.value })} />
        </label>
        <label className="block text-sm font-semibold">
          Last updated
          <input className={fieldClass} value={post.updated} placeholder="YYYY-MM-DD" onChange={(event) => onChange({ ...post, updated: event.target.value })} />
        </label>
      </div>
      <p className="text-sm text-ink-soft">A future publication date stays off the public journal until that day.</p>
      <label className="block text-sm font-semibold">
        Quick answer
        <textarea className={fieldClass} rows={4} value={post.answer} onChange={(event) => onChange({ ...post, answer: event.target.value })} />
      </label>
      <div>
        <p className="text-sm font-semibold">Featured image</p>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {library.slice(0, 12).map((image) => (
            <button
              key={image.src}
              type="button"
              className={`border ${post.image.startsWith(image.src.split("?")[0]) ? "border-ink" : "border-line"}`}
              onClick={() => onChange({ ...post, image: image.src })}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt="" className="aspect-[3/2] w-full object-cover" />
            </button>
          ))}
        </div>
        <label className="mt-4 block text-sm font-semibold">
          Image address
          <input className={fieldClass} value={post.image} onChange={(event) => onChange({ ...post, image: event.target.value })} />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Image description
          <input className={fieldClass} value={post.imageAlt} onChange={(event) => onChange({ ...post, imageAlt: event.target.value })} />
        </label>
      </div>
      <div className="grid gap-8">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl">Sections</h3>
          <button
            type="button"
            className="text-sm font-semibold underline"
            onClick={() => onChange({ ...post, sections: [...post.sections, { heading: "", paragraphs: [""], items: [], note: "" }] })}
          >
            Add a section
          </button>
        </div>
        {post.sections.map((section, index) => (
          <div key={index} className="grid gap-4 border-t border-line pt-4">
            <label className="block text-sm font-semibold">
              Heading
              <input
                className={fieldClass}
                value={section.heading}
                onChange={(event) => {
                  const sections = post.sections.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, heading: event.target.value } : item,
                  );
                  onChange({ ...post, sections });
                }}
              />
            </label>
            <label className="block text-sm font-semibold">
              Paragraphs
              <textarea
                className={fieldClass}
                rows={5}
                value={section.paragraphs.join("\n")}
                onChange={(event) => {
                  const sections = post.sections.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, paragraphs: event.target.value.split("\n") } : item,
                  );
                  onChange({ ...post, sections });
                }}
              />
            </label>
            <p className="text-sm text-ink-soft">One paragraph per line. A blank line is dropped when the page is saved.</p>
            <label className="block text-sm font-semibold">
              Bullet list
              <textarea
                className={fieldClass}
                rows={3}
                value={(section.items || []).join("\n")}
                onChange={(event) => {
                  const sections = post.sections.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, items: event.target.value.split("\n") } : item,
                  );
                  onChange({ ...post, sections });
                }}
              />
            </label>
            <label className="block text-sm font-semibold">
              Highlighted note
              <textarea
                className={fieldClass}
                rows={2}
                value={section.note || ""}
                onChange={(event) => {
                  const sections = post.sections.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, note: event.target.value } : item,
                  );
                  onChange({ ...post, sections });
                }}
              />
            </label>
            <button
              type="button"
              className="w-fit text-sm font-semibold underline"
              onClick={() => onChange({ ...post, sections: post.sections.filter((_, itemIndex) => itemIndex !== index) })}
            >
              Remove section
            </button>
          </div>
        ))}
      </div>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl">Questions</h3>
          <button
            type="button"
            className="text-sm font-semibold underline"
            onClick={() => onChange({ ...post, faqs: [...post.faqs, { question: "", answer: "" }] })}
          >
            Add a question
          </button>
        </div>
        {post.faqs.map((faq, index) => (
          <div key={index} className="grid gap-4 border-t border-line pt-4">
            <label className="block text-sm font-semibold">
              Question
              <input
                className={fieldClass}
                value={faq.question}
                onChange={(event) => {
                  const faqs = post.faqs.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, question: event.target.value } : item,
                  );
                  onChange({ ...post, faqs });
                }}
              />
            </label>
            <label className="block text-sm font-semibold">
              Answer
              <textarea
                className={fieldClass}
                rows={3}
                value={faq.answer}
                onChange={(event) => {
                  const faqs = post.faqs.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, answer: event.target.value } : item,
                  );
                  onChange({ ...post, faqs });
                }}
              />
            </label>
            <button
              type="button"
              className="w-fit text-sm font-semibold underline"
              onClick={() => onChange({ ...post, faqs: post.faqs.filter((_, itemIndex) => itemIndex !== index) })}
            >
              Remove question
            </button>
          </div>
        ))}
      </div>
      <div className="grid gap-5 border-t border-line pt-6">
        <h3 className="font-serif text-2xl">Search</h3>
        <label className="block text-sm font-semibold">
          SEO title
          <input className={fieldClass} value={post.seoTitle} onChange={(event) => onChange({ ...post, seoTitle: event.target.value })} />
        </label>
        <label className="block text-sm font-semibold">
          Meta description
          <textarea className={fieldClass} rows={3} value={post.seoDescription} onChange={(event) => onChange({ ...post, seoDescription: event.target.value })} />
        </label>
        <p className="text-sm text-ink-soft">Leave these blank to use the headline and the excerpt.</p>
      </div>
    </div>
  );
}
