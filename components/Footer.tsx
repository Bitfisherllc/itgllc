import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { QuoteLink } from "@/components/QuoteLink";
import { resources } from "@/lib/resources";
import { services } from "@/lib/services";
import { faEnvelope, faFax, faLocationDot, faPhone } from "@/lib/icons";
import { departments, formatAddress, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:px-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo tone="paper" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/75">
            {site.legalName} provides title and settlement services for purchase
            and refinance transactions.
          </p>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow text-brass">Navigate</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Services", "/services"],
              ["Where we work", "/coverage"],
              ["Resources", "/resources"],
              ["Contact", "/contact"],
              ["Start an order", "/order"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-paper/80 hover:text-paper">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <QuoteLink className="text-paper/80 hover:text-paper">Get a quote</QuoteLink>
            </li>
            <li>
              <a
                href={site.qualiaConnectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper/80 hover:text-paper"
              >
                Closing platform
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-brass">Services</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-paper/80 hover:text-paper"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-brass">Contact</h2>
          <address className="mt-4 space-y-3 text-sm not-italic leading-relaxed text-paper/80">
            <p className="flex items-start gap-2">
              <Icon icon={faLocationDot} className="mt-0.5 text-sm text-brass" />
              <span>{formatAddress()}</span>
            </p>
            <p>
              <a href={site.phoneHref} className="inline-flex items-center gap-2 hover:text-paper">
                <Icon icon={faPhone} className="text-sm text-brass" />
                {site.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Icon icon={faFax} className="text-sm text-brass" />
              Fax {site.fax}
            </p>
            <p>
              <a href={`mailto:${departments.general.email}`} className="inline-flex items-center gap-2 hover:text-paper">
                <Icon icon={faEnvelope} className="text-sm text-brass" />
                {departments.general.email}
              </a>
            </p>
          </address>
          <h2 className="eyebrow mt-8 text-brass">Resources</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {resources.slice(0, 4).map((resource) => (
              <li key={resource.slug}>
                <Link
                  href={`/resources/${resource.slug}`}
                  className="text-paper/80 hover:text-paper"
                >
                  {resource.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs tracking-wide text-paper/60 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="flex gap-5">
            <Link href="/privacy" className="hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-paper">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
