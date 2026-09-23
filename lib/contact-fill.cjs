const { pageCopy } = require("./page-copy.cjs");

function formatOfficeAddress(office) {
  return `${office.street}, ${office.city}, ${office.region} ${office.postalCode}`;
}

function googleDirectionsUrl(office) {
  const url = new URL("https://www.google.com/maps/dir/");
  url.searchParams.set("api", "1");
  url.searchParams.set("destination", formatOfficeAddress(office));
  if (office.placeId) url.searchParams.set("destination_place_id", office.placeId);
  return url.toString();
}

function googleMapEmbedUrl(office) {
  const url = new URL("https://maps.google.com/maps");
  url.searchParams.set("q", formatOfficeAddress(office));
  url.searchParams.set("z", "16");
  url.searchParams.set("output", "embed");
  return url.toString();
}

function telHref(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  const normalized = digits.length === 10 ? `1${digits}` : digits;
  return `tel:+${normalized}`;
}

function fillContact(text, office) {
  const base = pageCopy.office;
  if (!office || typeof text !== "string" || !base) return text;
  const pairs = [
    ["{phone}", office.phone],
    ["{fax}", office.fax],
    ["{address}", formatOfficeAddress(office)],
    ["{email}", office.emailGeneral],
    ["{email.orders}", office.emailOrders],
    ["{email.postclosing}", office.emailPostClosing],
    ["{email.precd}", office.emailPreCd],
    ["{email.processing}", office.emailProcessing],
    ["{email.events}", office.emailEvents],
    [base.phone, office.phone],
    [base.fax, office.fax],
    [formatOfficeAddress(base), formatOfficeAddress(office)],
    [base.emailGeneral, office.emailGeneral],
    [base.emailOrders, office.emailOrders],
    [base.emailPostClosing, office.emailPostClosing],
    [base.emailPreCd, office.emailPreCd],
    [base.emailProcessing, office.emailProcessing],
    [base.emailEvents, office.emailEvents],
  ];
  const replacements = pairs
    .filter(([from, to]) => from && from !== to)
    .sort((a, b) => b[0].length - a[0].length);
  let next = text;
  for (const [from, to] of replacements) next = next.split(from).join(to);
  return next;
}

function fillTree(value, office, key) {
  if (key === "office") return value;
  if (typeof value === "string") return fillContact(value, office);
  if (Array.isArray(value)) return value.map((item) => fillTree(item, office));
  if (value && typeof value === "object") {
    const out = {};
    for (const child of Object.keys(value)) out[child] = fillTree(value[child], office, child);
    return out;
  }
  return value;
}

function presentPages(pages) {
  if (!pages || !pages.office) return pages;
  const next = fillTree(pages, pages.office);
  next.office = pages.office;
  return next;
}

module.exports = {
  googleDirectionsUrl,
  googleMapEmbedUrl,
  fillContact,
  fillTree,
  formatOfficeAddress,
  presentPages,
  telHref,
};
