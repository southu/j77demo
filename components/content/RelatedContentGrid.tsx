import { ContentCard } from "./ContentCard";
import type { ContentItem } from "@/lib/content";

export function RelatedContentGrid({
  tenant,
  items,
  accent = "indigo",
}: {
  tenant: string;
  items: ContentItem[];
  accent?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12 border-t border-stone-200 pt-8">
      <h2 className="text-lg font-semibold text-stone-900">Related</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <ContentCard key={`${item.type}-${item.slug}`} tenant={tenant} item={item} accent={accent} />
        ))}
      </div>
    </section>
  );
}