import type { MetadataRoute } from "next";

const BASE_URL = "https://www.almostdebtfree.com";

export const dynamic = "static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/settings", "/debts", "/calendar", "/auth", "/p/", "/t/", "/authors"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
