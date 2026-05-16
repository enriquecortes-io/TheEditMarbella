import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error:"Unauthorized" }, { status:401 });
    }
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending:false });
    if (error) throw error;
    return NextResponse.json({ properties: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status:500 });
  }
}
