import type { Metadata } from "next";
import SkyBackground from "@/components/SkyBackground";
import CookieBanner from "@/components/CookieBanner";
import LegalFooter from "@/components/LegalFooter";
import { notFound } from "next/navigation";

const locales = ["en", "es", "fr", "ru"];

export const metadata: Metadata = {
  title: "Edit Marbella | Ultra-Luxury Properties",
  description: "Exclusive ultra-luxury properties in Marbella, Estepona, Sotogrande and the Costa del Sol. Private viewings by appointment.",
  openGraph: {
    title: "Edit Marbella",
    description: "Exclusive ultra-luxury properties on the Costa del Sol.",
    images: [{ url:"https://mdlm-xi.vercel.app/og-default.jpg", width:1200, height:630 }],
    type: "website",
    siteName: "Edit Marbella",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edit Marbella",
    description: "Exclusive ultra-luxury properties on the Costa del Sol.",
  },
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
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap" rel="stylesheet"/>
      <body style={{ background: "#000", margin: 0 }}>
        <SkyBackground />{children}<CookieBanner /><LegalFooter /></body>
    </html>
  );
}
