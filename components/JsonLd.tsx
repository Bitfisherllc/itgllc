"use client";

import { usePages } from "@/components/usePages";
import { coverageStates, site } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const { office } = usePages();
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    alternateName: site.name,
    description: site.description,
    url: site.url,
    telephone: office.phone,
    faxNumber: office.fax,
    email: office.emailGeneral,
    image: `${site.url}/images/baltimore-harbor.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.street,
      addressLocality: office.city,
      addressRegion: office.region,
      postalCode: office.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: coverageStates.map((name) => ({
      "@type": "State",
      name,
    })),
    knowsAbout: [
      "Title services",
      "Settlement services",
      "Purchase closings",
      "Refinance closings",
    ],
  };
  return <JsonLd data={data} />;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

