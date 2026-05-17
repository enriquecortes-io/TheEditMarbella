import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, horizon, propertyTitle, propertySlug, locale } = body;

    // Guardar en Supabase
    await supabase.from("leads").insert({
      name, email, phone, horizon,
      property_title: propertyTitle,
      property_slug: propertySlug,
      locale,
      created_at: new Date().toISOString(),
    });

    // Enviar email de notificación
    await resend.emails.send({
      from: "MDLM <onboarding@resend.dev>",
      to: "enriquecortesgomez@gmail.com",
      subject: `Nueva solicitud de visita privada — ${propertyTitle}`,
      html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:40px;background:#0a0805;color:white;">
          <p style="color:#c9a96e;font-size:11px;letter-spacing:0.5em;text-transform:uppercase;margin:0 0 24px">
            MILLION DOLLARS LISTING MARBELLA
          </p>
          <h1 style="font-size:24px;font-weight:300;color:white;margin:0 0 8px">
            Nueva Solicitud de Visita Privada
          </h1>
          <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 32px">
            ${propertyTitle}
          </p>
          <div style="border-top:1px solid rgba(201,169,110,0.2);padding-top:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:0.3em;width:140px">Nombre</td>
                  <td style="padding:8px 0;color:white;font-size:14px">${name}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:0.3em">Email</td>
                  <td style="padding:8px 0;color:white;font-size:14px">${email}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:0.3em">Teléfono</td>
                  <td style="padding:8px 0;color:white;font-size:14px">${phone}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:0.3em">Horizonte</td>
                  <td style="padding:8px 0;color:#c9a96e;font-size:14px;font-weight:600">${horizon}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;text-transform:uppercase;letter-spacing:0.3em">Idioma</td>
                  <td style="padding:8px 0;color:white;font-size:14px">${locale?.toUpperCase()}</td></tr>
            </table>
          </div>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08)">
            <a href="https://mdlm-xi.vercel.app/${locale}/propiedades/${propertySlug}"
              style="color:#c9a96e;font-size:12px;letter-spacing:0.3em;text-transform:uppercase;text-decoration:none">
              Ver propiedad →
            </a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
