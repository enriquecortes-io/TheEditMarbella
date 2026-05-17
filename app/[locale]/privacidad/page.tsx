import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — Edit Marbella",
  robots: "noindex",
};

export default async function PrivacidadPage({ params }: { params: Promise<{locale:string}> }) {
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
          Política de Privacidad
        </h1>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            1. Responsable del tratamiento
          </h2>
          <ul style={{ lineHeight:2.2, fontWeight:200, fontSize:"0.9rem", paddingLeft:"1.5rem" }}>
            <li><strong style={{color:"rgba(255,255,255,0.9)"}}>Responsable:</strong> Enrique Cortés Gómez</li>
            <li><strong style={{color:"rgba(255,255,255,0.9)"}}>Actividad:</strong> Agente inmobiliario independiente</li>
            <li><strong style={{color:"rgba(255,255,255,0.9)"}}>Email:</strong> enriquecortesgomez@gmail.com</li>
          </ul>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            2. Datos que recopilamos
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            A través del formulario de solicitud de visita privada recopilamos: nombre completo, dirección de email, número de teléfono y horizonte de inversión. Estos datos son facilitados voluntariamente por el usuario.
          </p>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            3. Finalidad del tratamiento
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            Los datos recogidos se utilizan exclusivamente para:
          </p>
          <ul style={{ lineHeight:2.2, fontWeight:200, fontSize:"0.9rem", paddingLeft:"1.5rem" }}>
            <li>Gestionar su solicitud de visita privada</li>
            <li>Contactarle para confirmar disponibilidad y condiciones</li>
            <li>Enviarle información sobre propiedades que puedan ser de su interés</li>
          </ul>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            4. Base legal
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            El tratamiento se basa en el consentimiento del interesado (Art. 6.1.a RGPD), otorgado al enviar el formulario de contacto.
          </p>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            5. Conservación de datos
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            Los datos se conservarán mientras exista una relación comercial activa o durante el tiempo necesario para cumplir con las obligaciones legales aplicables.
          </p>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            6. Sus derechos
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            Tiene derecho a acceder, rectificar, suprimir, oponerse y limitar el tratamiento de sus datos, así como a la portabilidad. Para ejercerlos, contacte en: enriquecortesgomez@gmail.com. Tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).
          </p>
        </section>

        <section style={{ marginBottom:"3rem" }}>
          <h2 style={{ fontSize:"1rem", fontWeight:600, color:"white", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
            7. Transferencias internacionales
          </h2>
          <p style={{ lineHeight:1.9, fontWeight:200, fontSize:"0.9rem" }}>
            Sus datos se almacenan en Supabase (infraestructura en la UE) y pueden ser procesados por Resend (notificaciones de email), ambos con garantías adecuadas según el RGPD.
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
