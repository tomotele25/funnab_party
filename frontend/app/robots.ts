import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/organizer",
        "/customer",
        "/event/checkout",
        "/event/payment",
        "/api",
      ],
    },
    sitemap: "https://funaabparty.com/sitemap.xml",
  };
}
