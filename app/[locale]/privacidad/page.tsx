import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — The Edit Marbella",
  robots: "noindex",
};

const S = { marginBottom:"3rem" } as const;
const H2 = { fontSize:"0.75rem", fontWeight:600, color:"#1A1714", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginBottom:"1rem" };
const P = { lineHeight:1.9, fontSize:"0.9rem", color:"#4A4540", fontWeight:300 };

export default async function PrivacidadPage({ params }: { params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return (
    <div style={{ minHeight:"100vh", background:"#FAF8F4", padding:"8rem clamp(2rem,10vw,12rem) 4rem", fontFamily:"'Montserrat','Helvetica Neue',sans-serif" }}>
      <div style={{ maxWidth:"800px", margin:"0 auto" }}>
        <p style={{ color:"#2D4A3E", fontSize:"0.5rem", letterSpacing:"0.5em", textTransform:"uppercase", marginBottom:"1rem" }}>The Edit Marbella</p>
        <h1 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:300, color:"#1A1714", marginBottom:"4rem", fontFamily:"'Cormorant Garamond',serif" }}>Política de Privacidad</h1>

        <section style={S}>
          <h2 style={H2}>1. Responsable del tratamiento</h2>
          <p style={P}>Enrique Cortés Gómez, con domicilio en Marbella, Málaga, España. Email: enriquecortesgomez@gmail.com</p>
        </section>

        <section style={S}>
          <h2 style={H2}>2. Datos que recopilamos</h2>
          <p style={P}>Recopilamos los datos que usted nos facilita voluntariamente a través de los formularios de contacto: nombre, email, teléfono y mensaje. No recopilamos datos especialmente sensibles.</p>
        </section>

        <section style={S}>
          <h2 style={H2}>3. Finalidad del tratamiento</h2>
          <p style={P}>Sus datos se utilizan exclusivamente para responder a sus consultas sobre propiedades y prestarle el servicio de intermediación inmobiliaria solicitado. No se utilizarán para fines comerciales sin su consentimiento expreso.</p>
        </section>

        <section style={S}>
          <h2 style={H2}>4. Base legal</h2>
          <p style={P}>El tratamiento de sus datos se basa en el consentimiento otorgado al enviar el formulario de contacto (art. 6.1.a del RGPD) y en el interés legítimo de gestionar la relación precontractual (art. 6.1.b del RGPD).</p>
        </section>

        <section style={S}>
          <h2 style={H2}>5. Conservación de datos</h2>
          <p style={P}>Sus datos se conservarán durante el tiempo necesario para atender su consulta y, en su caso, durante la relación contractual. Transcurrido dicho período, los datos serán eliminados de forma segura.</p>
        </section>

        <section style={S}>
          <h2 style={H2}>6. Sus derechos</h2>
          <p style={P}>Tiene derecho a acceder, rectificar, suprimir, limitar el tratamiento y portabilidad de sus datos. Puede ejercer estos derechos enviando un email a enriquecortesgomez@gmail.com. También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).</p>
        </section>

        <div style={{ borderTop:"1px solid #DDD8D0", paddingTop:"2rem", marginTop:"4rem" }}>
          <a href={`/${locale}`} style={{ color:"#2D4A3E", fontSize:"0.5rem", letterSpacing:"0.4em", textTransform:"uppercase", textDecoration:"none" }}>← Volver</a>
        </div>
      </div>
    </div>
  );
}
