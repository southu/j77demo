/**
 * Content validation: check that ingested content meets quality thresholds.
 * Run after ingest to flag issues.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const DEMO_ASSETS = path.join(process.cwd(), "demo-assets");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

export type ValidationIssue = {
  severity: "error" | "warning";
  file: string;
  message: string;
};

function hasImage(tenant: string, slug: string): boolean {
  const imagesDir = path.join(PUBLIC_DIR, tenant, "images");
  if (!fs.existsSync(imagesDir)) return false;
  return fs.readdirSync(imagesDir).some(
    (f) => f.startsWith(`${slug}.`) && IMAGE_EXTS.some((e) => f.endsWith(e))
  );
}

export function validateTenantContent(tenant: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const tenantDir = path.join(DEMO_ASSETS, tenant);
  if (!fs.existsSync(tenantDir)) {
    issues.push({ severity: "error", file: tenant, message: `Tenant folder not found: ${tenantDir}` });
    return issues;
  }

  // Check config
  const configPath = path.join(tenantDir, "config.json");
  if (!fs.existsSync(configPath)) {
    issues.push({ severity: "warning", file: "config.json", message: "Missing config.json — using defaults" });
  }

  // Check content
  for (const type of ["blog", "resources"] as const) {
    const dir = path.join(tenantDir, type);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    for (const file of files) {
      const slug = path.basename(file, ".md");
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const relPath = `${type}/${file}`;

      // Title
      if (!data.title || (data.title as string).trim().length < 5) {
        issues.push({ severity: "error", file: relPath, message: "Missing or very short title" });
      }

      // Description
      if (!data.description || (data.description as string).trim().length < 10) {
        issues.push({ severity: "warning", file: relPath, message: "Missing or very short description" });
      }

      // Date
      if (!data.date) {
        issues.push({ severity: "warning", file: relPath, message: "Missing date" });
      }

      // Tags
      const tags = Array.isArray(data.tags) ? data.tags : [];
      if (tags.length === 0) {
        issues.push({ severity: "warning", file: relPath, message: "No tags — cross-linking will be limited" });
      }

      // Content length
      const rt = readingTime(content);
      if (rt.words < 200) {
        issues.push({ severity: "warning", file: relPath, message: `Very short content (${rt.words} words, ${Math.ceil(rt.minutes)} min read)` });
      }

      // Featured image
      if (!hasImage(tenant, slug)) {
        issues.push({ severity: "warning", file: relPath, message: "No featured image found" });
      }

      // Check for raw source citations that weren't transformed
      if (/\(Source:\s*https?:/.test(content)) {
        issues.push({ severity: "warning", file: relPath, message: "Contains raw (Source: URL) citations — run ingest to transform" });
      }
    }
  }

  return issues;
}

/** Print validation results to console. Returns true if there are errors. */
export function printValidation(tenant: string): boolean {
  const issues = validateTenantContent(tenant);
  if (issues.length === 0) {
    console.log(`  ✓ ${tenant}: All content checks passed`);
    return false;
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  if (errors.length > 0) {
    console.log(`  ✗ ${tenant}: ${errors.length} error(s), ${warnings.length} warning(s)`);
  } else {
    console.log(`  ⚠ ${tenant}: ${warnings.length} warning(s)`);
  }

  for (const issue of issues) {
    const icon = issue.severity === "error" ? "  ✗" : "  ⚠";
    console.log(`${icon} ${issue.file}: ${issue.message}`);
  }

  return errors.length > 0;
}
