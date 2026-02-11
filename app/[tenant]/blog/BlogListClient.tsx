"use client";

import { useMemo, useState } from "react";
import { ContentCard } from "@/components/content/ContentCard";
import { SearchBox } from "@/components/content/SearchBox";
import type { ContentItem } from "@/lib/content";

export function BlogListClient({
  tenant,
  posts,
  tags,
  accent,
}: {
  tenant: string;
  posts: ContentItem[];
  tags: string[];
  accent: string;
}) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = posts;
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
  }, [posts, search, selectedTag]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-stone-900">Blog</h1>
      <SearchBox value={search} onChange={setSearch} placeholder="Search posts…" />
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-stone-500">Filter by tag:</span>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedTag === tag
                  ? "bg-indigo-600 text-white"
                  : "bg-stone-200 text-stone-700 hover:bg-stone-300"
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTag && (
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className="text-xs text-stone-500 underline"
            >
              Clear
            </button>
          )}
        </div>
      )}
      <p className="text-sm text-stone-500">{filtered.length} posts</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <ContentCard key={post.slug} tenant={tenant} item={post} accent={accent} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-stone-500">No posts match.</p>
      )}
    </div>
  );
}
