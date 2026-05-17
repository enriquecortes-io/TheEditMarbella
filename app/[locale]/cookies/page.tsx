import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies — Edit Marbella",
  robots: "noindex",
};

export default async function CookiesPage({ params }: { params: Promise<{locale:string}> }) {
  const { locale } = await params;

  return (
    <div style={{
      minHeight:"100vh", background:"#080604", color:"rgba(255,255,255,0.8)",
      padding:"8rem clamp(2rem,10vw,12rem) 4rem",
      fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
    }}>
      <div style={{ maxWidth:"800px", margin:"0 auto" }}>

        <p style={{ color:"#c9a96e", fontSize:"0.55rem", letterSpacing:"0.5em", textTransform:"uppercase", marginBottom:"1rem" }}>
          Edit Marbella
        </p>
        <h1 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:300, color:"white", marginBottom:"4rem" }}>
          Política de Cookies
        </h1>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            1. ¿Qué son las cookies?
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten que el sitio recuerde sus preferencias y mejoren su experiencia de navegación.
          </p>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            2. Cookies que utilizamos
          </h2>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.85rem", fontWeight:200 }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.2)" }}>
                <th style={{ padding:"10px", textAlign:"left", color:"white", fontWeight:600 }}>Cookie</th>
                <th style={{ padding:"10px", textAlign:"left", color:"white", fontWeight:600 }}>Tipo</th>
                <th style={{ padding:"10px", textAlign:"left", color:"white", fontWeight:600 }}>Finalidad</th>
                <th style={{ padding:"10px", textAlign:"left", color:"white", fontWeight:600 }}>Duración</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["mdlm_admin_user","Técnica","Mantener sesión del panel de administración","Sesión"],
                ["mdlm_cookie_consent","Preferencia","Recordar su elección sobre cookies","1 año"],
              ].map(([name,tipo,fin,dur])=>(
                <tr key={name as string} style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                  <td style={{ padding:"10px", fontFamily:"monospace", fontSize:"0.8rem", color:"#c9a96e" }}>{name}</td>
                  <td style={{ padding:"10px" }}>{tipo}</td>
                  <td style={{ padding:"10px" }}>{fin}</td>
                  <td style={{ padding:"10px" }}>{dur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            3. Cómo gestionar las cookies
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            Puede configurar su navegador para rechazar o eliminar cookies. Sin embargo, esto puede afectar al funcionamiento del sitio. Consulte la ayuda de su navegador para más información.
          </p>
        </section>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:"2rem", marginTop:"4rem" }}>
          <a href={`/${locale}`} style={{ color:"rgba(201,169,110,0.7)", fontSize:"0.55rem", letterSpacing:"0.4em", textTransform:"uppercase", textDecoration:"none" }}>
            ← Volver
          </a>
        </div>
      </div>
    </div>
  );
}
