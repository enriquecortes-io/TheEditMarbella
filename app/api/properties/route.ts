import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("slug,titulo,descripcion,precio,ubicacion,zona,tipo,m2_construidos,m2_parcela,habitaciones,banos,galeria_urls")
      .eq("activa", true)
      .order("created_at", { ascending: false })
      .limit(5);
    if (error) throw error;
    return NextResponse.json({ properties: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
