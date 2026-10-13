"use client";

import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclaimer } from "@/components/Disclaimer";
import { JsonLd } from "@/components/JsonLd";
import { useAdminNav } from "@/components/AdminNav";
import { usePages } from "@/components/usePages";
import {
  formatPostDate,
  headingId,
  isLivePost,
  perspectiveTopics,
  readingMinutes,
  topicLabel,
  type PerspectivePost,
} from "@/lib/perspective";
import { familyPath } from "@/lib/page-copy";
import { site } from "@/lib/site";

const questions = [
  { question: "What does a title company do?", slug: "what-a-title-company-does" },
  { question: "Who chooses the title company?", slug: "who-chooses-the-title-company" },
  { question: "How much does title insurance cost?", slug: "what-is-title-insurance" },
  { question: "What happens on closing day?", slug: "what-happens-on-closing-day" },
  { question: "What can delay a real estate closing?", slug: "what-can-delay-a-closing" },
  { question: "What happens after closing?", slug: "what-happens-on-closing-day" },
];

const audiences = [
  {
    label: "Realtors",
    text: "What a file update should say, and what the office will not promise a client.",
    slug: "what-realtors-should-expect",
  },
  {
    label: "Mortgage lenders",
    text: "How a named open item, sent while there is still time, keeps a signing on the contract date.",
    slug: "why-communication-matters",
  },
  {
    label: "Attorneys",
    text: "What the office reports when a search finds a recorded matter, and where legal advice belongs.",
    slug: "when-a-title-search-finds-a-problem",
  },
  {
    label: "Real estate investors",
    text: "How a recorded lien is handled in a sale file, and why a general note cannot clear a property.",
    slug: "selling-a-house-with-a-lien",
  },
];

function postHref(slug: string) {
  return `/resources/the-closing-perspective/${slug}`;
}

export function PerspectiveView({ slug }: { slug?: string }) {
  const { perspective } = usePages();
  const { signedIn } = useAdminNav();
  const post = slug ? perspective.items.find((item) => item.slug === slug) : null;
  if (slug && !post) notFound();
  if (slug && post && !isLivePost(post) && signedIn === false) notFound();

  if (post) {
    if (!isLivePost(post) && signedIn === null) return null;
    return <Article post={post} journal={perspective.title} draft={!isLivePost(post)} />;
  }

  return <Journal signedIn={signedIn === true} />;
}

