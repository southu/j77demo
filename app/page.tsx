import Link from "next/link";
import { discoverTenants, loadTenantConfig } from "@/lib/tenants";

export default function HomePage() {
  const tenants = discoverTenants();
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-stone-200/60 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Demo Platform
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900">J77 Demo</h1>
          <p className="mt-3 text-lg text-stone-500">Multi-tenant lite microsites</p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-16">
        {tenants.length === 0 ? (
          <p className="text-center text-stone-500">
            No tenants yet. Add folders under <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">demo-assets/</code> or run{" "}
            <code className="rounded bg-stone-100 px-1.5 py-0.5 text-sm">npm run ingest</code> to create one.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => {
              const config = loadTenantConfig(tenant);
              return (
                <Link
                  key={tenant}
                  href={`/${encodeURIComponent(tenant)}`}
                  className="group animate-fade-in flex flex-col rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="text-lg font-bold text-stone-900 group-hover:text-indigo-600 transition-colors">
                    {config.displayName}
                  </span>
                  <span className="mt-2 text-sm text-stone-500 leading-relaxed">
                    {config.tagline || "Demo microsite"}
                  </span>
                  <span className="mt-auto pt-4 text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">
                    View demo →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
