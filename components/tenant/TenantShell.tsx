import Link from "next/link";
import { TenantNav } from "./TenantNav";
import type { TenantConfig } from "@/lib/tenants";

export function TenantShell({
  tenant,
  config,
  children,
}: {
  tenant: string;
  config: TenantConfig;
  children: React.ReactNode;
}) {
  const base = `/${encodeURIComponent(tenant)}`;
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href={base} className="text-xl font-semibold text-stone-900">
            {config.logoText}
          </Link>
          <TenantNav tenant={tenant} config={config} />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="mt-16 border-t border-stone-200 bg-stone-100/80">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href={base} className="text-stone-600 hover:text-stone-900">
              Home
            </Link>
            <Link href={`${base}/blog`} className="text-stone-600 hover:text-stone-900">
              Blog
            </Link>
            <Link href={`${base}/resources`} className="text-stone-600 hover:text-stone-900">
              Resources
            </Link>
          </div>
          <p className="mt-4 text-xs text-stone-500">
            Demo site. Content is generated/summarized for demonstration purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
