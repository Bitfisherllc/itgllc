"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Icon } from "@/components/Icon";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { usePages } from "@/components/usePages";
import { faFax, faLocationDot, faPhone, pageIcons } from "@/lib/icons";
import { formatOfficeAddress, telHref } from "@/lib/office";
import { site } from "@/lib/site";

export function ContactView() {
  const { contact, office } = usePages();

  return (
    <>
      <PageHero eyebrow={contact.eyebrow} title={contact.title} lede={contact.lede} icon={pageIcons.contact} />
      <div className="mx-auto grid max-w-6xl gap-16 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]}
          />
          <address className="not-italic">
            <p className="font-serif text-3xl">{site.legalName}</p>
            <p className="mt-4 flex items-start gap-3 leading-relaxed text-ink-soft">
              <Icon icon={faLocationDot} className="mt-1 text-brass" />
              <span>{formatOfficeAddress(office)}</span>
            </p>
            <p className="mt-4">
              <a href={telHref(office.phone)} className="inline-flex items-center gap-3 text-lg font-semibold">
                <Icon icon={faPhone} className="text-brass" />
                {office.phone}
              </a>
            </p>
            <p className="mt-2 flex items-center gap-3 text-ink-soft">
              <Icon icon={faFax} className="text-brass" />
              Fax {office.fax}
            </p>
          </address>
        </div>
        <div className="lg:col-span-7">
          <h2 className="font-serif text-3xl">{contact.formHeading}</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{contact.formIntro}</p>
          <div className="mt-8">
            <InquiryForm intent="contact" />
          </div>
        </div>
      </div>
    </>
  );
}
