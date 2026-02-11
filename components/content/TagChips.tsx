import Link from "next/link";

const chipAccent: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
  blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  violet: "bg-violet-50 text-violet-700 hover:bg-violet-100",
  purple: "bg-purple-50 text-purple-700 hover:bg-purple-100",
};

export function TagChips({
  tenant,
  tags,
  accent = "indigo",
}: {
  tenant: string;
  tags: string[];
  accent?: string;
}) {
  if (tags.length === 0) return null;
  const base = `/${encodeURIComponent(tenant)}`;
  const cls = chipAccent[accent] ?? chipAccent.indigo;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`${base}/tags/${encodeURIComponent(tag)}`}
          className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${cls}`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
