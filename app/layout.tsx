import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "J77 Demo – Multi-tenant Microsites",
  description: "Lite microsite platform for demo.j77.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
