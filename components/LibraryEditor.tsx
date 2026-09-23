"use client";

import { useEffect, useState, type ChangeEvent } from "react";

type LibraryImage = { id: string; src: string };

export function LibraryEditor() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/library")
      .then((response) => response.json())
      .then((body: { images?: LibraryImage[] }) => {
        if (!cancelled && body.images) setImages(body.images);
      })
      .catch(() => {
        if (!cancelled) setError("The library could not be loaded.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    if (!files.length) return;
    setBusy(true);
    setError("");
    setStatus("");
    let added = 0;
    const problems: string[] = [];
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      setStatus(`Uploading ${index + 1} of ${files.length}`);
      const response = await fetch("/api/admin/library/upload", {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      const body = (await response.json()) as { ok?: boolean; library?: LibraryImage[]; error?: string };
      if (!response.ok || !body.ok || !body.library) {
        problems.push(file.name);
        continue;
      }
      added += 1;
      setImages(body.library);
    }
    setBusy(false);
    setStatus(
      added === 0 ? "" : added === 1 ? "1 image added to the library." : `${added} images added to the library.`,
    );
    if (problems.length) {
      setError(
        problems.length === 1
          ? `${problems[0]} could not be added. Use a JPEG, PNG, or WebP under 5 MB.`
          : `${problems.length} files could not be added. Use JPEG, PNG, or WebP images under 5 MB.`,
      );
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this image from the library?")) return;
    setBusy(true);
    setError("");
    setStatus("");
    const response = await fetch("/api/admin/library/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const body = (await response.json()) as { ok?: boolean; library?: LibraryImage[]; error?: string };
    setBusy(false);
    if (!response.ok || !body.ok || !body.library) {
      setError(body.error || "That image could not be deleted.");
      return;
    }
    setImages(body.library);
    setStatus("Deleted from the library.");
  }

  return (
    <section className="mt-10 border border-line bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">
          {images.length} {images.length === 1 ? "image" : "images"}. Choose them on the homepage editor.
        </p>
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center bg-ink px-5 text-sm font-semibold text-paper">
          {busy ? "Working" : "Upload images"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={busy}
            onChange={onFiles}
          />
        </label>
      </div>
      {error ? (
        <p role="alert" className="mt-4 border border-brass bg-paper-deep px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}
      {status ? <p className="mt-4 text-sm font-semibold">{status}</p> : null}
      {images.length ? (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image, index) => (
            <li key={image.id} className="border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt="" className="h-auto w-full" />
              <button
                type="button"
                disabled={busy}
                className="min-h-11 w-full text-sm font-semibold disabled:opacity-60"
                onClick={() => remove(image.id)}
              >
                Delete image {index + 1}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-ink-soft">No library images yet.</p>
      )}
    </section>
  );
}
