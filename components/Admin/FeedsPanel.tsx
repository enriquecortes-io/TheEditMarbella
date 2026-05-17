"use client";

const BASE = "https://mdlm-xi.vercel.app/api/feed";

const PORTALES = [
  {
    name: "Idealista",
    logo: "🏠",
    url: `${BASE}/idealista`,
    token_var: "IDEALISTA_FEED_TOKEN",
    status: "pending",
    desc: "Mayor portal inmobiliario de España. Requiere contrato con Idealista Pro.",
    docs: "https://www.idealista.com/pro/",
  },
  {
    name: "Resales Online",
    logo: "🌐",
    url: `${BASE}/resales`,
    token_var: "RESALES_FEED_TOKEN",
    status: "pending",
    desc: "Portal especializado en propiedades de lujo en la Costa del Sol.",
    docs: "https://www.resalesonline.com/",
  },
  {
    name: "Kyero",
    logo: "🇪🇺",
    url: `${BASE}/kyero`,
    token_var: "KYERO_FEED_TOKEN",
    status: "pending",
    desc: "Portal europeo de propiedades en España. Alta visibilidad en UK y Alemania.",
    docs: "https://www.kyero.com/",
  },
];

export default function FeedsPanel() {
  return (
    <div style={{ padding:"32px" }}>
      <div style={{ marginBottom:"32px" }}>
        <p style={{ fontSize:"12px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Panel de Administración</p>
        <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111", margin:"0 0 8px" }}>Portales / Feeds</h1>
        <p style={{ fontSize:"13px", color:"#6b7280", margin:0 }}>
          Feeds XML listos para conectar con portales inmobiliarios. Añade el token en Vercel cuando contrates el servicio.
        </p>
      </div>

      {/* Instrucciones */}
      <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:"8px", padding:"16px 20px", marginBottom:"32px" }}>
        <p style={{ fontWeight:700, fontSize:"14px", color:"#1e40af", margin:"0 0 8px" }}>ℹ️ Cómo activar un portal</p>
        <ol style={{ margin:0, paddingLeft:"20px", fontSize:"13px", color:"#1e40af", lineHeight:1.8 }}>
          <li>Contrata el servicio con el portal (Idealista Pro, Resales Online, etc.)</li>
          <li>El portal te proporcionará un token o te pedirá la URL del feed</li>
          <li>Añade el token en <strong>Vercel → Settings → Environment Variables</strong></li>
          <li>Proporciona la URL del feed al portal</li>
        </ol>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
        {PORTALES.map(portal => (
          <div key={portal.name} style={{ background:"white", borderRadius:"12px", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", padding:"24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <span style={{ fontSize:"24px" }}>{portal.logo}</span>
                <div>
                  <h2 style={{ fontSize:"18px", fontWeight:700, color:"#111", margin:0 }}>{portal.name}</h2>
                  <p style={{ fontSize:"13px", color:"#6b7280", margin:"2px 0 0" }}>{portal.desc}</p>
                </div>
              </div>
              <span style={{ padding:"4px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:600, background:"#fef3c7", color:"#92400e" }}>
                Pendiente activar
              </span>
            </div>

            <div style={{ background:"#f9fafb", borderRadius:"6px", padding:"12px 16px", marginBottom:"16px" }}>
              <p style={{ fontSize:"11px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 6px", fontWeight:600 }}>URL del Feed</p>
              <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                <code style={{ fontSize:"12px", color:"#374151", flex:1, wordBreak:"break-all" }}>{portal.url}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(portal.url)}
                  style={{ padding:"6px 12px", background:"#f3f4f6", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#374151", whiteSpace:"nowrap" }}>
                  Copiar
                </button>
              </div>
            </div>

            <div style={{ background:"#fef9f0", borderRadius:"6px", padding:"12px 16px", marginBottom:"16px" }}>
              <p style={{ fontSize:"11px", color:"#92400e", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 4px", fontWeight:600 }}>Variable de entorno requerida</p>
              <code style={{ fontSize:"12px", color:"#92400e" }}>{portal.token_var}</code>
              <p style={{ fontSize:"11px", color:"#92400e", margin:"4px 0 0" }}>Añadir en Vercel → Settings → Environment Variables</p>
            </div>

            <a href={portal.docs} target="_blank"
              style={{ fontSize:"13px", color:"#2563eb", textDecoration:"none" }}>
              Ver documentación del portal →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
