import type { TenantConfig } from "@/lib/tenants";
import type { SeedData } from "@/lib/seed";

const accentBg: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-800",
  blue: "bg-blue-50 text-blue-800",
  emerald: "bg-emerald-50 text-emerald-800",
};

export function Hero({
  config,
  seed,
}: {
  config: TenantConfig;
  seed: SeedData | null;
}) {
  const headline = seed?.headlines?.[0] ?? config.tagline ?? config.displayName;
  const sub = seed?.aboutSummary ?? config.tagline ?? "";
  const accent = accentBg[config.themeAccent] ?? accentBg.indigo;

  return (
    <section
      className={`animate-fade-in rounded-2xl ${accent} px-8 py-12 text-center md:py-16`}
    >
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        {headline}
      </h1>
      {sub && (
        <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">{sub}</p>
      )}
    </section>
  );
}
