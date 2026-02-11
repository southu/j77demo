import { notFound } from "next/navigation";
import { discoverTenants } from "@/lib/tenants";
import { loadAllContent, getAllTags } from "@/lib/content";
import { loadTenantConfig } from "@/lib/tenants";
import { ContentCard } from "@/components/content/ContentCard";

export async function generateStaticParams() {
  const tenants = discoverTenants();
  const params: { tenant: string; tag: string }[] = [];
  for (const tenant of tenants) {
    const tags = getAllTags(tenant);
    for (const tag of tags) params.push({ tenant, tag });
  }
  return params;
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tenant: string; tag: string }>;
}) {
  const { tenant, tag } = await params;
  const config = loadTenantConfig(tenant);
  const tags = getAllTags(tenant);
  if (!tags.includes(tag)) notFound();

  const { blog, resources } = loadAllContent(tenant);
  const filtered = [...blog, ...resources].filter((item) => item.tags.includes(tag));
  const sorted = filtered.sort((a, b) => (b.date > a.date ? 1 : -1));
  const accent = config.themeAccent ?? "indigo";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-stone-900">Tag: {tag}</h1>
      <p className="text-stone-500">{sorted.length} items</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((item) => (
          <ContentCard key={`${item.type}-${item.slug}`} tenant={tenant} item={item} accent={accent} />
        ))}
      </div>
    </div>
  );
}
