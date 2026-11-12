import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// While the pitch is unapproved (site.flags.noindex) nothing may be crawled.
export default function robots(): MetadataRoute.Robots {
  return site.flags.noindex
    ? { rules: [{ userAgent: "*", disallow: "/" }] }
    : { rules: [{ userAgent: "*", allow: "/" }], host: site.url };
}
