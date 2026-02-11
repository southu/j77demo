import { loadTenantConfig } from "@/lib/tenants";
import { discoverTenants } from "@/lib/tenants";

export function generateStaticParams() {
  return discoverTenants().map((tenant) => ({ tenant }));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const config = loadTenantConfig(tenant);
  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-semibold text-stone-900">Contact {config.displayName}</h1>
      <p className="mt-4 text-stone-600">
        This is a demo microsite. Add a contact form or link by customizing this page.
      </p>
    </div>
  );
}
