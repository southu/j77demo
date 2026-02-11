import Link from "next/link";
import type { ContentItem } from "@/lib/content";

const accentBorder: Record<string, string> = {
  indigo: "border-indigo-200 bg-indigo-50/40",
  blue: "border-blue-200 bg-blue-50/40",
  emerald: "border-emerald-200 bg-emerald-50/40",
  violet: "border-violet-200 bg-violet-50/40",
  purple: "border-purple-200 bg-purple-50/40",
};

const accentLink: Record<string, string> = {
  indigo: "text-indigo-700 hover:text-indigo-900",
  blue: "text-blue-700 hover:text-blue-900",
  emerald: "text-emerald-700 hover:text-emerald-900",
  violet: "text-violet-700 hover:text-violet-900",
  purple: "text-purple-700 hover:text-purple-900",
};

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
  const borderCls = accentBorder[accent] ?? accentBorder.indigo;
  const linkCls = accentLink[accent] ?? accentLink.indigo;

  return (
    <aside className={`my-10 rounded-2xl border p-6 ${borderCls}`}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {items.slice(0, 4).map((item) => (
          <li key={`${item.type}-${item.slug}`} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-stone-300" />
            <Link
              href={`${base}/${item.type}/${item.slug}`}
              className={`text-sm font-medium transition-colors ${linkCls}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
