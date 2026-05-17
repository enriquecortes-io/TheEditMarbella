import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal — Edit Marbella",
  robots: "noindex",
};

export default async function LegalPage({ params }: { params: Promise<{locale:string}> }) {
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
          Aviso Legal
        </h1>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            1. Identificación del titular
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se informa:
          </p>
          <ul style={{ lineHeight:2.2, fontWeight:200, fontSize:"0.9rem", paddingLeft:"1.5rem" }}>
            <li><strong style={{color:"rgba(255,255,255,0.9)"}}>Titular:</strong> Enrique Cortés Gómez</li>
            <li><strong style={{color:"rgba(255,255,255,0.9)"}}>Actividad:</strong> Agente inmobiliario independiente</li>
            <li><strong style={{color:"rgba(255,255,255,0.9)"}}>Domicilio:</strong> Marbella, Málaga, España</li>
            <li><strong style={{color:"rgba(255,255,255,0.9)"}}>Email:</strong> enriquecortesgomez@gmail.com</li>
            <li><strong style={{color:"rgba(255,255,255,0.9)"}}>Web:</strong> editmarbella.com</li>
          </ul>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            2. Objeto y ámbito de aplicación
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            El presente Aviso Legal regula el acceso y uso del sitio web editmarbella.com, cuya actividad principal es la intermediación inmobiliaria de propiedades residenciales de lujo en la Costa del Sol. El acceso y uso de este sitio implica la aceptación plena de las presentes condiciones.
          </p>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            3. Propiedad intelectual
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            Todos los contenidos del sitio web, incluyendo textos, fotografías, vídeos, diseño gráfico y código fuente, son propiedad de Enrique Cortés Gómez o de terceros que han autorizado su uso. Queda prohibida su reproducción total o parcial sin autorización expresa.
          </p>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            4. Responsabilidad
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            La información sobre propiedades publicada en este sitio tiene carácter meramente informativo. Los precios y disponibilidad están sujetos a cambios sin previo aviso. Edit Marbella no se hace responsable de los errores u omisiones en la información publicada.
          </p>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            5. Legislación aplicable
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            Este sitio web se rige por la legislación española. Para cualquier controversia derivada del uso del sitio, las partes se someten a los juzgados y tribunales de Marbella, con renuncia expresa a cualquier otro fuero.
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
