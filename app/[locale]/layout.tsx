import type { Metadata } from "next";
import SkyBackground from "@/components/SkyBackground";
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

  return (
    <html lang={locale}>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Montserrat:wght@200;300;400&family=Fraunces:opsz,wght@9..144,900&display=swap" rel="stylesheet"/>
      <body style={{ background: "#000", margin: 0 }}>
        <SkyBackground />{children}</body>
    </html>
  );
}
