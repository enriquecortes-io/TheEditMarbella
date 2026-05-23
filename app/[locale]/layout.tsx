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
      <link rel="preload" href="/videos/HeroHeader.mp4" as="video" type="video/mp4"/>
      <link rel="preload" href="/fonts/cormorant-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
      <link rel="preload" href="/fonts/montserrat-300.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
      <link rel="stylesheet" href="/fonts/fonts.css"/>
      <body style={{ background: "#000", margin: 0 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "The Edit Marbella",
          "description": "Exclusive ultra-luxury properties on the Costa del Sol.",
          "url": "https://mdlm-xi.vercel.app",
          "areaServed": ["Marbella", "Estepona", "Sotogrande", "Costa del Sol"],
          "priceRange": "€€€€€",
          "address": { "@type": "PostalAddress", "addressRegion": "Andalucía", "addressCountry": "ES" }
        })}} />
        <SkyBackground />{children}<CookieBanner /><LegalFooter /></body>
    </html>
  );
}
