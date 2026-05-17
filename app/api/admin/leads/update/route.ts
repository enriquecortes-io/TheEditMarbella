import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { password, id, agente, notas } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error:"Unauthorized" }, { status:401 });
    }

    const updates: Record<string, any> = {};
    if (agente !== undefined) updates.agente = agente;
    if (notas !== undefined) updates.notas = notas;

    await supabase.from("leads").update(updates).eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status:500 });
  }
}
