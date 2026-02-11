"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TenantConfig } from "@/lib/tenants";

const accentClasses: Record<string, string> = {
  indigo: "text-indigo-600 hover:text-indigo-700",
  blue: "text-blue-600 hover:text-blue-700",
  emerald: "text-emerald-600 hover:text-emerald-700",
  violet: "text-violet-600 hover:text-violet-700",
  purple: "text-purple-600 hover:text-purple-700",
};

export function TenantNav({
  tenant,
  config,
}: {
  tenant: string;
  config: TenantConfig;
}) {
  const pathname = usePathname();
  const base = `/${encodeURIComponent(tenant)}`;
  const accent = accentClasses[config.themeAccent] ?? accentClasses.indigo;

  const mainLinks = [
    { href: base, label: "Home" },
    { href: `${base}/blog`, label: "Blog" },
    { href: `${base}/resources`, label: "Resources" },
  ];

  const navLinks = [...mainLinks, ...(config.navLinks ?? [])].map((l) => ({
    ...l,
    href: l.href.startsWith("http") ? l.href : l.href.startsWith("/") ? `${base}${l.href}` : `${base}/${l.href}`,
  }));

  return (
    <nav className="flex flex-wrap items-center gap-6">
      {navLinks.map((link) => {
        const isActive =
          link.href === base
            ? pathname === base
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition ${
              isActive ? accent : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
