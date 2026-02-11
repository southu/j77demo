import type { ContentItem } from "./content";
import { loadAllContent } from "./content";

/** Jaccard similarity between two tag sets. */
function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

/** Simple word tokenize for title/description. */
function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1)
  );
}

/** Score by keyword overlap (title + description). */
function keywordScore(a: ContentItem, b: ContentItem): number {
  const wordsA = tokenize(a.title + " " + a.description);
  const wordsB = tokenize(b.title + " " + b.description);
  const inter = [...wordsA].filter((w) => wordsB.has(w)).length;
  return wordsA.size === 0 ? 0 : inter / wordsA.size;
}

export type RelatedOptions = {
  limit?: number;
  preferOppositeType?: boolean;
};

/**
 * Related content engine:
 * - Primary: same canonicalTopic, then Jaccard on tags.
 * - Secondary: keyword overlap on title/description.
 * - Frontmatter related[] pins those slugs first.
 * - When preferOppositeType, we try to return at least half from the other type.
 */
export function relatedContent(
  tenant: string,
  type: ContentItem["type"],
  slug: string,
  options: RelatedOptions = {}
): ContentItem[] {
  const limit = options.limit ?? 4;
  const preferOpposite = options.preferOppositeType ?? true;
  const { blog, resources } = loadAllContent(tenant);
  const all = [...blog, ...resources];
  const current = all.find((i) => i.slug === slug && i.type === type);
  if (!current) return [];

  const otherType = type === "blog" ? "resources" : "blog";
  const candidates = all.filter((i) => i.slug !== slug);

  // Pinned from frontmatter.related
  const pinned: ContentItem[] = [];
  if (current.related?.length) {
    for (const s of current.related) {
      const item = candidates.find((c) => c.slug === s);
      if (item && !pinned.find((p) => p.slug === item.slug)) pinned.push(item);
    }
  }

  // Score remaining: canonicalTopic match > tag Jaccard > keyword overlap
  const scored = candidates
    .filter((c) => !pinned.some((p) => p.slug === c.slug))
    .map((c) => {
      let score = 0;
      if (current.canonicalTopic && c.canonicalTopic === current.canonicalTopic) score += 10;
      const tagA = new Set(current.tags.map((t) => t.toLowerCase()));
      const tagB = new Set(c.tags.map((t) => t.toLowerCase()));
      score += jaccard(tagA, tagB) * 5;
      score += keywordScore(current, c) * 2;
      return { item: c, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);

  // Build result: pinned first, then fill with scored, balancing opposite type when requested
  const result: ContentItem[] = [...pinned];
  const needOpposite = preferOpposite ? Math.ceil(limit / 2) : 0;
  let oppositeCount = result.filter((r) => r.type === otherType).length;

  for (const item of scored) {
    if (result.length >= limit) break;
    if (result.some((r) => r.slug === item.slug)) continue;
    const isOpposite = item.type === otherType;
    if (isOpposite && oppositeCount < needOpposite) {
      result.push(item);
      oppositeCount++;
    } else if (!isOpposite || result.length < limit) {
      result.push(item);
    }
  }

  // If we still need more opposite type, swap in from scored
  if (preferOpposite && oppositeCount < needOpposite) {
    const oppositeCandidates = scored.filter(
      (s) => s.type === otherType && !result.some((r) => r.slug === s.slug)
    );
    for (const item of oppositeCandidates) {
      if (result.length >= limit || oppositeCount >= needOpposite) break;
      const sameIdx = result.findIndex((r) => r.type === type);
      if (sameIdx !== -1) {
        result.splice(sameIdx, 1, item);
        oppositeCount++;
      }
    }
  }

  return result.slice(0, limit);
}
