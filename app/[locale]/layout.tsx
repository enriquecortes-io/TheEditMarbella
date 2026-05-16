import type { Metadata } from "next";
import SkyBackground from "@/components/SkyBackground";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const locales = ["en", "es", "fr", "ru"];

export const metadata: Metadata = {
  title: "Million Dollars Listing Marbella",
  description: "Ultra-luxury properties in Marbella",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || headersList.get("x-pathname") || "";
  const isAdmin = pathname.includes("/admin");

  return (
    <html lang={locale}>
      <body style={{ background: "#000", margin: 0 }}>
        {!isAdmin && <SkyBackground />}{children}</body>
    </html>
  );
}
