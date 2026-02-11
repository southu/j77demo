import fs from "fs";
import path from "path";

const PUBLIC = path.join(process.cwd(), "public");
const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

/**
 * Get the public URL for a featured image for a blog/resource post if one exists.
 * Checks public/<tenant>/images/ for a file named <slug>.<ext>.
 */
export function getFeaturedImageUrl(tenant: string, slug: string): string | null {
  const imagesDir = path.join(PUBLIC, tenant, "images");
  if (!fs.existsSync(imagesDir)) return null;
  const files = fs.readdirSync(imagesDir);
  const base = `${slug}.`;
  const found = files.find((f) => f.startsWith(base) && EXTENSIONS.some((e) => f.endsWith(e)));
  if (!found) return null;
  return `/${encodeURIComponent(tenant)}/images/${found}`;
}
