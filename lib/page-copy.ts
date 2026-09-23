import { pageCopy as raw, pageIds as rawIds } from "@/lib/page-copy.cjs";

export type ServiceCopy = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
};

export type ResourceSectionCopy = {
  heading: string;
  paragraphs: string[];
};

export type GlossaryEntry = {
  term: string;
  definition: string;
};

export type ResourceCopy = {
  slug: string;
  title: string;
  summary: string;
  disclaimer: boolean;
  sections: ResourceSectionCopy[];
  entries?: GlossaryEntry[];
};

export type ArticleSectionCopy = {
  heading: string;
  paragraphs: string[];
  items?: string[];
};

export type ArticleCopy = {
  slug: string;
  title: string;
  summary: string;
  sections: ArticleSectionCopy[];
};

export type PageCopy = {
  about: {
    eyebrow: string;
    title: string;
    lede: string;
    imageAlt: string;
    image: string;
    paragraphs: string[];
    teamsHeading: string;
    teams: { title: string; text: string }[];
    buttonLabel: string;
  };
  team: {
    eyebrow: string;
    title: string;
    lede: string;
    people: { name: string; role: string; excerpt: string; image: string }[];
  };
  services: {
    eyebrow: string;
    title: string;
    lede: string;
    items: ServiceCopy[];
  };
  coverage: {
    eyebrow: string;
    title: string;
    lede: string;
    mapAlt: string;
    licensedLabel: string;
    unlicensedLabel: string;
    statesHeading: string;
    states: string[];
    note: string;
    buttonLabel: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    lede: string;
    formHeading: string;
    formIntro: string;
    departments: { label: string; detail: string }[];
  };
  resources: {
    eyebrow: string;
    title: string;
    lede: string;
    articlesHeading: string;
    articlesLede: string;
    items: ResourceCopy[];
    faqs: { question: string; answer: string }[];
  };
  articles: {
    eyebrow: string;
    title: string;
    lede: string;
    items: ArticleCopy[];
  };
  order: {
    eyebrow: string;
    title: string;
    lede: string;
    beforeHeading: string;
    notes: string[];
    quoteLabel: string;
    quoteNote: string;
    platformLabel: string;
    platformNote: string;
    formHeading: string;
    formIntro: string;
  };
  privacy: {
    eyebrow: string;
    title: string;
    lede: string;
    paragraphs: string[];
  };
  terms: {
    eyebrow: string;
    title: string;
    lede: string;
    paragraphs: string[];
  };
  other: {
    footer: string;
    footerLogo: string;
  };
  office: {
    phone: string;
    fax: string;
    street: string;
    city: string;
    region: string;
    postalCode: string;
    emailGeneral: string;
    emailOrders: string;
    emailPostClosing: string;
    emailPreCd: string;
    emailProcessing: string;
    emailEvents: string;
    lat: string;
    lon: string;
    placeId: string;
  };
};

export const pageCopy = raw as PageCopy;
export const pageIds = rawIds as (keyof PageCopy)[];

export const pageLabels: Record<keyof PageCopy, string> = {
  about: "About",
  team: "Our team",
  services: "Services",
  coverage: "Service Locations",
  contact: "Contact",
  resources: "Resources",
  articles: "Articles",
  order: "Start an order",
  privacy: "Privacy",
  terms: "Terms",
  other: "Other",
  office: "Contact details",
};
