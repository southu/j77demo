import Link from "next/link";
import { loadSeed } from "@/lib/seed";
import { loadTenantConfig } from "@/lib/tenants";
import { loadAllContent } from "@/lib/content";
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
  const base = `/${encodeURIComponent(tenant)}`;

  return (
    <div className="space-y-16">
      <Hero config={config} seed={seed} />

      {(seed?.aboutSummary || valueProps.length > 0) && (
        <section className="animate-fade-in">
          <h2 className="text-xl font-semibold text-stone-900">Homepage Overview</h2>
          {seed?.aboutSummary && (
            <p className="mt-2 text-stone-600">{seed.aboutSummary}</p>
          )}
          {valueProps.length > 0 && (
            <ul className="mt-4 list-inside list-disc space-y-1 text-stone-600">
              {valueProps.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="animate-fade-in">
        <h2 className="text-xl font-semibold text-stone-900">What we do</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-semibold text-stone-900">
                {Array.isArray(featureTitles) ? featureTitles[i] : featureTitles}
              </h3>
              <p className="mt-2 text-sm text-stone-600">
                {Array.isArray(featureDescriptions)
                  ? featureDescriptions[i]
                  : featureDescriptions}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="animate-fade-in rounded-xl border border-stone-200 bg-stone-100/50 p-8">
        <h2 className="text-lg font-semibold text-stone-900">Trusted by teams</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {["Company A", "Company B", "Company C"].map((name) => (
            <span
              key={name}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      <section className="animate-fade-in">
        <h2 className="text-xl font-semibold text-stone-900">Featured content</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestBlog.map((item) => (
            <ContentCard key={item.slug} tenant={tenant} item={item} accent={accent} />
          ))}
          {latestResources.map((item) => (
            <ContentCard key={item.slug} tenant={tenant} item={item} accent={accent} />
          ))}
        </div>
        {(blog.length > 0 || resources.length > 0) && (
          <div className="mt-8 flex gap-4">
            <Link
              href={`${base}/blog`}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                accent === "violet"
                  ? "bg-violet-600 hover:bg-violet-700"
                  : accent === "purple"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : accent === "emerald"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : accent === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Explore insights
            </Link>
            <Link
              href={`${base}/resources`}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              View resources
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
