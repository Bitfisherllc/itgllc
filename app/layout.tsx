import { config } from "@fortawesome/fontawesome-svg-core";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/Footer";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;
import { AdminNavProvider } from "@/components/AdminNav";
import { Header } from "@/components/Header";
import { OrganizationJsonLd } from "@/components/JsonLd";
import { QualiaQuote } from "@/components/QualiaQuote";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} | Title & Settlement Services`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.legalName,
    title: `${site.legalName} | Title & Settlement Services`,
    description: site.description,
    url: site.url,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <QualiaQuote token={site.qualiaQuoteToken} />
        <AdminNavProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-paper focus:px-4 focus:py-3"
        >
          Skip to content
        </a>
        <OrganizationJsonLd />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        </AdminNavProvider>
      </body>
    </html>
  );
}
