"use client";

import { useMemo, useState } from "react";
import { ContentCard } from "@/components/content/ContentCard";
import { SearchBox } from "@/components/content/SearchBox";
import { groupBlogBySeries } from "@/lib/series";
import type { ContentItem } from "@/lib/content";
import type { BlogSeriesGroup } from "@/lib/series";

export function BlogListClient({
  tenant,
  seriesGroups,
  standalonePosts,
  tags,
  accent,
  imageMap,
}: {
  tenant: string;
  seriesGroups: BlogSeriesGroup<ContentItem>[];
  standalonePosts: ContentItem[];
  tags: string[];
  accent: string;
  imageMap: Record<string, string | null>;
}) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allPosts: ContentItem[] = useMemo(
    () => [...seriesGroups.flatMap((g) => g.posts), ...standalonePosts],
    [seriesGroups, standalonePosts]
  );

  const filtered = useMemo(() => {
    let list = allPosts;
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
  }, [allPosts, search, selectedTag]);

  const { series: filteredSeries, standalone: filteredStandalone } = useMemo(
    () => groupBlogBySeries(filtered),
    [filtered]
  );

  const accentBtnActive =
    accent === "violet" ? "bg-violet-600 text-white"
    : accent === "purple" ? "bg-purple-600 text-white"
    : accent === "emerald" ? "bg-emerald-600 text-white"
    : accent === "blue" ? "bg-blue-600 text-white"
    : "bg-indigo-600 text-white";

  return (
    <div className="space-y-10">
      <header className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">Blog</h1>
        <p className="mt-2 text-lg text-stone-500">
          Insights, analysis, and practical guides.
        </p>
      </header>

      <div className="space-y-4">
        <SearchBox value={search} onChange={setSearch} placeholder="Search posts…" />
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">Tags</span>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? accentBtnActive
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
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
        <p className="text-sm text-stone-400">{filtered.length} post{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-stone-400">No posts match your search.</p>
      ) : (
        <div className="space-y-16">
          {filteredSeries.map((group) => (
            <section key={group.seriesKey} className="animate-fade-in">
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="text-xl font-bold text-stone-900">{group.seriesTitle}</h2>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500">
                  {group.posts.length} parts
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.posts.map((post) => (
                  <ContentCard key={post.slug} tenant={tenant} item={post} accent={accent} imageUrl={imageMap[post.slug]} />
                ))}
              </div>
            </section>
          ))}
          {filteredStandalone.length > 0 && (
            <section className="animate-fade-in">
              {filteredSeries.length > 0 && (
                <h2 className="mb-6 text-xl font-bold text-stone-900">More posts</h2>
              )}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStandalone.map((post) => (
                  <ContentCard key={post.slug} tenant={tenant} item={post} accent={accent} imageUrl={imageMap[post.slug]} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
