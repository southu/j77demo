#!/usr/bin/env node
/**
 * Ingest content from J77Output: zips and/or loose .md + images.
 * Merge into demo-assets/<tenant>/ (blog|resources + images). Incremental: never delete existing.
 * Usage: npm run ingest -- --source J77Output/diagpartners  |  npm run ingest -- --zip path/to/file.zip --tenant diagpartners
 */
import fs from "fs";
import path from "path";
import { createReadStream } from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import matter from "gray-matter";
import { transformSourceLinks } from "../lib/source-links";

const streamPipeline = promisify(pipeline);
const DEMO_ASSETS = path.join(process.cwd(), "demo-assets");
const J77_OUTPUT = path.join(process.cwd(), "J77Output");
const PUBLIC_DIR = path.join(process.cwd(), "public");

type Kind = "blog" | "resource";

function parseDate(value: unknown): string {
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  }
  return new Date().toISOString().slice(0, 10);
}

function normalizeFrontmatter(data: Record<string, unknown>, slug: string, body: string): string {
  const title = (data.title as string) || slug;
  const description = (data.description as string) || (data.metaDescription as string) || "";
  const kind = ((data.kind as string) || "blog").toLowerCase();
  const type = kind === "resource" ? "resource" : "blog";
  const date = parseDate(data.date ?? data.generated);
  const tags = Array.isArray(data.tags) ? data.tags.filter((t): t is string => typeof t === "string") : [];
  const out: Record<string, unknown> = { title, slug, date, description, tags };
  if (data.author) out.author = data.author;
  if (data.canonicalTopic) out.canonicalTopic = data.canonicalTopic;
  if (data.related) out.related = data.related;
  // Transform raw source citations into proper markdown hyperlinks
  const cleanedBody = transformSourceLinks(body);
  return matter.stringify(cleanedBody, out);
}

