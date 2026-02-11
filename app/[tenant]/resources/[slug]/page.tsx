import { notFound } from "next/navigation";
import Link from "next/link";
import { discoverTenants } from "@/lib/tenants";
import { loadContentBySlug, getAdjacentByDate } from "@/lib/content";
import { loadTenantConfig } from "@/lib/tenants";
import { relatedContent } from "@/lib/related";
import { markdownToHtml } from "@/lib/markdown";
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
  const related = relatedContent(tenant, "resources", slug, {
    limit: 4,
    preferOppositeType: true,
  });
  const relatedInsights = related.filter((r) => r.type === "blog");
  const { prev, next } = getAdjacentByDate(tenant, "resources", slug);
  const base = `/${encodeURIComponent(tenant)}`;
  const accent = config.themeAccent ?? "indigo";

  return (
    <article className="animate-fade-in">
      <InlineRecommendationsBlock
        tenant={tenant}
        items={relatedInsights}
        title="Related insights"
        accent={accent}
      />
      <header>
        <h1 className="text-3xl font-bold text-stone-900">{resource.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-stone-500">
          <span>{resource.date}</span>
          <span>{resource.readingTime} min read</span>
          {resource.author && <span>{resource.author}</span>}
        </div>
        <div className="mt-3">
          <TagChips tenant={tenant} tags={resource.tags} accent={accent} />
        </div>
      </header>
      <div className="mt-8">
        <MarkdownContent html={html} />
      </div>
      <RelatedContentGrid tenant={tenant} items={related} accent={accent} />
      <nav className="mt-8 flex justify-between border-t border-stone-200 pt-6">
        {prev ? (
          <Link href={`${base}/resources/${prev.slug}`} className="text-indigo-600 hover:underline">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`${base}/resources/${next.slug}`} className="text-indigo-600 hover:underline">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
