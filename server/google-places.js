function mapsKey() {
  return String(process.env.GOOGLE_MAPS_API_KEY || "").trim();
}

function fail(status, publicMessage) {
  const error = new Error(publicMessage);
  error.status = status;
  error.publicMessage = publicMessage;
  return error;
}

function requireKey() {
  if (!mapsKey()) {
    throw fail(503, "Google Maps address search is not configured on this server.");
  }
}

function component(list, type, form) {
  const hit = (list || []).find((item) => Array.isArray(item.types) && item.types.includes(type));
  if (!hit) return "";
  return String(hit[form] || hit.longText || "").trim();
}

function addressFromComponents(place) {
  const parts = place.addressComponents || [];
  const number = component(parts, "street_number");
  const route = component(parts, "route");
  let street = [number, route].filter(Boolean).join(" ");
  const subpremise = component(parts, "subpremise");
  if (subpremise) {
    const suite = /^(ste|suite|unit|#)\b/i.test(subpremise) ? subpremise : `Ste ${subpremise}`;
    street = street ? `${street}, ${suite}` : suite;
  }
  const city =
    component(parts, "locality") ||
    component(parts, "postal_town") ||
    component(parts, "sublocality_level_1") ||
    component(parts, "neighborhood");
  const region = component(parts, "administrative_area_level_1", "shortText");
  const postalCode = component(parts, "postal_code");
  const lat = place.location && place.location.latitude;
  const lon = place.location && place.location.longitude;
  if (!street || !city || !region || !postalCode || lat == null || lon == null) {
    throw fail(400, "Choose a complete street address Google Maps recognizes.");
  }
  return {
    street,
    city,
    region,
    postalCode,
    lat: String(lat),
    lon: String(lon),
    placeId: String(place.id || ""),
  };
}

async function suggestPlaces(input) {
  requireKey();
  const query = String(input || "").replace(/\s+/g, " ").trim();
  if (query.length < 3) return [];
  const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": mapsKey(),
    },
    body: JSON.stringify({
      input: query.slice(0, 120),
      includedRegionCodes: ["us"],
      includedPrimaryTypes: ["street_address", "premise", "subpremise"],
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw fail(502, "Google Maps could not search addresses.");
  }
  const body = await response.json();
  return (body.suggestions || [])
    .map((item) => item.placePrediction)
    .filter((item) => item && item.placeId && item.text && item.text.text)
    .slice(0, 6)
    .map((item) => ({ placeId: item.placeId, label: item.text.text }));
}

async function addressFromPlace(placeId) {
  requireKey();
  const id = String(placeId || "").trim();
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    throw fail(400, "Choose an address Google Maps recognizes.");
  }
  const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}`, {
    headers: {
      "X-Goog-Api-Key": mapsKey(),
      "X-Goog-FieldMask": "id,location,addressComponents",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw fail(400, "Choose an address Google Maps recognizes.");
  }
  const place = await response.json();
  const address = addressFromComponents(place);
  if (!address.placeId) address.placeId = id;
  return address;
}

module.exports = { addressFromPlace, suggestPlaces };