function Journal({ signedIn }: { signedIn: boolean }) {
  const { perspective } = usePages();
  const params = useSearchParams();
  const topic = params.get("topic") || "";
  const activeTopic = perspectiveTopics.some((item) => item.slug === topic) ? topic : "";
  const live = perspective.items.filter((item) => isLivePost(item));
  const source = signedIn ? perspective.items.filter((item) => item.slug && item.title) : live;
  const featured = live.find((item) => item.featured) || live[0];
  const filtered = activeTopic ? source.filter((item) => item.category === activeTopic) : source;
  const grid = filtered.filter((item) => item.slug !== featured?.slug || activeTopic);
  const [shown, setShown] = useState(6);
  const visible = grid.slice(0, shown);
  const questionLinks = questions.filter((item) => live.some((post) => post.slug === item.slug));

  return (
    <>
      <header className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
          <p className="eyebrow text-brass">By {site.legalName}</p>
          <h1 className="display mt-5 max-w-4xl text-5xl md:text-7xl">{perspective.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/80">{perspective.lede}</p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-20">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: perspective.title, path: "/resources/the-closing-perspective" },
          ]}
        />

        {featured && !activeTopic ? (
          <section className="mt-12" aria-labelledby="featured-heading">
            <p className="eyebrow text-brass">Featured</p>
            <article className="mt-5 grid items-stretch gap-8 lg:grid-cols-12">
              <Link href={postHref(featured.slug)} className="group photo-shadow block overflow-hidden lg:col-span-7">
                {featured.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.image}
                    alt={featured.imageAlt || ""}
                    className="aspect-[16/10] h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                ) : null}
              </Link>
              <div className="flex flex-col justify-center lg:col-span-5">
                <p className="text-sm font-semibold text-brass">{topicLabel(featured.category)}</p>
                <h2 id="featured-heading" className="display mt-3 text-4xl md:text-5xl">
                  <Link href={postHref(featured.slug)} className="hover:text-brass-deep">
                    {featured.title}
                  </Link>
                </h2>
                <p className="mt-4 leading-relaxed text-ink-soft">{featured.summary}</p>
                <p className="mt-4 text-sm text-ink-soft">
                  {formatPostDate(featured.date)}
                  <span aria-hidden="true"> · </span>
                  {readingMinutes(featured)} min read
                </p>
                <Link
                  href={postHref(featured.slug)}
                  className="header-action mt-6 inline-flex min-h-12 w-fit items-center px-6 text-sm font-semibold"
                >
                  Read article
                </Link>
              </div>
            </article>
          </section>
        ) : null}

        <section className="mt-16" aria-labelledby="topics-heading">
          <h2 id="topics-heading" className="display text-3xl">
            Browse by topic
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/resources/the-closing-perspective"
              className={`inline-flex min-h-11 items-center px-4 text-sm font-semibold ${activeTopic ? "border border-line" : "bg-ink text-paper"}`}
              aria-current={activeTopic ? undefined : "true"}
            >
              All notes
            </Link>
            {perspectiveTopics.map((item) => {
              const selected = activeTopic === item.slug;
              return (
                <Link
                  key={item.slug}
                  href={`/resources/the-closing-perspective?topic=${item.slug}`}
                  className={`inline-flex min-h-11 items-center px-4 text-sm font-semibold ${selected ? "bg-ink text-paper" : "border border-line hover:border-ink"}`}
                  aria-current={selected ? "true" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="latest-heading">
          <h2 id="latest-heading" className="display text-3xl">
            {activeTopic ? topicLabel(activeTopic) : "Latest insights"}
          </h2>
          {visible.length ? (
            <div className="mt-8 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => (
                <ArticleCard key={item.slug} post={item} draft={!isLivePost(item)} />
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-xl leading-relaxed text-ink-soft">
              No notes are published in this topic yet.
            </p>
          )}
          {shown < grid.length ? (
            <button
              type="button"
              className="mt-10 inline-flex min-h-12 items-center border border-ink px-6 text-sm font-semibold"
              onClick={() => setShown((count) => count + 6)}
            >
              Load more
            </button>
          ) : null}
        </section>

        {questionLinks.length ? (
          <section className="mt-20" aria-labelledby="questions-heading">
            <h2 id="questions-heading" className="display text-3xl">
              Popular questions
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {questionLinks.map((item) => (
                <li key={item.question}>
                  <Link href={postHref(item.slug)} className="flex items-center justify-between gap-6 py-5 hover:text-brass-deep">
                    <span className="text-xl font-semibold">{item.question}</span>
                    <span className="text-sm font-semibold">Read</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-20" aria-labelledby="professionals-heading">
          <h2 id="professionals-heading" className="display text-3xl">
            Professional resources
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
            Notes for the people who coordinate a file: communication, settlement, title research, and the items that keep a signing on schedule.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {audiences.map((item) => (
              <Link key={item.label} href={postHref(item.slug)} className="border border-line p-6 transition hover:border-ink">
                <p className="eyebrow text-brass">{item.label}</p>
                <p className="mt-4 text-lg leading-relaxed">{item.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <ClosingCta />
    </>
  );
}

function ArticleCard({ post, draft }: { post: PerspectivePost; draft?: boolean }) {
  return (
    <article>
      <Link href={postHref(post.slug)} className="group photo-shadow block overflow-hidden">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.imageAlt || ""}
            className="aspect-[3/2] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : null}
      </Link>
      <p className="mt-5 text-sm font-semibold text-brass">
        {topicLabel(post.category)}
        {draft ? " · Draft" : ""}
      </p>
      <h3 className="display mt-2 text-2xl">
        <Link href={postHref(post.slug)} className="hover:text-brass-deep">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 leading-relaxed text-ink-soft">{post.summary}</p>
      <p className="mt-3 text-sm text-ink-soft">
        {formatPostDate(post.date)}
        <span aria-hidden="true"> · </span>
        {readingMinutes(post)} min read
      </p>
    </article>
  );
}

function Article({
  post,
  journal,
  draft,
}: {
  post: PerspectivePost;
  journal: string;
  draft: boolean;
}) {
  const minutes = readingMinutes(post);
  const pages = usePages();
  const related = pages.perspective.items
    .filter((item) => isLivePost(item) && item.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);
  const showContents = post.sections.filter((section) => section.heading).length >= 3;
  const url = `${site.url}${postHref(post.slug)}`;
  const description = post.seoDescription || post.summary;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description,
          datePublished: post.date,
          dateModified: post.updated || post.date,
          author: { "@type": "Organization", name: post.author || site.legalName },
          publisher: { "@type": "Organization", name: site.legalName, url: site.url },
          image: post.image ? new URL(post.image, site.url).toString() : undefined,
          mainEntityOfPage: url,
          articleSection: topicLabel(post.category),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "Resources", item: `${site.url}/resources` },
            { "@type": "ListItem", position: 3, name: journal, item: `${site.url}/resources/the-closing-perspective` },
            { "@type": "ListItem", position: 4, name: post.title, item: url },
          ],
        }}
      />
      <article className="mx-auto max-w-3xl px-6 py-14 md:px-8 md:py-20">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: journal, path: "/resources/the-closing-perspective" },
            { name: post.title, path: postHref(post.slug) },
          ]}
        />
        {draft ? (
          <p className="mt-8 border border-line px-4 py-3 text-sm font-semibold">Draft. This note is not on the public journal.</p>
        ) : null}
        <p className="mt-8 text-sm font-semibold text-brass">
          <Link href={`/resources/the-closing-perspective?topic=${post.category}`} className="hover:text-brass-deep">
            {topicLabel(post.category)}
          </Link>
        </p>
        <h1 className="display mt-3 text-4xl md:text-5xl">{post.title}</h1>
        <p className="mt-5 text-sm text-ink-soft">
          {post.author || site.legalName}
          {post.date ? ` · ${formatPostDate(post.date)}` : ""}
          {post.updated ? ` · Updated ${formatPostDate(post.updated)}` : ""}
          <span aria-hidden="true"> · </span>
          {minutes} min read
        </p>
        {post.answer ? (
          <aside className="mt-8 border-l-4 border-brass bg-white px-6 py-5">
            <p className="eyebrow text-brass">Quick answer</p>
            <p className="mt-3 text-lg leading-relaxed">{post.answer}</p>
          </aside>
        ) : null}
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.imageAlt || ""}
            className="photo-shadow mt-10 aspect-[16/9] w-full object-cover"
          />
        ) : null}
        <div className="mt-10">
          <Disclaimer />
        </div>
        {showContents ? (
          <nav className="mt-10 border border-line p-6" aria-label="On this page">
            <p className="text-sm font-semibold">On this page</p>
            <ol className="mt-4 grid gap-2">
              {post.sections.map((section) =>
                section.heading ? (
                  <li key={section.heading}>
                    <a href={`#${headingId(section.heading)}`} className="text-ink-soft underline-offset-4 hover:text-ink hover:underline">
                      {section.heading}
                    </a>
                  </li>
                ) : null,
              )}
            </ol>
          </nav>
        ) : null}
        <div className="mt-12 space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading || section.paragraphs[0]} id={section.heading ? headingId(section.heading) : undefined}>
              {section.heading ? <h2 className="display text-3xl">{section.heading}</h2> : null}
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink-soft">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.items?.length ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-ink-soft">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.note ? <p className="mt-5 border border-line bg-white px-5 py-4 leading-relaxed">{section.note}</p> : null}
            </section>
          ))}
        </div>
        {post.faqs.length ? (
          <section className="mt-14" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="display text-3xl">
              Questions
            </h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {post.faqs.map((faq) => (
                <details key={faq.question} className="py-4">
                  <summary className="cursor-pointer text-lg font-semibold">{faq.question}</summary>
                  <p className="mt-3 leading-relaxed text-ink-soft">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
        <p className="mt-12 leading-relaxed text-ink-soft">
          For a file in progress, <Link href="/contact" className="font-semibold text-ink underline">contact the office</Link>.
          The service area is listed on the <Link href="/coverage" className="font-semibold text-ink underline">locations page</Link>.
        </p>
        <aside className="mt-14 border border-line p-6" aria-labelledby="company-heading">
          <h2 id="company-heading" className="display text-2xl">
            {pages.about.family.journalHeading}
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">{pages.about.family.journalText}</p>
          <Link href={familyPath} className="mt-5 inline-flex font-semibold text-ink underline underline-offset-4">
            {pages.about.family.journalLink}
          </Link>
        </aside>
        {related.length ? (
          <section className="mt-14" aria-labelledby="related-heading">
            <h2 id="related-heading" className="display text-3xl">
              Related notes
            </h2>
            <div className="mt-6 grid gap-6">
              {related.map((item) => (
                <Link key={item.slug} href={postHref(item.slug)} className="border border-line p-5 hover:border-ink">
                  <p className="text-sm font-semibold text-brass">{topicLabel(item.category)}</p>
                  <p className="mt-2 text-xl font-semibold">{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
      <ClosingCta />
    </>
  );
}

function ClosingCta() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-20">
        <h2 className="display max-w-3xl text-4xl md:text-5xl">A Better Closing Experience Starts With the Right Team.</h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/80">
          From title research to settlement and post-closing support, Integrity Title Group is committed to providing accurate, secure, and responsive service throughout your real estate transaction.
        </p>
        <Link href="/contact" className="header-action mt-8 inline-flex min-h-12 items-center px-6 text-sm font-semibold">
          Contact the office
        </Link>
      </div>
    </section>
  );
}
