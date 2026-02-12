#!/usr/bin/env node
/**
 * Validate content for one or all tenants.
 * Usage: npm run validate          (all tenants)
 *        npm run validate -- Gong  (specific tenant)
 */
import fs from "fs";
import path from "path";
import { printValidation } from "../lib/validate-content";

const DEMO_ASSETS = path.join(process.cwd(), "demo-assets");

function getTenants(): string[] {
  if (!fs.existsSync(DEMO_ASSETS)) return [];
  return fs
    .readdirSync(DEMO_ASSETS, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);
}

const arg = process.argv[2];
const tenants = arg ? [arg] : getTenants();

if (tenants.length === 0) {
  console.log("No tenants found.");
  process.exit(0);
}

console.log("── Content Validation ──\n");
let hasErrors = false;
for (const tenant of tenants) {
  if (printValidation(tenant)) hasErrors = true;
  console.log();
}

if (hasErrors) {
  console.log("Fix errors above before building.");
  process.exit(1);
} else {
  console.log("Done.");
}
