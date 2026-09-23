"use client";

import { useEffect, useState } from "react";
import { formatOfficeAddress } from "@/lib/office";
import type { PageCopy } from "@/lib/page-copy";

type Office = PageCopy["office"];
type Suggestion = { placeId: string; label: string };

const fieldClass =
  "mt-2 w-full border border-line bg-white px-3 py-3 text-base text-ink outline-none focus-visible:border-brass";

export function OfficeAddressField({
  office,
  onSelect,
}: {
  office: Office;
  onSelect: (address: Pick<Office, "street" | "city" | "region" | "postalCode" | "lat" | "lon" | "placeId">) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const text = query.trim();
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      fetch(`/api/admin/places?q=${encodeURIComponent(text)}`)
        .then(async (response) => {
          const body = (await response.json()) as { ok?: boolean; suggestions?: Suggestion[]; error?: string };
          if (!response.ok || !body.ok) throw new Error(body.error || "Address search failed.");
          return body.suggestions || [];
        })
        .then((next) => {
          if (!cancelled) {
            setSuggestions(next);
            setError(next.length ? "" : "No matching addresses.");
          }
        })
        .catch((reason: Error) => {
          if (!cancelled) {
            setSuggestions([]);
            setError(reason.message || "Address search failed.");
          }
        });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  async function choose(placeId: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/place?id=${encodeURIComponent(placeId)}`);
      const body = (await response.json()) as { ok?: boolean; address?: Office; error?: string };
      if (!response.ok || !body.ok || !body.address) {
        setError(body.error || "Choose an address Google Maps recognizes.");
        return;
      }
      onSelect(body.address);
      setQuery("");
      setSuggestions([]);
    } catch {
      setError("Choose an address Google Maps recognizes.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold">Office address</p>
      <p className="mt-2 leading-relaxed text-ink-soft">{formatOfficeAddress(office)}</p>
      <label htmlFor="office-address-search" className="mt-4 block text-sm font-semibold">
        Search for a new address
      </label>
      <input
        id="office-address-search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setError("");
        }}
        autoComplete="off"
        className={fieldClass}
        placeholder="Start typing a street address"
      />
      <p className="mt-2 text-sm text-ink-soft">
        Choose an address from the list. Only addresses Google Maps recognizes can be saved, and that choice updates the map and Get Directions.
      </p>
      {error ? <p className="mt-2 text-sm">{error}</p> : null}
      {suggestions.length ? (
        <ul className="mt-3 divide-y divide-line border border-line">
          {suggestions.map((item) => (
            <li key={item.placeId}>
              <button
                type="button"
                disabled={busy}
                onClick={() => choose(item.placeId)}
                className="w-full px-3 py-3 text-left text-sm hover:bg-paper-deep disabled:opacity-60"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
