#!/usr/bin/env node
/**
 * Homepage seeding: fetch companyUrl HTML, extract/summarize, write demo-assets/<tenant>/seed.json.
 * Usage: npm run seed -- --tenant Gong  |  npm run seed -- --all  |  npm run seed -- --tenant Gong --force
 */
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

const DEMO_ASSETS = path.join(process.cwd(), "demo-assets");

function getTenants(): string[] {
  if (!fs.existsSync(DEMO_ASSETS)) return [];
  return fs
    .readdirSync(DEMO_ASSETS, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);
}

function loadConfig(tenant: string): { companyUrl?: string; displayName: string; tagline: string } {
  const p = path.join(DEMO_ASSETS, tenant, "config.json");
  if (!fs.existsSync(p)) {
    const name = tenant.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { displayName: name, tagline: "" };
  }
  const data = JSON.parse(fs.readFileSync(p, "utf-8"));
  return {
    companyUrl: data.companyUrl,
    displayName: data.displayName ?? tenant,
    tagline: data.tagline ?? "",
  };
}

function summarize(text: string, maxSentences = 2): string {
  const sentences = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  return sentences.slice(0, maxSentences).join(" ") || text.slice(0, 200);
}

async function fetchAndExtract(companyUrl: string): Promise<{
  pageTitle?: string;
  metaDescription?: string;
  headlines: string[];
  aboutSummary?: string;
  valueProps: string[];
  featureTitles: [string, string, string];
  featureDescriptions: [string, string, string];
}> {
  const res = await fetch(companyUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; J77Demo/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const pageTitle = $("title").first().text().trim() || undefined;
  let metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || undefined;
  const h1s = $("h1")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const h2s = $("h2")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);
  const headlines = [...new Set([...h1s, ...h2s])].slice(0, 5);

  const paragraphs = $("p")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 80);
  const aboutSummary = paragraphs[0] ? summarize(paragraphs[0]) : undefined;
  const valueProps = [...new Set(paragraphs.slice(0, 5).map((p) => summarize(p, 1)))].slice(0, 5);
  const featureTitles: [string, string, string] = [
    headlines[0] || "Key capability one",
    headlines[1] || "Key capability two",
    headlines[2] || "Key capability three",
  ];
  const featureDescriptions: [string, string, string] = [
    valueProps[0] || "Summary of the first area.",
    valueProps[1] || "Summary of the second area.",
    valueProps[2] || "Summary of the third area.",
  ];

  return {
    pageTitle,
    metaDescription,
    headlines,
    aboutSummary,
    valueProps,
    featureTitles,
    featureDescriptions,
  };
}

function defaultSeed(displayName: string, tagline: string) {
  return {
    pageTitle: `${displayName} – Overview`,
    metaDescription: tagline || `Learn more about ${displayName}.`,
    headlines: [displayName, tagline].filter(Boolean),
    aboutSummary: `${displayName} helps teams achieve their goals with practical insights and clear next steps.`,
    valueProps: ["Practical insights", "Clear next steps", "Trusted approach"],
    featureTitles: [
      "Understand your market",
      "Engage your audience",
      "Measure what matters",
    ] as [string, string, string],
    featureDescriptions: [
      "Get clarity on trends and opportunities.",
      "Create content that resonates.",
      "Track impact with simple metrics.",
    ] as [string, string, string],
  };
}

async function seedOne(tenant: string, force: boolean) {
  const config = loadConfig(tenant);
  const seedPath = path.join(DEMO_ASSETS, tenant, "seed.json");
  if (fs.existsSync(seedPath) && !force && config.companyUrl) {
    console.log(`Skip ${tenant}: seed.json exists (use --force to refresh)`);
    return;
  }
  let data: Awaited<ReturnType<typeof fetchAndExtract>>;
  if (config.companyUrl) {
    try {
      data = await fetchAndExtract(config.companyUrl);
    } catch (err) {
      console.warn(`Fetch failed for ${tenant}:`, err);
      data = defaultSeed(config.displayName, config.tagline);
    }
  } else {
    data = defaultSeed(config.displayName, config.tagline);
  }
  const dir = path.dirname(seedPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(seedPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Wrote ${seedPath}`);
}

const args = process.argv.slice(2);
const tenantArg = args.includes("--tenant") ? args[args.indexOf("--tenant") + 1] : null;
const all = args.includes("--all");
const force = args.includes("--force");

(async () => {
  const tenants = all ? getTenants() : tenantArg ? [tenantArg] : [];
  if (tenants.length === 0) {
    console.log("Usage: npm run seed -- --tenant <name> | --all [--force]");
    process.exit(1);
  }
  for (const t of tenants) await seedOne(t, force);
})();
