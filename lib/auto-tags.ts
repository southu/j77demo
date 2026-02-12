/**
 * Auto-generate tags and canonicalTopic from title + description + body content.
 * Used during ingest when frontmatter tags are empty.
 */

const TAG_KEYWORDS: [string, string[]][] = [
  ["AI", ["ai ", "artificial intelligence", "machine learning", "generative ai"]],
  ["Revenue Intelligence", ["revenue intelligence", "revenue ai", "revenue data"]],
  ["Insurance", ["insurance", "carrier", "underwriting", "policyholder"]],
  ["Sales Productivity", ["sales productivity", "rep productivity", "selling time", "admin burden"]],
  ["Governance", ["governance", "compliance", "audit", "regulatory", "oversight"]],
  ["Conversation Intelligence", ["conversation intelligence", "conversation data", "call recording", "call analysis"]],
  ["Distribution", ["distribution", "captive agent", "independent broker", "hybrid channel"]],
  ["Enterprise", ["enterprise", "large carrier", "fortune 500", "global organization"]],
  ["Hiring", ["hiring", "recruiting", "talent acquisition", "job seeker"]],
  ["Remote Work", ["remote work", "hybrid work", "flexible work", "work from home"]],
  ["HR", ["hr leader", "human resources", "people operations", "chro"]],
  ["CMO Strategy", ["cmo", "chief marketing", "marketing leader"]],
  ["CRO Strategy", ["cro", "chief revenue", "revenue leader"]],
  ["Enablement", ["enablement", "onboarding", "coaching", "training"]],
  ["Forecasting", ["forecast", "pipeline", "deal visibility", "deal review"]],
];

const TOPIC_PATTERNS: [string, string[]][] = [
  ["AI in Insurance Distribution", ["insurance", "distribution", "ai"]],
  ["AI for Rep Productivity", ["rep productivity", "sales productivity", "revenue intelligence"]],
  ["AI Governance", ["governance", "compliance", "regulated"]],
  ["Conversation Intelligence", ["conversation intelligence", "conversation data"]],
  ["Hiring Strategy", ["hiring", "recruiting", "talent"]],
];

function textContains(text: string, phrases: string[]): boolean {
  const lower = text.toLowerCase();
  return phrases.some((p) => lower.includes(p));
}

/**
 * Auto-generate tags from title + description + first ~2000 chars of body.
 * Returns at most 5 tags.
 */
export function autoGenerateTags(title: string, description: string, body: string): string[] {
  const sample = `${title} ${description} ${body.slice(0, 2000)}`;
  const tags: string[] = [];
  for (const [tag, keywords] of TAG_KEYWORDS) {
    if (textContains(sample, keywords)) tags.push(tag);
  }
  return tags.slice(0, 5);
}

/**
 * Auto-detect a canonicalTopic from title + description + body.
 */
export function autoDetectTopic(title: string, description: string, body: string): string | undefined {
  const sample = `${title} ${description} ${body.slice(0, 2000)}`.toLowerCase();
  for (const [topic, keywords] of TOPIC_PATTERNS) {
    if (keywords.every((k) => sample.includes(k))) return topic;
  }
  return undefined;
}
