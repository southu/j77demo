import { discoverTenants } from "@/lib/tenants";
import { loadAllContent, getAllTags } from "@/lib/content";
import { loadTenantConfig } from "@/lib/tenants";
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
  return (
    <ResourcesListClient
      tenant={tenant}
      items={resources}
      tags={tags}
      accent={config.themeAccent ?? "indigo"}
    />
  );
}
