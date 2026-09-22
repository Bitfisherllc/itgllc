"use client";

import { useEffect, useState } from "react";

const SCRIPT_ID = "qualia-quote-widget-loader";
const SCRIPT_SRC = "https://connect.qualia.com/quote-widget/scripts/init";

function stageFrame() {
  return document.querySelector<HTMLIFrameElement>('iframe[name="stage"]');
}

function stageIsOpen() {
  const stage = stageFrame();
  if (!stage) return false;
  return getComputedStyle(stage).display !== "none";
}

function closeQuoteWindow() {
  const stage = stageFrame();
  stage?.contentWindow?.postMessage(
    {
      namespace: "__QualiaWindowMessenger__",
      type: "call",
      method: "hide",
      arguments: [],
    },
    "*",
  );

  window.setTimeout(() => {
    const frame = stageFrame();
    if (!frame || getComputedStyle(frame).display === "none") return;
    frame.style.display = "none";
    const activator = document.querySelector<HTMLIFrameElement>('iframe[name="activator"]');
    if (activator) activator.style.removeProperty("display");
  }, 400);
}

export function QualiaQuote({ token }: { token: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const host = window as Window & { __itgQualia?: boolean };
    if (host.__itgQualia || document.getElementById(SCRIPT_ID)) return;
    host.__itgQualia = true;

    const nativeAdd = window.addEventListener.bind(window);
    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      window.addEventListener = nativeAdd;
    };

    if (document.readyState === "complete") {
      window.addEventListener = function (
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
      ) {
        nativeAdd(type, listener, options);
        if (type === "load" && typeof listener === "function") {
          listener(new Event("load"));
        }
      } as typeof window.addEventListener;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.dataset.token = token;
    script.addEventListener("load", restore);
    script.addEventListener("error", restore);
    document.head.appendChild(script);

    const timer = window.setTimeout(restore, 15000);
    return () => window.clearTimeout(timer);
  }, [token]);

  useEffect(() => {
    let frameObserver: MutationObserver | null = null;

    const sync = () => setOpen(stageIsOpen());

    const watchStage = () => {
      const stage = stageFrame();
      if (!stage) {
        setOpen(false);
        return;
      }
      frameObserver?.disconnect();
      frameObserver = new MutationObserver(sync);
      frameObserver.observe(stage, { attributes: true, attributeFilter: ["style"] });
      sync();
    };

    const bodyObserver = new MutationObserver(watchStage);
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    watchStage();

    return () => {
      frameObserver?.disconnect();
      bodyObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeQuoteWindow();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <button
      type="button"
      onClick={closeQuoteWindow}
      className="fixed top-5 right-5 z-[10050] inline-flex min-h-11 items-center gap-2 bg-paper px-4 text-sm font-semibold text-ink shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
    >
      Close
      <span aria-hidden="true">×</span>
    </button>
  );
}
