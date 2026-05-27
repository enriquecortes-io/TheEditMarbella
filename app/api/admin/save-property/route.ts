import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TIPO_PREFIX: Record<string, string> = {
  "villa":      "VILLA",
  "apartment":  "APT",
  "townhouse":  "TH",
  "plot":       "PLOT",
  "penthouse":  "PH",
};

async function generateRef(tipo: string): Promise<string> {
  const prefix = TIPO_PREFIX[tipo] || "PRO";

  // Contar propiedades con el mismo prefijo
  const { count } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .like("referencia", `${prefix}-%`);

  const num = 110 + (count || 0);
  return `${prefix}-${num}`;
}

export async function POST(req: NextRequest) {
  try {
    const { password, property } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generar referencia si no tiene una ya
    if (!property.referencia && property.tipo) {
      property.referencia = await generateRef(property.tipo);
    }

    // Limpiar campos numéricos vacíos
    const numFields = ["habitaciones","banos","m2_construidos","m2_parcela","precio","garajes","trasteros","planta","ano_construccion"];
    for (const f of numFields) {
      if (property[f] === "" || property[f] === null || (typeof property[f] === "number" && isNaN(property[f]))) {
        delete property[f];
      }
    }

    const { data, error } = await supabase
      .from("properties")
      .upsert(property, { onConflict: "slug" })
      .select();

    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
