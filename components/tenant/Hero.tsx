import type { TenantConfig } from "@/lib/tenants";
import type { SeedData } from "@/lib/seed";

const accentGradient: Record<string, string> = {
  indigo: "from-indigo-600 to-indigo-500",
  blue: "from-blue-600 to-blue-500",
  emerald: "from-emerald-600 to-emerald-500",
  violet: "from-violet-600 to-purple-500",
  purple: "from-purple-600 to-purple-500",
};

export function Hero({
  config,
  seed,
}: {
  config: TenantConfig;
  seed: SeedData | null;
}) {
  const headline = seed?.headlines?.[0] ?? config.tagline ?? config.displayName;
  const sub = seed?.metaDescription ?? seed?.aboutSummary ?? config.tagline ?? "";
  const gradient = accentGradient[config.themeAccent] ?? accentGradient.indigo;

  return (
    <section className="animate-fade-in relative overflow-hidden rounded-3xl">
      <div className={`bg-gradient-to-br ${gradient} px-8 py-16 md:py-20 text-center`}>
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90">
            {config.displayName}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl leading-tight">
            {headline}
          </h1>
          {sub && (
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 leading-relaxed">
              {sub}
            </p>
          )}
        </div>
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>
    </section>
  );
}
