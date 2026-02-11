import { notFound } from "next/navigation";
import Link from "next/link";
import { discoverTenants } from "@/lib/tenants";
import { loadContentBySlug, getAdjacentByDate } from "@/lib/content";
import { loadTenantConfig } from "@/lib/tenants";
import { relatedContent } from "@/lib/related";
import { markdownToHtml } from "@/lib/markdown";
import { getFeaturedImageUrl } from "@/lib/featured-image";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { TagChips } from "@/components/content/TagChips";
import { RelatedContentGrid } from "@/components/content/RelatedContentGrid";
import { InlineRecommendationsBlock } from "@/components/content/InlineRecommendationsBlock";

export async function generateStaticParams() {
  const tenants = discoverTenants();
  const params: { tenant: string; slug: string }[] = [];
  for (const tenant of tenants) {
    const { loadAllContent } = await import("@/lib/content");
    const { resources } = loadAllContent(tenant);
    for (const r of resources) params.push({ tenant, slug: r.slug });
  }
  return params;
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ tenant: string; slug: string }>;
}) {
  const { tenant, slug } = await params;
  const config = loadTenantConfig(tenant);
  const resource = loadContentBySlug(tenant, "resources", slug);
  if (!resource) notFound();

  const html = await markdownToHtml(resource.body);
  const related = relatedContent(tenant, "resources", slug, { limit: 4, preferOppositeType: true });
  const relatedInsights = related.filter((r) => r.type === "blog");
  const { prev, next } = getAdjacentByDate(tenant, "resources", slug);
  const accent = config.themeAccent ?? "indigo";
  const featuredImageUrl = getFeaturedImageUrl(tenant, slug);
  const base = `/${encodeURIComponent(tenant)}`;

  return (
    <article className="animate-fade-in mx-auto max-w-3xl">
      {featuredImageUrl && (
        <div className="mb-8 overflow-hidden rounded-2xl shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featuredImageUrl} alt="" className="w-full object-cover" />
        </div>
      )}

      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Link href={`${base}/resources`} className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
            ← Resources
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl leading-tight">
          {resource.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-stone-400">
          <time>{resource.date}</time>
          <span className="text-stone-300">·</span>
          <span>{resource.readingTime} min read</span>
          {resource.author && (
            <>
              <span className="text-stone-300">·</span>
              <span>{resource.author}</span>
            </>
          )}
        </div>
        {resource.tags.length > 0 && (
          <div className="mt-4">
            <TagChips tenant={tenant} tags={resource.tags} accent={accent} />
          </div>
        )}
      </header>

      {relatedInsights.length > 0 && (
        <InlineRecommendationsBlock tenant={tenant} items={relatedInsights} title="Related insights" accent={accent} />
      )}

      <div className="mb-12">
        <MarkdownContent html={html} />
      </div>

      <RelatedContentGrid tenant={tenant} items={related} accent={accent} />

      <nav className="mt-12 grid grid-cols-2 gap-4 border-t border-stone-100 pt-8">
        {prev ? (
          <Link href={`${base}/resources/${prev.slug}`} className="group rounded-xl border border-stone-200 p-4 transition hover:border-stone-300 hover:shadow-sm">
            <span className="text-xs text-stone-400">Previous</span>
            <span className="mt-1 block text-sm font-medium text-stone-700 group-hover:text-stone-900 line-clamp-2">{prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`${base}/resources/${next.slug}`} className="group rounded-xl border border-stone-200 p-4 text-right transition hover:border-stone-300 hover:shadow-sm">
            <span className="text-xs text-stone-400">Next</span>
            <span className="mt-1 block text-sm font-medium text-stone-700 group-hover:text-stone-900 line-clamp-2">{next.title}</span>
          </Link>
        ) : <div />}
      </nav>
    </article>
  );
}
