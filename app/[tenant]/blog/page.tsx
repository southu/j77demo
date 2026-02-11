import { discoverTenants } from "@/lib/tenants";
import { loadAllContent, getAllTags } from "@/lib/content";
import { groupBlogBySeries } from "@/lib/series";
import { loadTenantConfig } from "@/lib/tenants";
import { getFeaturedImageUrl } from "@/lib/featured-image";
import { BlogListClient } from "./BlogListClient";

export function generateStaticParams() {
  return discoverTenants().map((tenant) => ({ tenant }));
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const config = loadTenantConfig(tenant);
  const { blog } = loadAllContent(tenant);
  const tags = getAllTags(tenant);
  const { series, standalone } = groupBlogBySeries(blog);

  // Build a map of slug → image URL for every post
  const imageMap: Record<string, string | null> = {};
  for (const post of blog) {
    imageMap[post.slug] = getFeaturedImageUrl(tenant, post.slug);
  }

  return (
    <BlogListClient
      tenant={tenant}
      seriesGroups={series}
      standalonePosts={standalone}
      tags={tags}
      accent={config.themeAccent ?? "indigo"}
      imageMap={imageMap}
    />
  );
}
