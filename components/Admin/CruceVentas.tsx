"use client";
import { useState, useEffect } from "react";

interface Lead {
  id: string; name: string; email: string; phone: string;
  horizon: string; property_title: string; property_slug: string;
  locale: string; created_at: string;
}

interface Property {
  slug: string; titulo: any; precio: number;
  habitaciones: number; m2_construidos: number;
  tipo: string; zona: string; ubicacion: string; activa: boolean;
}

interface Match {
  lead: Lead;
  properties: Property[];
}

interface Props { password: string; }

export default function CruceVentas({ password }: Props) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/leads", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password}) }).then(r=>r.json()),
      fetch("/api/admin/properties", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password}) }).then(r=>r.json()),
    ]).then(([leadsData, propsData]) => {
      const leads: Lead[] = leadsData.leads || [];
      const properties: Property[] = (propsData.properties || []).filter((p:Property) => p.activa);

      // Cruzar cada lead con propiedades compatibles
      const result: Match[] = leads.map(lead => {
        // Obtener datos de la propiedad que solicitó
        const reqProp = properties.find(p => p.slug === lead.property_slug);

        const matched = properties.filter(p => {
          if (p.slug === lead.property_slug) return false; // excluir la misma

          let score = 0;

          // Mismo tipo
          if (reqProp && p.tipo === reqProp.tipo) score += 2;

          // Misma zona
          if (reqProp && p.zona === reqProp.zona) score += 2;

          // Precio similar ±50%
          if (reqProp && reqProp.precio > 0) {
            const ratio = p.precio / reqProp.precio;
            if (ratio > 0.5 && ratio < 1.5) score += 1;
          }

          // Habitaciones similares ±2
          if (reqProp && Math.abs(p.habitaciones - reqProp.habitaciones) <= 2) score += 1;

          return score >= 2;
        }).slice(0, 3); // máximo 3 matches por lead

        return { lead, properties: matched };
      }).filter(m => m.properties.length > 0);

      setMatches(result);
      setLoading(false);
    });
  }, []);

  const getTitle = (titulo: any) =>
    typeof titulo === "object" ? titulo.es || titulo.en || "Sin título" : titulo || "Sin título";

  return (
    <div style={{ padding:"32px" }}>
      <div style={{ marginBottom:"24px" }}>
        <p style={{ fontSize:"12px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Panel de Administración</p>
        <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111", margin:"0 0 8px" }}>Cruce de Ventas</h1>
        <p style={{ fontSize:"13px", color:"#6b7280", margin:0 }}>Propiedades compatibles con cada solicitud de lead</p>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b7280" }}>Analizando...</div>
      ) : matches.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b7280", background:"white", borderRadius:"8px" }}>
          <p style={{ fontSize:"32px", margin:"0 0 16px" }}>🔗</p>
          <p style={{ fontWeight:600, marginBottom:"8px" }}>Sin cruces disponibles</p>
          <p style={{ fontSize:"13px" }}>No hay propiedades activas compatibles con los leads actuales</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
          {matches.map(({ lead, properties }) => (
            <div key={lead.id} style={{ background:"white", borderRadius:"12px", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", overflow:"hidden" }}>

              {/* Lead header */}
              <div style={{ padding:"20px 24px", borderBottom:"2px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                    <span style={{ fontSize:"18px" }}>👤</span>
                    <div>
                      <p style={{ fontWeight:700, fontSize:"15px", color:"#111", margin:0 }}>{lead.name}</p>
                      <p style={{ fontSize:"12px", color:"#6b7280", margin:"2px 0 0" }}>
                        {lead.email} · {lead.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:"11px", color:"#6b7280", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Interesado en</p>
                  <p style={{ fontSize:"13px", fontWeight:600, color:"#111", margin:"0 0 4px" }}>{lead.property_title}</p>
                  <span style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:600, background:"#fef3c7", color:"#92400e" }}>
                    {lead.horizon}
                  </span>
                </div>
              </div>

              {/* Propiedades compatibles */}
              <div style={{ padding:"16px 24px" }}>
                <p style={{ fontSize:"11px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em", margin:"0 0 16px", fontWeight:700 }}>
                  {properties.length} propiedad{properties.length>1?"es":""} compatible{properties.length>1?"s":""}
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:"12px" }}>
                  {properties.map(p => (
                    <div key={p.slug} style={{ border:"1px solid #e5e7eb", borderRadius:"8px", padding:"16px" }}>
                      <p style={{ fontWeight:600, fontSize:"14px", color:"#111", margin:"0 0 6px" }}>{getTitle(p.titulo)}</p>
                      <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"12px" }}>
                        {p.tipo && <span style={{ padding:"2px 8px", background:"#f3f4f6", borderRadius:"20px", fontSize:"11px", color:"#374151" }}>{p.tipo}</span>}
                        {p.zona && <span style={{ padding:"2px 8px", background:"#eff6ff", borderRadius:"20px", fontSize:"11px", color:"#1d4ed8" }}>{p.zona}</span>}
                      </div>
                      <div style={{ fontSize:"13px", color:"#6b7280", marginBottom:"12px" }}>
                        {p.precio ? <span style={{ color:"#111", fontWeight:700 }}>€{(p.precio/1000000).toFixed(1)}M</span> : ""}
                        {p.habitaciones ? <span style={{ marginLeft:"8px" }}> · {p.habitaciones} hab</span> : ""}
                        {p.m2_construidos ? <span> · {p.m2_construidos}m²</span> : ""}
                      </div>
                      <div style={{ display:"flex", gap:"8px" }}>
                        <a href={`/es/propiedades/${p.slug}`} target="_blank"
                          style={{ flex:1, padding:"6px 12px", background:"#f3f4f6", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#374151", textDecoration:"none", textAlign:"center" }}>
                          Ver →
                        </a>
                        <a href={`mailto:${lead.email}?subject=Propiedad que puede interesarle&body=Estimado ${lead.name},%0A%0AEn relación a su interés en ${lead.property_title}, creemos que esta propiedad también puede ser de su interés:%0A%0A${getTitle(p.titulo)}%0Ahttps://mdlm-xi.vercel.app/es/propiedades/${p.slug}%0A%0AQuedamos a su disposición.%0A%0AMillión Dollars Listing Marbella`}
                          style={{ flex:1, padding:"6px 12px", background:"#dcfce7", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#166534", textDecoration:"none", textAlign:"center" }}>
                          Enviar →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
