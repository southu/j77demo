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
    <section className="mt-16 border-t border-stone-100 pt-10">
      <h2 className="text-xl font-bold tracking-tight text-stone-900">Related content</h2>
      <p className="mt-1 text-sm text-stone-500">You might also find these useful.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <ContentCard key={`${item.type}-${item.slug}`} tenant={tenant} item={item} accent={accent} />
        ))}
      </div>
    </section>
  );
}
