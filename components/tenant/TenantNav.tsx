"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { TenantConfig } from "@/lib/tenants";

const accentActive: Record<string, string> = {
  indigo: "text-indigo-600",
  blue: "text-blue-600",
  emerald: "text-emerald-600",
  violet: "text-violet-600",
  purple: "text-purple-600",
};

export function TenantNav({
  tenant,
  config,
}: {
  tenant: string;
  config: TenantConfig;
}) {
  const pathname = usePathname();
  const activeColor = accentActive[config.themeAccent] ?? accentActive.indigo;
  const tenantRoot = `/${encodeURIComponent(tenant)}`;
  const isOnTenantHome = pathname === tenantRoot || pathname === `${tenantRoot}/`;

  const mainLinks = [
    { href: isOnTenantHome ? "." : "..", label: "Home" },
    { href: "blog", label: "Blog" },
    { href: "resources", label: "Resources" },
  ];

  const navLinks = [...mainLinks, ...(config.navLinks ?? [])].map((l) => ({
    ...l,
    href: l.href.startsWith("http") ? l.href : l.href.startsWith("/") ? l.href.slice(1) : l.href,
  }));

  return (
    <nav className="flex items-center gap-1">
      {navLinks.map((link) => {
        const isActive =
          link.label === "Home"
            ? isOnTenantHome
            : pathname.endsWith(link.href) || pathname.includes(`/${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              isActive
                ? `${activeColor} bg-stone-100`
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
