import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { password, action, user } = await req.json();

    // Verificar que el que llama es superadmin
    const { data: caller } = await supabase
      .from("admin_users")
      .select("role")
      .eq("password", password)
      .single();

    if (!caller || caller.role !== "superadmin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (action === "list") {
      const { data } = await supabase.from("admin_users").select("id,name,role,created_at").order("created_at");
      return NextResponse.json({ users: data });
    }

    if (action === "create") {
      const { data, error } = await supabase.from("admin_users").insert(user).select().single();
      if (error) throw error;
      return NextResponse.json({ ok: true, user: data });
    }

    if (action === "update") {
      const { data, error } = await supabase.from("admin_users").update(user).eq("id", user.id).select().single();
      if (error) throw error;
      return NextResponse.json({ ok: true, user: data });
    }

    if (action === "delete") {
      await supabase.from("admin_users").delete().eq("id", user.id);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Acción desconocida" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
