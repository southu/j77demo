import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const DEMO_ASSETS = path.join(process.cwd(), "demo-assets");

export type ContentType = "blog" | "resources";

export type ContentItem = {
  slug: string;
  type: ContentType;
  title: string;
  date: string;
  description: string;
  author?: string;
  tags: string[];
  related?: string[];
  canonicalTopic?: string;
  body: string;
  readingTime: number; // minutes
};

function parseDate(value: unknown): string {
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  }
  return new Date().toISOString().slice(0, 10);
}

function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x) => typeof x === "string");
  if (typeof value === "string") return [value];
  return [];
}

function loadDir(tenant: string, type: ContentType): ContentItem[] {
  const dir = path.join(DEMO_ASSETS, tenant, type);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const items: ContentItem[] = [];
  for (const file of files) {
    const slug = path.basename(file, ".md");
    const fullPath = path.join(dir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    const rt = readingTime(content);
    const tags = ensureStringArray(data.tags);
    items.push({
      slug,
      type,
      title: (data.title as string) || slug,
      date: parseDate(data.date ?? data.generated),
      description: (data.description as string) || (data.metaDescription as string) || "",
      author: data.author as string | undefined,
      tags,
      related: Array.isArray(data.related) ? data.related.filter((x): x is string => typeof x === "string") : undefined,
      canonicalTopic: data.canonicalTopic as string | undefined,
      body: content,
      readingTime: Math.max(1, Math.ceil(rt.minutes)),
    });
  }
  return items.sort((a, b) => (b.date < a.date ? -1 : 1));
}

/** Load all blog and resources for a tenant. */
export function loadAllContent(tenant: string): { blog: ContentItem[]; resources: ContentItem[] } {
  return {
    blog: loadDir(tenant, "blog"),
    resources: loadDir(tenant, "resources"),
  };
}

/** Load a single item by slug. */
export function loadContentBySlug(
  tenant: string,
  type: ContentType,
  slug: string
): ContentItem | null {
  const filePath = path.join(DEMO_ASSETS, tenant, type, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  const tags = ensureStringArray(data.tags);
  return {
    slug,
    type,
    title: (data.title as string) || slug,
    date: parseDate(data.date ?? data.generated),
    description: (data.description as string) || (data.metaDescription as string) || "",
    author: data.author as string | undefined,
    tags,
    related: Array.isArray(data.related) ? data.related.filter((x): x is string => typeof x === "string") : undefined,
    canonicalTopic: data.canonicalTopic as string | undefined,
    body: content,
    readingTime: Math.max(1, Math.ceil(rt.minutes)),
  };
}

/** Get all slugs for a type (for generateStaticParams). */
export function getAllSlugs(tenant: string, type: ContentType): string[] {
  const dir = path.join(DEMO_ASSETS, tenant, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.basename(f, ".md"));
}

/** Get prev/next by date order within same type. */
export function getAdjacentByDate(
  tenant: string,
  type: ContentType,
  slug: string
): { prev: ContentItem | null; next: ContentItem | null } {
  const { blog, resources } = loadAllContent(tenant);
  const list = type === "blog" ? blog : resources;
  const idx = list.findIndex((i) => i.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? list[idx - 1]! : null,
    next: idx < list.length - 1 ? list[idx + 1]! : null,
  };
}

/** Get all unique tags for a tenant. */
export function getAllTags(tenant: string): string[] {
  const { blog, resources } = loadAllContent(tenant);
  const set = new Set<string>();
  for (const item of [...blog, ...resources]) item.tags.forEach((t) => set.add(t));
  return Array.from(set).sort();
}
