import { createClient } from "@supabase/supabase-js";
import { Property } from "@/types/property";
import PropertiesExperience from "@/components/Properties/PropertiesExperience";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ zona?: string; tipo?: string; precio?: string }>;
}

// Mapeo de rangos de precio a valores numéricos
const PRECIO_RANGES: Record<string, { min: number; max?: number }> = {
  "500k-1m": { min: 500000,   max: 1000000 },
  "1m-2m":   { min: 1000000,  max: 2000000 },
  "2m-5m":   { min: 2000000,  max: 5000000 },
  "5m+":     { min: 5000000 },
};

export default async function PropertiesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { zona, tipo, precio } = await searchParams;

  // Construir query Supabase con filtros
  let query = supabase
    .from("properties")
    .select("*")
    .eq("activa", true);

  // Filtro zona — busca en ubicacion o localidad
  if (zona) {
    query = query.or(`ubicacion.ilike.%${zona}%,localidad.ilike.%${zona}%`);
  }

  // Filtro tipo — villa, atico, etc
  if (tipo) {
    query = query.eq("tipo", tipo);
  }

  // Filtro precio — rango numérico
  if (precio && PRECIO_RANGES[precio]) {
    const range = PRECIO_RANGES[precio];
    query = query.gte("precio", range.min);
    if (range.max) query = query.lte("precio", range.max);
  }

  const { data, error } = await query.order("destacada", { ascending: false });

  const properties: Property[] = error ? [] : (data || []);

  return (
    <PropertiesExperience
      properties={properties}
      locale={locale}
      filters={{ zona, tipo, precio }}
    />
  );
}
