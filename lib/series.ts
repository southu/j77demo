/** Minimal shape needed for series grouping; ContentItem satisfies this. */
type PostWithSeries = { slug: string; series?: string; seriesOrder?: number; date: string; [key: string]: unknown };

export type BlogSeriesGroup<T = PostWithSeries> = {
  seriesTitle: string;
  seriesKey: string;
  posts: T[];
};

/**
 * Group blog posts by series; each series is sorted by seriesOrder.
 * Posts with no series go in standalone (sorted by date).
 * Safe to use in client components (no Node deps).
 */
export function groupBlogBySeries<T extends PostWithSeries>(blog: T[]): {
  series: BlogSeriesGroup<T>[];
  standalone: T[];
} {
  const bySeries = new Map<string, T[]>();
  const standalone: T[] = [];
  for (const post of blog) {
    if (post.series && post.seriesOrder != null) {
      const key = post.series;
      if (!bySeries.has(key)) bySeries.set(key, []);
      bySeries.get(key)!.push(post);
    } else {
      standalone.push(post);
    }
  }
  const series: BlogSeriesGroup<T>[] = [];
  bySeries.forEach((posts, seriesTitle) => {
    posts.sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    series.push({
      seriesTitle,
      seriesKey: seriesTitle.replace(/\s+/g, "-").toLowerCase(),
      posts,
    });
  });
  series.sort((a, b) => {
    const aFirst = a.posts[0]?.date ?? "";
    const bFirst = b.posts[0]?.date ?? "";
    return bFirst.localeCompare(aFirst);
  });
  standalone.sort((a, b) => (b.date > a.date ? 1 : -1));
  return { series, standalone };
}
