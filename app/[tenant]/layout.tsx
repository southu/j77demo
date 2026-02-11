import React from "react";
import { notFound } from "next/navigation";
import { discoverTenants, loadTenantConfig } from "@/lib/tenants";
import { TenantShell } from "@/components/tenant/TenantShell";

export function generateStaticParams() {
  const tenants = discoverTenants();
  return tenants.map((tenant) => ({ tenant }));
}

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const tenants = discoverTenants();
  if (!tenants.includes(tenant)) notFound();
  const config = loadTenantConfig(tenant);
  return <TenantShell tenant={tenant} config={config}>{children}</TenantShell>;
}
