import fs from "fs";
import path from "path";

const DEMO_ASSETS = path.join(process.cwd(), "demo-assets");

export type TenantConfig = {
  displayName: string;
  logoText: string;
  tagline: string;
  themeAccent: string;
  companyUrl?: string;
  navLinks?: Array<{ label: string; href: string }>;
  homeSections?: {
    whatWeDo?: string[];
    whoItsFor?: string;
    keyOutcomes?: string[];
  };
};

function toTitleCase(s: string): string {
  return s
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Discover tenant ids from folder names in demo-assets. */
export function discoverTenants(): string[] {
  if (!fs.existsSync(DEMO_ASSETS)) return [];
  const entries = fs.readdirSync(DEMO_ASSETS, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);
}

/** Load config for a tenant. Returns defaults if config.json missing or invalid. */
export function loadTenantConfig(tenant: string): TenantConfig {
  const configPath = path.join(DEMO_ASSETS, tenant, "config.json");
  const defaults: TenantConfig = {
    displayName: toTitleCase(tenant),
    logoText: toTitleCase(tenant),
    tagline: "",
    themeAccent: "indigo",
  };
  if (!fs.existsSync(configPath)) return defaults;
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const data = JSON.parse(raw) as Partial<TenantConfig>;
    return {
      displayName: data.displayName ?? defaults.displayName,
      logoText: data.logoText ?? defaults.logoText,
      tagline: data.tagline ?? defaults.tagline,
      themeAccent: data.themeAccent ?? defaults.themeAccent,
      companyUrl: data.companyUrl,
      navLinks: data.navLinks,
      homeSections: data.homeSections,
    };
  } catch {
    return defaults;
  }
}
