import { discoverTenants } from "@/lib/tenants";
import { loadAllContent, getAllTags } from "@/lib/content";
import { loadTenantConfig } from "@/lib/tenants";
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
  return (
    <BlogListClient
      tenant={tenant}
      posts={blog}
      tags={tags}
      accent={config.themeAccent ?? "indigo"}
    />
  );
}
