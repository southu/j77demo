import Link from "next/link";
import { TagChips } from "./TagChips";
import type { ContentItem } from "@/lib/content";

export function ContentCard({
  tenant,
  item,
  accent = "indigo",
}: {
  tenant: string;
  item: ContentItem;
  accent?: string;
}) {
  const base = `/${encodeURIComponent(tenant)}`;
  const href = `${base}/${item.type}/${item.slug}`;
  const label = item.type === "blog" ? "Blog" : "Resource";

  return (
    <article className="animate-fade-in rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-300 hover:shadow-md">
      <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </span>
      <Link href={href} className="mt-1 block font-semibold text-stone-900 hover:underline">
        {item.title}
      </Link>
      {item.description && (
        <p className="mt-2 line-clamp-2 text-sm text-stone-600">{item.description}</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-500">
        <span>{item.date}</span>
        <span>{item.readingTime} min read</span>
      </div>
      <div className="mt-3">
        <TagChips tenant={tenant} tags={item.tags} accent={accent} />
      </div>
    </article>
  );
}
