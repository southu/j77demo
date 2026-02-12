import Link from "next/link";
import { TagChips } from "./TagChips";
import type { ContentItem } from "@/lib/content";

const accentLabel: Record<string, string> = {
  indigo: "text-indigo-600 bg-indigo-50",
  blue: "text-blue-600 bg-blue-50",
  emerald: "text-emerald-600 bg-emerald-50",
  violet: "text-violet-600 bg-violet-50",
  purple: "text-purple-600 bg-purple-50",
};

export function ContentCard({
  tenant,
  item,
  accent = "indigo",
  imageUrl,
}: {
  tenant: string;
  item: ContentItem;
  accent?: string;
  imageUrl?: string | null;
}) {
  const base = `/${encodeURIComponent(tenant)}`;
  const href = `${base}/${item.type}/${item.slug}`;
  const label = item.type === "blog" ? "Blog" : "Resource";
  const labelClass = accentLabel[accent] ?? accentLabel.indigo;
  const partLabel = item.seriesOrder != null ? `Part ${item.seriesOrder}` : null;

  return (
    <article className="group animate-fade-in flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <Link href={href} className="block aspect-[16/9] overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className={`text-3xl font-bold opacity-20 ${labelClass}`}>
              {label}
            </span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${labelClass}`}>
            {label}
          </span>
          {partLabel && (
            <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-600">
              {partLabel}
            </span>
          )}
        </div>
        <Link href={href} className="mt-3 block text-[15px] font-semibold leading-snug text-stone-900 transition-colors group-hover:text-violet-700">
          {item.title}
        </Link>
        {item.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-500">{item.description}</p>
        )}
        <div className="mt-auto pt-4 flex flex-wrap items-center gap-2 text-xs text-stone-400">
          <time>{item.date}</time>
          <span className="text-stone-300">·</span>
          <span>{item.readingTime} min read</span>
        </div>
        {item.tags.length > 0 && (
          <div className="mt-3">
            <TagChips tenant={tenant} tags={item.tags} accent={accent} />
          </div>
        )}
      </div>
    </article>
  );
}
