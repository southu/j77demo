import Link from "next/link";
import { loadSeed } from "@/lib/seed";
import { loadTenantConfig } from "@/lib/tenants";
import { loadAllContent } from "@/lib/content";
import { getFeaturedImageUrl } from "@/lib/featured-image";
import { Hero } from "@/components/tenant/Hero";
import { ContentCard } from "@/components/content/ContentCard";

export default async function TenantHomePage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const config = loadTenantConfig(tenant);
  const seed = loadSeed(tenant);
  const { blog, resources } = loadAllContent(tenant);
  const latestBlog = blog.slice(0, 3);
  const latestResources = resources.slice(0, 3);

  const featureTitles = seed?.featureTitles ?? [
    "Understand your market",
    "Engage your audience",
    "Measure what matters",
  ];
  const featureDescriptions = seed?.featureDescriptions ?? [
    "Get clarity on trends and opportunities.",
    "Create content that resonates.",
    "Track impact with simple metrics.",
  ];
  const valueProps = seed?.valueProps ?? config.homeSections?.whatWeDo ?? [
    "Practical insights",
    "Clear next steps",
    "Trusted approach",
  ];
  const accent = config.themeAccent ?? "indigo";

  const accentBtn =
    accent === "violet" ? "bg-violet-600 hover:bg-violet-700"
    : accent === "purple" ? "bg-purple-600 hover:bg-purple-700"
    : accent === "emerald" ? "bg-emerald-600 hover:bg-emerald-700"
    : accent === "blue" ? "bg-blue-600 hover:bg-blue-700"
    : "bg-indigo-600 hover:bg-indigo-700";

  const accentFeatureBorder =
    accent === "violet" ? "border-violet-200 hover:border-violet-300"
    : accent === "purple" ? "border-purple-200 hover:border-purple-300"
    : accent === "emerald" ? "border-emerald-200 hover:border-emerald-300"
    : accent === "blue" ? "border-blue-200 hover:border-blue-300"
    : "border-indigo-200 hover:border-indigo-300";

  const accentNum =
    accent === "violet" ? "text-violet-500"
    : accent === "purple" ? "text-purple-500"
    : accent === "emerald" ? "text-emerald-500"
    : accent === "blue" ? "text-blue-500"
    : "text-indigo-500";

  return (
    <div className="space-y-20">
      <Hero config={config} seed={seed} />

      {/* Overview */}
      {(seed?.aboutSummary || valueProps.length > 0) && (
        <section className="animate-fade-in mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">What drives us</h2>
          {seed?.aboutSummary && (
            <p className="mt-4 text-lg text-stone-500 leading-relaxed">{seed.aboutSummary}</p>
          )}
          {valueProps.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {valueProps.slice(0, 5).map((v, i) => (
                <span key={i} className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-600">
                  {v.length > 80 ? v.slice(0, 77) + "…" : v}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Feature cards */}
      <section className="animate-fade-in">
        <h2 className="text-center text-2xl font-bold tracking-tight text-stone-900">Key capabilities</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${accentFeatureBorder}`}
            >
              <span className={`text-3xl font-bold ${accentNum}`}>0{i + 1}</span>
              <h3 className="mt-3 text-base font-semibold text-stone-900">
                {Array.isArray(featureTitles) ? featureTitles[i] : featureTitles}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                {Array.isArray(featureDescriptions) ? featureDescriptions[i] : featureDescriptions}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="animate-fade-in text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Trusted by teams at</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {["Enterprise Co.", "Growth Inc.", "Scale Corp."].map((name) => (
            <span key={name} className="rounded-lg bg-stone-100 px-5 py-2.5 text-sm font-medium text-stone-500">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Featured content */}
      {(latestBlog.length > 0 || latestResources.length > 0) && (
        <section className="animate-fade-in">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Latest content</h2>
          <p className="mt-2 text-stone-500">Recent posts and resources.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestBlog.map((item) => (
              <ContentCard key={item.slug} tenant={tenant} item={item} accent={accent} imageUrl={getFeaturedImageUrl(tenant, item.slug)} />
            ))}
            {latestResources.map((item) => (
              <ContentCard key={item.slug} tenant={tenant} item={item} accent={accent} imageUrl={getFeaturedImageUrl(tenant, item.slug)} />
            ))}
          </div>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="blog" className={`rounded-full px-6 py-2.5 text-sm font-semibold text-white transition ${accentBtn}`}>
              Explore blog
            </Link>
            <Link href="resources" className="rounded-full border border-stone-300 bg-white px-6 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50">
              View resources
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
