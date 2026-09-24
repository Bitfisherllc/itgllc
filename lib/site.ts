/**
 * Site-wide business information.
 *
 * INTERNAL — confirmed from the prior public website and rewritten for ITG.
 * Do not publish the prior brand name.
 *
 * Confirmed and used:
 * - Nottingham, Maryland office, phone, fax, and department emails
 * - Title and settlement services for purchases and refinances
 * - Teams: client care, title processing, post-closing / funding
 * - Qualia as the secure portal for lenders, agents, and clients
 * - Public Qualia quote-widget token from the existing site
 * - Service area: MD, PA, VA, DE, IN, OH, KY, NC, SC, FL, NJ
 * - Partner-network help outside that area is possible, not guaranteed
 * - More than 30 years of combined title experience (not a company age)
 * - Purchase orders should include the sale agreement
 * - Quotes by phone and through the quote tool; pre-closing disclosures
 *   when someone is comparing closing fees
 *
 * Not confirmed — do not publish:
 * - Years in business, volume, headcount, awards, testimonials, hours
 * - License numbers or title-insurance underwriter relationships
 * - Commercial, builder, or investor programs
 * - A new email domain (mailboxes remain on the existing domain)
 * - Social profiles suitable for the ITG name
 */

function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return "http://localhost:3000";
  try {
    return new URL(value).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const site = {
  name: "ITG",
  legalName: "Integrity Title Group",
  description:
    "Integrity Title Group provides professional title and settlement services for purchase and refinance transactions, from the opened order through funding and recording.",
  url: siteUrl(),
  email: "info@ravents.com",
  phone: "443.725.7020",
  phoneHref: "tel:+14437257020",
  fax: "877.416.4296",
  faxHref: "tel:+18774164296",
  address: {
    street: "8098 Sandpiper Circle, Ste X",
    city: "Nottingham",
    region: "MD",
    postalCode: "21236",
    country: "US",
  },
  qualiaQuoteToken: "65N3CmvbFDJRPCpBF",
  qualiaConnectUrl: "https://connect.qualia.io/signin",
} as const;

export const departments = {
  orders: {
    label: "New orders",
    email: "orders@ravents.com",
    detail:
      "Purchase and refinance orders. Include the sale agreement on a purchase so the file can be opened without avoidable delay.",
  },
  postClosing: {
    label: "Post-closing",
    email: "postclosing@ravents.com",
    detail: "Funding, recording, and document audits after signing.",
  },
  preCd: {
    label: "Pre-closing disclosures",
    email: "precd@ravents.com",
    detail:
      "Request a pre-closing disclosure when you are comparing closing fees.",
  },
  processing: {
    label: "Processing",
    email: "processors@ravents.com",
    detail:
      "Questions on an open file after a processor has been assigned.",
  },
  sales: {
    label: "Events and introductions",
    email: "sales@ravents.com",
    detail: "Invitations and introductions for real estate events.",
  },
  general: {
    label: "General",
    email: "info@ravents.com",
    detail: "Company information and questions that do not belong to a file.",
  },
} as const;

export const coverageStates = [
  "Maryland",
  "Pennsylvania",
  "Virginia",
  "Delaware",
  "Indiana",
  "Ohio",
  "Kentucky",
  "North Carolina",
  "South Carolina",
  "Florida",
  "New Jersey",
] as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export function formatAddress() {
  const { street, city, region, postalCode } = site.address;
  return `${street}, ${city}, ${region} ${postalCode}`;
}