async function unzipToDir(zipPath: string, outDir: string): Promise<void> {
  const AdmZip = await import("adm-zip").catch(() => null);
  if (!AdmZip) {
    console.warn("Install adm-zip for zip support: npm i adm-zip");
    return;
  }
  const zip = new (AdmZip.default)(zipPath);
  zip.extractAllTo(outDir, true);
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function processExtractedDir(
  extractedDir: string,
  tenant: string,
  slugToKind: Map<string, Kind>
) {
  const blogDir = path.join(DEMO_ASSETS, tenant, "blog");
  const resourcesDir = path.join(DEMO_ASSETS, tenant, "resources");
  const imagesOutDir = path.join(PUBLIC_DIR, tenant, "images");
  ensureDir(blogDir);
  ensureDir(resourcesDir);
  ensureDir(imagesOutDir);

  const markdownDir = path.join(extractedDir, "markdown");
  const markdownFiles = fs.existsSync(markdownDir)
    ? fs.readdirSync(markdownDir).filter((f) => f.endsWith(".md"))
    : [];

  const imagesDir = path.join(extractedDir, "images");
  if (fs.existsSync(imagesDir)) {
    for (const img of fs.readdirSync(imagesDir)) {
      const srcPath = path.join(imagesDir, img);
      if (fs.statSync(srcPath).isFile()) fs.copyFileSync(srcPath, path.join(imagesOutDir, img));
    }
  }

  for (const file of markdownFiles) {
    const slug = path.basename(file, ".md");
    const kind = slugToKind.get(slug) ?? "blog";
    const typeDir = kind === "resource" ? resourcesDir : blogDir;
    const fullPath = path.join(markdownDir, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    let bodyContent = content;
    if (fs.existsSync(imagesDir)) {
      for (const img of fs.readdirSync(imagesDir)) {
        const publicUrl = `/${tenant}/images/${img}`;
        bodyContent = bodyContent.replace(new RegExp(`images/${img.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g"), publicUrl);
      }
    }
    const normalized = normalizeFrontmatter({ ...data, kind }, slug, bodyContent);
    fs.writeFileSync(path.join(typeDir, `${slug}.md`), normalized, "utf-8");
    console.log(`  ${kind}: ${slug}.md`);
  }

}

function ensureConfig(tenant: string) {
  const configPath = path.join(DEMO_ASSETS, tenant, "config.json");
  if (fs.existsSync(configPath)) return;
  const name = tenant.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  fs.writeFileSync(
    configPath,
    JSON.stringify({ displayName: name, logoText: name, tagline: "", themeAccent: "indigo" }, null, 2),
    "utf-8"
  );
  console.log(`  Created ${configPath}`);
}

async function ingestZip(zipPath: string, tenant: string) {
  const tmpDir = path.join(process.cwd(), ".ingest-tmp", path.basename(zipPath, ".zip"));
  ensureDir(tmpDir);
  try {
    await unzipToDir(zipPath, tmpDir);
    const navPath = path.join(tmpDir, "nav.json");
    const slugToKind = new Map<string, Kind>();
    if (fs.existsSync(navPath)) {
      const nav = JSON.parse(fs.readFileSync(navPath, "utf-8")) as Array<{ slug: string; kind?: string }>;
      for (const entry of nav) {
        slugToKind.set(entry.slug, (entry.kind === "resource" ? "resource" : "blog") as Kind);
      }
    }
    processExtractedDir(tmpDir, tenant, slugToKind);
  } finally {
    if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
  }
}

function ingestLooseFiles(sourceDir: string, tenant: string) {
  const blogDir = path.join(DEMO_ASSETS, tenant, "blog");
  const resourcesDir = path.join(DEMO_ASSETS, tenant, "resources");
  const imagesOutDir = path.join(PUBLIC_DIR, tenant, "images");
  ensureDir(blogDir);
  ensureDir(resourcesDir);
  ensureDir(imagesOutDir);

  const markdownDir = path.join(sourceDir, "markdown");
  const mdDirs = fs.existsSync(markdownDir) ? [markdownDir] : [];
  const topMd = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => path.join(sourceDir, e.name));
  const allMdPaths = [...topMd, ...mdDirs.flatMap((d) => fs.readdirSync(d).map((f) => path.join(d, f)))];

  for (const fullPath of allMdPaths) {
    if (!fullPath.endsWith(".md")) continue;
    const slug = path.basename(fullPath, ".md");
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    const kind = ((data.kind as string) || "blog").toLowerCase() as Kind;
    const typeDir = kind === "resource" ? resourcesDir : blogDir;
    const normalized = normalizeFrontmatter({ ...data, kind }, slug, content);
    fs.writeFileSync(path.join(typeDir, `${slug}.md`), normalized, "utf-8");
    console.log(`  loose ${kind}: ${slug}.md`);
  }

  const imagesDir = path.join(sourceDir, "images");
  const imageDirs = fs.existsSync(imagesDir) ? [imagesDir] : [];
  const topImages = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.(png|jpg|jpeg|webp|gif)$/i.test(e.name))
    .map((e) => path.join(sourceDir, e.name));
  const allImagePaths = [...topImages, ...imageDirs.flatMap((d) => fs.readdirSync(d).map((f) => path.join(d, f)))];
  for (const src of allImagePaths) {
    if (!fs.statSync(src).isFile()) continue;
    const name = path.basename(src);
    fs.copyFileSync(src, path.join(imagesOutDir, name));
    console.log(`  image: ${name}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const sourceIdx = args.indexOf("--source");
  const zipIdx = args.indexOf("--zip");
  const tenantIdx = args.indexOf("--tenant");

  if (sourceIdx !== -1 && args[sourceIdx + 1]) {
    const sourceDir = path.resolve(process.cwd(), args[sourceIdx + 1]!);
    const tenant =
      tenantIdx !== -1 && args[tenantIdx + 1]
        ? args[tenantIdx + 1]!
        : path.basename(sourceDir);
    if (!fs.existsSync(sourceDir)) {
      console.error("Source dir not found:", sourceDir);
      process.exit(1);
    }
    ensureDir(path.join(DEMO_ASSETS, tenant));
    ensureConfig(tenant);

    const zips = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".zip"));
    for (const z of zips) {
      console.log(`Zip: ${z}`);
      await ingestZip(path.join(sourceDir, z), tenant);
    }
    console.log("Loose files:");
    ingestLooseFiles(sourceDir, tenant);
    return;
  }

  if (zipIdx !== -1 && args[zipIdx + 1] && tenantIdx !== -1 && args[tenantIdx + 1]) {
    const zipPath = path.resolve(process.cwd(), args[zipIdx + 1]!);
    const tenant = args[tenantIdx + 1]!;
    if (!fs.existsSync(zipPath)) {
      console.error("Zip not found:", zipPath);
      process.exit(1);
    }
    ensureDir(path.join(DEMO_ASSETS, tenant));
    ensureConfig(tenant);
    await ingestZip(zipPath, tenant);
    return;
  }

  console.log("Usage: npm run ingest -- --source J77Output/diagpartners [--tenant Gong]");
  console.log("   or: npm run ingest -- --zip path/to/file.zip --tenant diagpartners");
  process.exit(1);
}

main();
