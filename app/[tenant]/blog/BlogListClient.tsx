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
}: {
  tenant: string;
  seriesGroups: BlogSeriesGroup<ContentItem>[];
  standalonePosts: ContentItem[];
  tags: string[];
  accent: string;
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

  const accentButtonClass =
    accent === "violet"
      ? "bg-violet-600 text-white"
      : accent === "purple"
        ? "bg-purple-600 text-white"
        : accent === "emerald"
          ? "bg-emerald-600 text-white"
          : accent === "blue"
            ? "bg-blue-600 text-white"
            : "bg-indigo-600 text-white";

  return (
    <div className="space-y-8">
      <header className="animate-fade-in">
        <h1 className="text-3xl font-bold text-stone-900">Blog</h1>
        <p className="mt-2 text-stone-600">
          Insights, guides, and updates. Browse by topic or search below.
        </p>
      </header>
      <div className="space-y-4">
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
                  selectedTag === tag ? accentButtonClass : "bg-stone-200 text-stone-700 hover:bg-stone-300"
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
      </div>
      {filtered.length === 0 ? (
        <p className="text-stone-500">No posts match.</p>
      ) : (
        <div className="space-y-12">
          {filteredSeries.map((group) => (
            <section key={group.seriesKey}>
              <h2 className="mb-4 text-xl font-semibold text-stone-900">
                Series: {group.seriesTitle}
              </h2>
              <p className="mb-6 text-sm text-stone-500">
                {group.posts.length}-part series
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.posts.map((post) => (
                  <ContentCard key={post.slug} tenant={tenant} item={post} accent={accent} />
                ))}
              </div>
            </section>
          ))}
          {filteredStandalone.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-stone-900">
                More posts
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStandalone.map((post) => (
                  <ContentCard key={post.slug} tenant={tenant} item={post} accent={accent} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
