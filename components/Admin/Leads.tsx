"use client";
import { useState, useEffect } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  horizon: string;
  property_title: string;
  property_slug: string;
  locale: string;
  agente: string;
  created_at: string;
}

interface Props { password: string; }

export default function Leads({ password }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agentes, setAgentes] = useState<string[]>(["Enrique"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Cargar leads
    fetch("/api/admin/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then(r => r.json())
      .then(d => { setLeads(d.leads || []); setLoading(false); })
      .catch(() => setLoading(false));

    // Cargar agentes desde tabla usuarios
    fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "list" }),
    })
      .then(r => r.json())
      .then(d => {
        const userAgentes = (d.users || [])
          .filter((u: any) => u.role === "agente" || u.role === "superadmin")
          .map((u: any) => u.name);
        if (userAgentes.length > 0) setAgentes(userAgentes);
      })
      .catch(() => {});
  }, []);

  const handleChangeAgente = async (id: string, agente: string) => {
    await fetch("/api/admin/leads/update", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ password, id, agente }),
    });
    setLeads(prev => prev.map(l => l.id === id ? {...l, agente} : l));
  };

  const filtered = leads.filter(l =>
    !search ||
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.property_title?.toLowerCase().includes(search.toLowerCase())
  );

  const S: React.CSSProperties = { padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:"6px", fontSize:"13px", fontFamily:"system-ui", outline:"none", background:"white", color:"#111" };

  return (
    <div style={{ padding:"32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Panel de Administración</p>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111", margin:0 }}>Leads</h1>
        </div>
        <span style={{ background:"#f3f4f6", padding:"4px 12px", borderRadius:"20px", fontSize:"13px", color:"#6b7280" }}>
          {filtered.length} solicitudes
        </span>
      </div>

      {/* Búsqueda */}
      <div style={{ background:"white", padding:"16px", borderRadius:"8px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:"24px" }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o propiedad..."
          style={{ ...S, width:"100%", boxSizing:"border-box" }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b7280" }}>Cargando...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b7280" }}>No hay solicitudes</div>
      ) : (
        <div style={{ background:"white", borderRadius:"8px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #f3f4f6" }}>
                {["Fecha","Nombre","Email","Teléfono","Propiedad","Horizonte","Agente","Idioma"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={l.id} style={{ borderBottom:"1px solid #f3f4f6", background:i%2===0?"white":"#fafafa" }}>
                  <td style={{ padding:"14px 16px", fontSize:"12px", color:"#6b7280", whiteSpace:"nowrap" }}>
                    {new Date(l.created_at).toLocaleDateString("es-ES", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                  </td>
                  <td style={{ padding:"14px 16px", fontSize:"14px", fontWeight:600, color:"#111" }}>{l.name || "—"}</td>
                  <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151" }}>
                    <a href={`mailto:${l.email}`} style={{ color:"#2563eb", textDecoration:"none" }}>{l.email || "—"}</a>
                  </td>
                  <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151" }}>
                    <a href={`tel:${l.phone}`} style={{ color:"#374151", textDecoration:"none" }}>{l.phone || "—"}</a>
                  </td>
                  <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151" }}>
                    <div style={{ fontWeight:500 }}>{l.property_title || "—"}</div>
                    <div style={{ fontSize:"11px", color:"#9ca3af" }}>{l.property_slug}</div>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:600, background:"#fef3c7", color:"#92400e" }}>
                      {l.horizon || "—"}
                    </span>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <select
                      value={l.agente || "Enrique"}
                      onChange={e => handleChangeAgente(l.id, e.target.value)}
                      style={{ padding:"4px 8px", border:"1px solid #d1d5db", borderRadius:"6px", fontSize:"12px", background:"white", cursor:"pointer" }}
                    >
                      {agentes.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </td>
                  <td style={{ padding:"14px 16px", fontSize:"12px", color:"#6b7280", textTransform:"uppercase" }}>{l.locale || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
