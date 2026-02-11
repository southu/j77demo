import Link from "next/link";
import type { ContentItem } from "@/lib/content";

export function InlineRecommendationsBlock({
  tenant,
  items,
  title,
  accent = "indigo",
}: {
  tenant: string;
  items: ContentItem[];
  title: string;
  accent?: string;
}) {
  if (items.length === 0) return null;
  const base = `/${encodeURIComponent(tenant)}`;
  const borderClass =
    accent === "emerald"
      ? "border-emerald-200 bg-emerald-50/50"
      : accent === "blue"
        ? "border-blue-200 bg-blue-50/50"
        : accent === "violet"
          ? "border-violet-200 bg-violet-50/50"
          : accent === "purple"
            ? "border-purple-200 bg-purple-50/50"
            : "border-indigo-200 bg-indigo-50/50";

  return (
    <aside className={`my-8 rounded-xl border p-6 ${borderClass}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-600">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.slice(0, 4).map((item) => (
          <li key={`${item.type}-${item.slug}`}>
            <Link
              href={`${base}/${item.type}/${item.slug}`}
              className="font-medium text-stone-900 hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}