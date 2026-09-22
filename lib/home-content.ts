import { homeContent as defaults } from "@/lib/home-content.cjs";

export type HomeText = {
  title: string;
  text: string;
};

export type HomeAudience = {
  id: string;
  label: string;
  text: string;
};

export type HomeStep = {
  n: string;
  title: string;
  text: string;
};

export type HomeContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroLede: string;
  pillars: HomeText[];
  servicesEyebrow: string;
  servicesHeading: string;
  servicesLede: string;
  audienceEyebrow: string;
  audienceHeading: string;
  audiences: HomeAudience[];
  processEyebrow: string;
  processHeading: string;
  steps: HomeStep[];
  aboutEyebrow: string;
  aboutHeading: string;
  aboutLead: string;
  aboutBody: string;
  whyEyebrow: string;
  whyHeading: string;
  reasons: HomeText[];
  coverageEyebrow: string;
  coverageHeading: string;
  coverageText: string;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaText: string;
};

export const defaultHomeContent = defaults as HomeContent;
