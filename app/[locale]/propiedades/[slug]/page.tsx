import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PropertyExperience from "@/components/Experience/PropertyExperience";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const { data } = await supabase.from("properties").select("slug");
  const slugs = data?.map(p => p.slug) || [];
  const locales = ["es", "en", "fr", "ru"];
  return locales.flatMap(locale => slugs.map(slug => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const { data: property } = await supabase
    .from("properties")
    .select("titulo, descripcion, precio, ubicacion, galeria_urls, m2_construidos, habitaciones")
    .eq("slug", slug)
    .single();

  if (!property) return { title: "Edit Marbella" };

  const titulo = typeof property.titulo === "object"
    ? property.titulo[locale] || property.titulo.es || property.titulo.en || ""
    : property.titulo || "";

  const desc = typeof property.descripcion === "object"
    ? property.descripcion[locale] || property.descripcion.es || property.descripcion.en || ""
    : property.descripcion || "";

  const firstSentence = desc.match(/^[^.!?\n]+[.!?]?/)?.[0]?.trim() || desc.slice(0, 160);
  const ogImage = property.galeria_urls?.[0] || "";
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `https://mdlm-xi.vercel.app${ogImage}`;
  const precio = property.precio ? `€${(property.precio/1000000).toFixed(1)}M` : "";

  const metaDesc = `${firstSentence} ${precio} · ${property.ubicacion || "Marbella"} · ${property.m2_construidos || ""}m² · ${property.habitaciones || ""} hab.`.trim();

  return {
    title: `${titulo} — Edit Marbella`,
    description: metaDesc,
    openGraph: {
      title: `${titulo} — MDLM`,
      description: metaDesc,
      images: ogImageUrl ? [{ url: ogImageUrl, width:1200, height:630, alt: titulo }] : [],
      type: "website",
      locale: locale,
      siteName: "Edit Marbella",
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} — MDLM`,
      description: metaDesc,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: `https://mdlm-xi.vercel.app/${locale}/propiedades/${slug}`,
      languages: {
        "es": `https://mdlm-xi.vercel.app/es/propiedades/${slug}`,
        "en": `https://mdlm-xi.vercel.app/en/propiedades/${slug}`,
        "fr": `https://mdlm-xi.vercel.app/fr/propiedades/${slug}`,
        "ru": `https://mdlm-xi.vercel.app/ru/propiedades/${slug}`,
      },
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { locale, slug } = await params;

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("activa", true)
    .single();

  if (!property) notFound();

  return <PropertyExperience property={property} locale={locale} />;
}
