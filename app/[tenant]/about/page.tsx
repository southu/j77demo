import { loadTenantConfig } from "@/lib/tenants";
import { discoverTenants } from "@/lib/tenants";

export function generateStaticParams() {
  return discoverTenants().map((tenant) => ({ tenant }));
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const config = loadTenantConfig(tenant);
  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-semibold text-stone-900">About {config.displayName}</h1>
      <p className="mt-4 text-stone-600">
        This is a demo microsite. Add custom about content by creating this page or linking to an external URL in config.
      </p>
    </div>
  );
}
