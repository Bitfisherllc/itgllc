import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/resources/what-is-title-insurance",
        destination: "/resources/the-closing-perspective/what-is-title-insurance",
        permanent: true,
      },
      {
        source: "/resources/what-to-expect-at-closing",
        destination: "/resources/the-closing-perspective/what-happens-on-closing-day",
        permanent: true,
      },
      {
        source: "/resources/buyers",
        destination: "/resources/the-closing-perspective?topic=homebuyers",
        permanent: true,
      },
      {
        source: "/resources/sellers",
        destination: "/resources/the-closing-perspective?topic=home-sellers",
        permanent: true,
      },
      {
        source: "/resources/real-estate-agents",
        destination: "/resources/the-closing-perspective?topic=real-estate-professionals",
        permanent: true,
      },
      {
        source: "/resources/lenders",
        destination: "/resources/the-closing-perspective?topic=real-estate-professionals",
        permanent: true,
      },
      {
        source: "/articles",
        destination: "/resources/the-closing-perspective",
        permanent: true,
      },
      {
        source: "/articles/:slug",
        destination: "/resources/the-closing-perspective",
        permanent: true,
      },
      {
        source: "/about/from-our-family-to-yours",
        destination: "/about/dan-heart",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
