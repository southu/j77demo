import { discoverTenants } from "@/lib/tenants";
import { loadAllContent, getAllTags } from "@/lib/content";
import { loadTenantConfig } from "@/lib/tenants";
import { getFeaturedImageUrl } from "@/lib/featured-image";
import { ResourcesListClient } from "./ResourcesListClient";

export function generateStaticParams() {
  return discoverTenants().map((tenant) => ({ tenant }));
}

export default async function ResourcesListPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const config = loadTenantConfig(tenant);
  const { resources } = loadAllContent(tenant);
  const tags = getAllTags(tenant);

  const imageMap: Record<string, string | null> = {};
  for (const r of resources) {
    imageMap[r.slug] = getFeaturedImageUrl(tenant, r.slug);
  }

  return (
    <ResourcesListClient
      tenant={tenant}
      items={resources}
      tags={tags}
      accent={config.themeAccent ?? "indigo"}
      imageMap={imageMap}
    />
  );
}
