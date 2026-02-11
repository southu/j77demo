import Link from "next/link";
import { TenantNav } from "./TenantNav";
import type { TenantConfig } from "@/lib/tenants";

const accentText: Record<string, string> = {
  indigo: "text-indigo-600",
  blue: "text-blue-600",
  emerald: "text-emerald-600",
  violet: "text-violet-600",
  purple: "text-purple-600",
};

export function TenantShell({
  tenant,
  config,
  children,
}: {
  tenant: string;
  config: TenantConfig;
  children: React.ReactNode;
}) {
  const logoColor = accentText[config.themeAccent] ?? accentText.indigo;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="." className={`text-xl font-bold tracking-tight ${logoColor}`}>
            {config.logoText}
          </Link>
          <TenantNav tenant={tenant} config={config} />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 bg-stone-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="." className="text-stone-500 hover:text-stone-800 transition-colors">Home</Link>
              <Link href="blog" className="text-stone-500 hover:text-stone-800 transition-colors">Blog</Link>
              <Link href="resources" className="text-stone-500 hover:text-stone-800 transition-colors">Resources</Link>
            </div>
            <span className={`text-sm font-semibold ${logoColor}`}>{config.logoText}</span>
          </div>
          <p className="mt-6 text-xs text-stone-400 leading-relaxed">
            Demo site — content is generated and summarized for demonstration purposes only. This is not affiliated with or endorsed by {config.displayName}.
          </p>
        </div>
      </footer>
    </div>
  );
}
