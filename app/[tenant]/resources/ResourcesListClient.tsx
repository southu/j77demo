"use client";

import { useMemo, useState } from "react";
import { ContentCard } from "@/components/content/ContentCard";
import { SearchBox } from "@/components/content/SearchBox";
import type { ContentItem } from "@/lib/content";

export function ResourcesListClient({
  tenant,
  items,
  tags,
  accent,
  imageMap,
}: {
  tenant: string;
  items: ContentItem[];
  tags: string[];
  accent: string;
  imageMap: Record<string, string | null>;
}) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = items;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedTag) {
      list = list.filter((p) => p.tags.includes(selectedTag));
    }
    return list;
  }, [items, search, selectedTag]);

  const accentBtnActive =
    accent === "violet" ? "bg-violet-600 text-white"
    : accent === "purple" ? "bg-purple-600 text-white"
    : accent === "emerald" ? "bg-emerald-600 text-white"
    : accent === "blue" ? "bg-blue-600 text-white"
    : "bg-indigo-600 text-white";

  return (
    <div className="space-y-10">
      <header className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">Resources</h1>
        <p className="mt-2 text-lg text-stone-500">
          Frameworks, playbooks, and executive guides.
        </p>
      </header>

      <div className="space-y-4">
        <SearchBox value={search} onChange={setSearch} placeholder="Search resources…" />
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">Tags</span>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedTag === tag ? accentBtnActive : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button type="button" onClick={() => setSelectedTag(null)} className="ml-1 text-xs text-stone-400 hover:text-stone-600 underline">
                Clear
              </button>
            )}
          </div>
        )}
        <p className="text-sm text-stone-400">{filtered.length} resource{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-stone-400">No resources match your search.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ContentCard key={item.slug} tenant={tenant} item={item} accent={accent} imageUrl={imageMap[item.slug]} />
          ))}
        </div>
      )}
    </div>
  );
}
