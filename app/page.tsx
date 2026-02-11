import Link from "next/link";
import { discoverTenants, loadTenantConfig } from "@/lib/tenants";

export default function HomePage() {
  const tenants = discoverTenants();
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-2xl font-semibold text-stone-900">J77 Demo</h1>
          <p className="mt-1 text-stone-600">Multi-tenant lite microsites</p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-lg font-medium text-stone-700">Tenants</h2>
        {tenants.length === 0 ? (
          <p className="mt-4 text-stone-500">
            No tenants yet. Add folders under <code className="rounded bg-stone-200 px-1">demo-assets/</code> or run{" "}
            <code className="rounded bg-stone-200 px-1">npm run ingest -- --source J77Output/diagpartners</code> to create one from a zip.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => {
              const config = loadTenantConfig(tenant);
              return (
                <li key={tenant}>
                  <Link
                    href={`/${encodeURIComponent(tenant)}`}
                    className="block animate-fade-in rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                  >
                    <span className="font-medium text-stone-900">{config.displayName}</span>
                    <span className="mt-1 block text-sm text-stone-500">
                      {config.tagline || "Demo microsite"}
                    </span>
                    <span className="mt-2 inline-block text-sm text-indigo-600">
                      View demo →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
