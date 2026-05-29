"use client";
import { useState, useEffect } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  ubicacion: string;
  precio_estimado: string;
  mensaje: string;
  locale: string;
  created_at: string;
}

interface Props { password: string; }

const S: React.CSSProperties = { padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:"6px", fontSize:"13px", fontFamily:"system-ui", outline:"none", background:"white" };
const TH: React.CSSProperties = { padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", cursor:"pointer" };

export default function LeadsCaptacion({ password }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroPrecio, setFiltroPrecio] = useState("");
  const [sort, setSort] = useState<{field:string|null,dir:"asc"|"desc"}>({field:null,dir:"asc"});
  const toggleSort = (field:string) => setSort(p=>({field,dir:p.field===field&&p.dir==="asc"?"desc":"asc"}));

  useEffect(() => {
    fetch("/api/admin/captacion-leads", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ password }),
    })
      .then(r => r.json())
      .then(d => { setLeads(d.leads || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const precios = [...new Set(leads.map(l=>l.precio_estimado).filter(Boolean))];

  const sorted = [...leads].sort((a,b) => {
    if (!sort.field) return 0;
    const f = sort.field as keyof typeof a;
    return sort.dir==="asc"
      ? String(a[f]||"").localeCompare(String(b[f]||""))
      : String(b[f]||"").localeCompare(String(a[f]||""));
  });

  const filtered = sorted.filter(l => {
    if (filtroPrecio && l.precio_estimado !== filtroPrecio) return false;
    if (search && !l.name?.toLowerCase().includes(search.toLowerCase()) &&
        !l.email?.toLowerCase().includes(search.toLowerCase()) &&
        !l.ubicacion?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding:"32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Panel de Administración</p>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111", margin:0 }}>Leads Captación</h1>
        </div>
        <span style={{ background:"#f3f4f6", padding:"4px 12px", borderRadius:"20px", fontSize:"13px", color:"#6b7280" }}>
          {filtered.length} solicitudes
        </span>
      </div>

      <div style={{ background:"white", padding:"16px", borderRadius:"8px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", marginBottom:"16px" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Buscar por nombre, email o ubicación..."
          style={{...S, width:"100%", boxSizing:"border-box" as const}}/>
      </div>

      {/* Filtros precio */}
      {precios.length > 0 && (
        <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", marginBottom:"1rem" }}>
          <button onClick={()=>setFiltroPrecio("")} style={{ padding:"5px 12px", borderRadius:"20px", border:"2px solid", borderColor:filtroPrecio===""?"#111827":"#e5e7eb", background:filtroPrecio===""?"#111827":"white", color:filtroPrecio===""?"white":"#374151", fontSize:"12px", fontWeight:600, cursor:"pointer" }}>
            Todos
          </button>
          {precios.map(p => (
            <button key={p} onClick={()=>setFiltroPrecio(filtroPrecio===p?"":p)} style={{ padding:"5px 12px", borderRadius:"20px", border:"2px solid", borderColor:filtroPrecio===p?"#2563eb":"#e5e7eb", background:filtroPrecio===p?"#2563eb":"white", color:filtroPrecio===p?"white":"#374151", fontSize:"12px", fontWeight:600, cursor:"pointer" }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b7280" }}>Cargando...</div>
      ) : (
        <div style={{ background:"white", borderRadius:"8px", border:"1px solid #e5e7eb", overflow:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"700px" }}>
            <thead>
              <tr style={{ background:"#f9fafb" }}>
                {[["Cliente","name"],["Email","email"],["Teléfono","phone"],["Ubicación","ubicacion"],["Precio Est.","precio_estimado"],["Fecha","created_at"]].map(([label,field])=>(
                  <th key={field} onClick={()=>toggleSort(field)} style={TH}>
                    {label} {sort.field===field?(sort.dir==="asc"?"↑":"↓"):"↕"}
                  </th>
                ))}
                <th style={{...TH, cursor:"default"}}>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l,i) => (
                <tr key={l.id} style={{ borderTop:"1px solid #f3f4f6", background:i%2===0?"white":"#fafafa" }}>
                  <td style={{ padding:"12px 16px", fontSize:"13px", fontWeight:600 }}>{l.name}</td>
                  <td style={{ padding:"12px 16px", fontSize:"13px", color:"#374151" }}>{l.email||"—"}</td>
                  <td style={{ padding:"12px 16px", fontSize:"13px", color:"#374151" }}>{l.phone||"—"}</td>
                  <td style={{ padding:"12px 16px", fontSize:"13px", color:"#374151" }}>{l.ubicacion||"—"}</td>
                  <td style={{ padding:"12px 16px", fontSize:"13px", color:"#374151" }}>{l.precio_estimado||"—"}</td>
                  <td style={{ padding:"12px 16px", fontSize:"12px", color:"#6b7280" }}>{new Date(l.created_at).toLocaleDateString("es-ES")}</td>
                  <td style={{ padding:"12px 16px", fontSize:"12px", color:"#6b7280", maxWidth:"200px" }}>{l.mensaje||"—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding:"2rem", textAlign:"center", color:"#6b7280" }}>Sin leads</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
