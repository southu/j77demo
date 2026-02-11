import fs from "fs";
import path from "path";

const DEMO_ASSETS = path.join(process.cwd(), "demo-assets");

export type SeedData = {
  pageTitle?: string;
  metaDescription?: string;
  headlines?: string[];
  aboutSummary?: string;
  valueProps?: string[];
  featureTitles?: [string, string, string];
  featureDescriptions?: [string, string, string];
};

/** Load seed.json for a tenant if it exists. */
export function loadSeed(tenant: string): SeedData | null {
  const seedPath = path.join(DEMO_ASSETS, tenant, "seed.json");
  if (!fs.existsSync(seedPath)) return null;
  try {
    const raw = fs.readFileSync(seedPath, "utf-8");
    return JSON.parse(raw) as SeedData;
  } catch {
    return null;
  }
}
