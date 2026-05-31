import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies — The Edit Marbella",
  robots: "noindex",
};

const S = { marginBottom:"3rem" } as const;
const H2 = { fontSize:"0.75rem", fontWeight:600, color:"#1A1714", letterSpacing:"0.15em", textTransform:"uppercase" as const, marginBottom:"1rem" };
const P = { lineHeight:1.9, fontSize:"0.9rem", color:"#4A4540", fontWeight:300 };

export default async function CookiesPage({ params }: { params: Promise<{locale:string}> }) {
  const { locale } = await params;
  return (
    <div style={{ minHeight:"100vh", background:"#FAF8F4", padding:"8rem clamp(2rem,10vw,12rem) 4rem", fontFamily:"'Montserrat','Helvetica Neue',sans-serif" }}>
      <div style={{ maxWidth:"800px", margin:"0 auto" }}>
        <p style={{ color:"#2D4A3E", fontSize:"0.5rem", letterSpacing:"0.5em", textTransform:"uppercase", marginBottom:"1rem" }}>The Edit Marbella</p>
        <h1 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:300, color:"#1A1714", marginBottom:"4rem", fontFamily:"'Cormorant Garamond',serif" }}>Política de Cookies</h1>

        <section style={S}>
          <h2 style={H2}>1. ¿Qué son las cookies?</h2>
          <p style={P}>Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que el sitio recuerde sus preferencias y mejoren su experiencia de navegación.</p>
        </section>

        <section style={S}>
          <h2 style={H2}>2. Cookies que utilizamos</h2>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.85rem", color:"#4A4540", fontWeight:300 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid #DDD8D0" }}>
                {["Cookie","Tipo","Finalidad","Duración"].map(h=>(
                  <th key={h} style={{ padding:"10px", textAlign:"left", color:"#1A1714", fontWeight:600, fontSize:"0.6rem", letterSpacing:"0.1em", textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["mdlm_admin_user","Técnica","Mantener sesión del panel de administración","Sesión"],
                ["mdlm_cookie_consent","Preferencia","Recordar su elección sobre cookies","1 año"],
              ].map(([name,tipo,fin,dur])=>(
                <tr key={name} style={{ borderBottom:"1px solid #F2EDE4" }}>
                  <td style={{ padding:"10px", fontFamily:"monospace", fontSize:"0.8rem", color:"#2D4A3E" }}>{name}</td>
                  <td style={{ padding:"10px" }}>{tipo}</td>
                  <td style={{ padding:"10px" }}>{fin}</td>
                  <td style={{ padding:"10px" }}>{dur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={S}>
          <h2 style={H2}>3. Cómo gestionar las cookies</h2>
          <p style={P}>Puede configurar su navegador para rechazar o eliminar cookies. Sin embargo, esto puede afectar al funcionamiento del sitio. Consulte la ayuda de su navegador para más información.</p>
        </section>

        <div style={{ borderTop:"1px solid #DDD8D0", paddingTop:"2rem", marginTop:"4rem" }}>
          <a href={`/${locale}`} style={{ color:"#2D4A3E", fontSize:"0.5rem", letterSpacing:"0.4em", textTransform:"uppercase", textDecoration:"none" }}>← Volver</a>
        </div>
      </div>
    </div>
  );
}
