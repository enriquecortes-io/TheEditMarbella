import type { Metadata } from "next";
import SkyBackground from "@/components/SkyBackground";
import CookieBanner from "@/components/CookieBanner";
import LegalFooter from "@/components/LegalFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { notFound } from "next/navigation";

const locales = ["en", "es", "fr", "ru"];

const META: Record<string, { title: string; description: string }> = {
  es: {
    title: "The Edit Marbella | Propiedades Ultra-Exclusivas",
    description: "Propiedades ultra-exclusivas en Marbella, Estepona, Sotogrande y la Costa del Sol. Visitas privadas con cita previa.",
  },
  en: {
    title: "The Edit Marbella | Ultra-Luxury Properties",
    description: "Exclusive ultra-luxury properties in Marbella, Estepona, Sotogrande and the Costa del Sol. Private viewings by appointment.",
  },
  fr: {
    title: "The Edit Marbella | Propriétés Ultra-Luxe",
    description: "Propriétés ultra-luxe exclusives à Marbella, Estepona, Sotogrande et la Costa del Sol. Visites privées sur rendez-vous.",
  },
  ru: {
    title: "The Edit Marbella | Элитная Недвижимость",
    description: "Эксклюзивная элитная недвижимость в Марбелье, Эстепоне, Сотогранде и на Коста-дель-Соль. Частные показы по записи.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale] || META["en"];
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: "The Edit Marbella",
      description: m.description,
      images: [{ url:"https://mdlm-xi.vercel.app/og-default.jpg", width:1200, height:630 }],
      type: "website",
      siteName: "The Edit Marbella",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: "The Edit Marbella",
      description: m.description,
    },
  };
}

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
      
      <link rel="preload" href="/fonts/cormorant-600.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
      <link rel="preload" href="/fonts/montserrat-300.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/>
      <link rel="stylesheet" href="/fonts/fonts.css"/>
      <body style={{ background: "#FAFAF7", margin: 0 }}>
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wvt1b8ox5g");` }}/>
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
        <SkyBackground />{children}<CookieBanner /><LegalFooter /><WhatsAppButton /></body>
    </html>
  );
}
