"use client";
import { useState, useEffect } from "react";
import KanbanLeads, { FASES_CAPTACION } from "./KanbanLeads";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  ubicacion: string;
  precio_estimado: string;
  mensaje: string;
  fase: string;
  created_at: string;
}

interface Props { password: string; }

const S: React.CSSProperties = { padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:"6px", fontSize:"13px", fontFamily:"system-ui", outline:"none", background:"white" };

export default function LeadsCaptacion({ password }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"kanban"|"tabla">("kanban");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{field:string|null,dir:"asc"|"desc"}>({field:null,dir:"asc"});
  const toggleSort = (field:string) => setSort(p=>({field,dir:p.field===field&&p.dir==="asc"?"desc":"asc"}));

  const fetch_ = () => {
    setLoading(true);
    fetch("/api/admin/captacion-leads", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ password }),
    })
      .then(r=>r.json())
      .then(d=>{ setLeads(d.leads||[]); setLoading(false); })
      .catch(()=>setLoading(false));
  };

  useEffect(()=>{ fetch_(); },[]);

  const sorted = [...leads].sort((a,b)=>{
    if(!sort.field) return 0;
    const f=sort.field as keyof typeof a;
    return sort.dir==="asc"?String(a[f]||"").localeCompare(String(b[f]||"")):String(b[f]||"").localeCompare(String(a[f]||""));
  });

  const filtered = sorted.filter(l=>
    !search ||
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.email?.toLowerCase().includes(search.toLowerCase()) ||
    l.ubicacion?.toLowerCase().includes(search.toLowerCase())
  );

  const TH: React.CSSProperties = { padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", cursor:"pointer" };

  return (
    <div style={{ padding:"32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Panel de Administración</p>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111", margin:0 }}>Leads Captación</h1>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          <span style={{ background:"#f3f4f6", padding:"4px 12px", borderRadius:"20px", fontSize:"13px", color:"#6b7280" }}>{leads.length} leads</span>
          <button onClick={()=>setView("kanban")} style={{ padding:"6px 14px", borderRadius:"6px", border:"1px solid #e5e7eb", background:view==="kanban"?"#111827":"white", color:view==="kanban"?"white":"#374151", fontSize:"12px", cursor:"pointer" }}>Kanban</button>
          <button onClick={()=>setView("tabla")} style={{ padding:"6px 14px", borderRadius:"6px", border:"1px solid #e5e7eb", background:view==="tabla"?"#111827":"white", color:view==="tabla"?"white":"#374151", fontSize:"12px", cursor:"pointer" }}>Tabla</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b7280" }}>Cargando...</div>
      ) : view === "kanban" ? (
        <KanbanLeads leads={leads} fases={FASES_CAPTACION} tabla="captacion_leads" onUpdate={fetch_} />
      ) : (
        <>
          <div style={{ marginBottom:"16px" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{...S,width:"300px"}}/>
          </div>
          <div style={{ background:"white", borderRadius:"8px", border:"1px solid #e5e7eb", overflow:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"700px" }}>
              <thead>
                <tr style={{ background:"#f9fafb" }}>
                  {[["Cliente","name"],["Email","email"],["Teléfono","phone"],["Ubicación","ubicacion"],["Precio Est.","precio_estimado"],["Fase","fase"],["Fecha","created_at"]].map(([label,field])=>(
                    <th key={field} onClick={()=>toggleSort(field)} style={TH}>
                      {label} {sort.field===field?(sort.dir==="asc"?"↑":"↓"):"↕"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l,i)=>(
                  <tr key={l.id} style={{ borderTop:"1px solid #f3f4f6", background:i%2===0?"white":"#fafafa" }}>
                    <td style={{ padding:"12px 16px", fontSize:"13px", fontWeight:600 }}>{l.name}</td>
                    <td style={{ padding:"12px 16px", fontSize:"13px" }}>{l.email||"—"}</td>
                    <td style={{ padding:"12px 16px", fontSize:"13px" }}>{l.phone||"—"}</td>
                    <td style={{ padding:"12px 16px", fontSize:"13px" }}>{l.ubicacion||"—"}</td>
                    <td style={{ padding:"12px 16px", fontSize:"13px" }}>{l.precio_estimado||"—"}</td>
                    <td style={{ padding:"12px 16px", fontSize:"13px" }}>{l.fase||"nuevo"}</td>
                    <td style={{ padding:"12px 16px", fontSize:"12px", color:"#6b7280" }}>{new Date(l.created_at).toLocaleDateString("es-ES")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
