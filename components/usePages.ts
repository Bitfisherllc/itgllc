"use client";

import { useEffect, useState } from "react";
import { type PageCopy } from "@/lib/page-copy";
import { mergePages } from "@/lib/page-copy.cjs";
import { presentPages } from "@/lib/office";
import savedPages from "@/data/pages.json";

let current: PageCopy = presentPages(mergePages(savedPages) as PageCopy);
const listeners = new Set<() => void>();
let inflight: Promise<void> | null = null;

function publish(next: PageCopy) {
  current = presentPages(next);
  listeners.forEach((listener) => listener());
}

export function refreshPages() {
  if (inflight) return inflight;
  inflight = fetch("/api/pages")
    .then((response) => response.json())
    .then((body: { pages?: PageCopy }) => {
      if (body.pages) publish(body.pages);
    })
    .catch(() => undefined)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function usePages() {
  const [pages, setPages] = useState(current);

  useEffect(() => {
    const onChange = () => setPages(current);
    listeners.add(onChange);
    refreshPages();
    window.addEventListener("focus", refreshPages);
    return () => {
      listeners.delete(onChange);
      window.removeEventListener("focus", refreshPages);
    };
  }, []);

  return pages;
}
