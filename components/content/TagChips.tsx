import Link from "next/link";

export function TagChips({
  tenant,
  tags,
  accent = "indigo",
}: {
  tenant: string;
  tags: string[];
  accent?: string;
}) {
  const chipClass =
    accent === "emerald"
      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
      : accent === "blue"
        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
        : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";

  if (tags.length === 0) return null;
  const base = `/${encodeURIComponent(tenant)}`;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`${base}/tags/${encodeURIComponent(tag)}`}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${chipClass}`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
