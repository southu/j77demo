import { notFound } from "next/navigation";
import Link from "next/link";
import { discoverTenants } from "@/lib/tenants";
import { loadContentBySlug, getAdjacentByDate } from "@/lib/content";
import { loadTenantConfig } from "@/lib/tenants";
import { relatedContent } from "@/lib/related";
import { markdownToHtml, splitBySecondHeading } from "@/lib/markdown";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { TagChips } from "@/components/content/TagChips";
import { RelatedContentGrid } from "@/components/content/RelatedContentGrid";
import { InlineRecommendationsBlock } from "@/components/content/InlineRecommendationsBlock";

export async function generateStaticParams() {
  const tenants = discoverTenants();
  const params: { tenant: string; slug: string }[] = [];
  for (const tenant of tenants) {
    const { loadAllContent } = await import("@/lib/content");
    const { blog } = loadAllContent(tenant);
    for (const p of blog) params.push({ tenant, slug: p.slug });
  }
  return params;
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ tenant: string; slug: string }>;
}) {
  const { tenant, slug } = await params;
  const config = loadTenantConfig(tenant);
  const post = loadContentBySlug(tenant, "blog", slug);
  if (!post) notFound();

  const [beforeBlock, afterBlock] = splitBySecondHeading(post.body);
  const htmlBefore = await markdownToHtml(beforeBlock);
  const htmlAfter = await markdownToHtml(afterBlock);
  const related = relatedContent(tenant, "blog", slug, {
    limit: 4,
    preferOppositeType: true,
  });
  const recommendedResources = related.filter((r) => r.type === "resources");
  const { prev, next } = getAdjacentByDate(tenant, "blog", slug);
  const base = `/${encodeURIComponent(tenant)}`;
  const accent = config.themeAccent ?? "indigo";

  return (
    <article className="animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold text-stone-900">{post.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-stone-500">
          <span>{post.date}</span>
          <span>{post.readingTime} min read</span>
          {post.author && <span>{post.author}</span>}
        </div>
        <div className="mt-3">
          <TagChips tenant={tenant} tags={post.tags} accent={accent} />
        </div>
      </header>
      <div className="mt-8">
        <MarkdownContent html={htmlBefore} />
        <InlineRecommendationsBlock
          tenant={tenant}
          items={recommendedResources}
          title="Recommended resources"
          accent={accent}
        />
        {htmlAfter && <MarkdownContent html={htmlAfter} />}
      </div>
      <RelatedContentGrid tenant={tenant} items={related} accent={accent} />
      <nav className="mt-8 flex justify-between border-t border-stone-200 pt-6">
        {prev ? (
          <Link href={`${base}/blog/${prev.slug}`} className="text-indigo-600 hover:underline">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`${base}/blog/${next.slug}`} className="text-indigo-600 hover:underline">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
