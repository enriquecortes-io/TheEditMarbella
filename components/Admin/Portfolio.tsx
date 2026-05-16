"use client";
import { useState, useEffect } from "react";

interface Property {
  id: string; slug: string; titulo: any; precio: number;
  habitaciones: number; banos: number; m2_construidos: number;
  ubicacion: string; tipo: string; localidad: string;
  activa: boolean; destacada: boolean;
}

interface Props { password: string; onEdit: (slug: string) => void; }

const L: React.CSSProperties = { display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"4px" };
const S: React.CSSProperties = { padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:"6px", fontSize:"13px", fontFamily:"system-ui", outline:"none", background:"white", color:"#111" };

export default function Portfolio({ password, onEdit }: Props) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [filters, setFilters] = useState({ tipo:"", localidad:"", activa:"", search:"" });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/properties", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setProperties(data.properties || []);
    } catch { setStatus("❌ Error al cargar"); }
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleToggle = async (slug: string, field: "activa" | "destacada", current: boolean) => {
    try {
      await fetch("/api/admin/save-property", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ password, property: { slug, [field]: !current } }),
      });
      setStatus(`✅ Actualizado`);
      fetchProperties();
    } catch { setStatus("❌ Error"); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`¿Eliminar ${slug}?`)) return;
    try {
      const res = await fetch("/api/admin/delete-property", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ password, slug }),
      });
      const data = await res.json();
      if (data.ok) { setStatus("✅ Eliminada"); fetchProperties(); }
      else setStatus(`❌ ${data.error}`);
    } catch { setStatus("❌ Error"); }
  };

  const filtered = properties.filter(p => {
    const title = typeof p.titulo === "object" ? (p.titulo.es || p.titulo.en || "") : p.titulo;
    if (filters.search && !title.toLowerCase().includes(filters.search.toLowerCase()) && !p.slug.includes(filters.search)) return false;
    if (filters.tipo && p.tipo !== filters.tipo) return false;
    if (filters.localidad && p.localidad !== filters.localidad) return false;
    if (filters.activa === "activa" && !p.activa) return false;
    if (filters.activa === "borrador" && p.activa) return false;
    return true;
  });

  return (
    <div style={{ padding:"32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Panel de Administración</p>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111", margin:0 }}>Portfolio</h1>
        </div>
        <span style={{ background:"#f3f4f6", padding:"4px 12px", borderRadius:"20px", fontSize:"13px", color:"#6b7280" }}>
          {filtered.length} propiedades
        </span>
      </div>

      {/* Filtros */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"12px", marginBottom:"24px", background:"white", padding:"16px", borderRadius:"8px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div>
          <label style={L}>Buscar</label>
          <input value={filters.search} onChange={e=>setFilters(p=>({...p,search:e.target.value}))}
            placeholder="Nombre o slug..." style={{...S, width:"100%", boxSizing:"border-box"}}/>
        </div>
        <div>
          <label style={L}>Tipo</label>
          <select value={filters.tipo} onChange={e=>setFilters(p=>({...p,tipo:e.target.value}))} style={S}>
            <option value="">Todos</option>
            <option value="villa">Villa</option>
            <option value="casa-adosada">Casa Adosada</option>
            <option value="atico">Ático</option>
            <option value="media-planta">Media Planta</option>
            <option value="bajo">Bajo</option>
            <option value="terreno">Terreno</option>
          </select>
        </div>
        <div>
          <label style={L}>Localidad</label>
          <select value={filters.localidad} onChange={e=>setFilters(p=>({...p,localidad:e.target.value}))} style={S}>
            <option value="">Todas</option>
            <option value="marbella">Marbella</option>
            <option value="estepona">Estepona</option>
            <option value="mijas">Mijas</option>
            <option value="benahavis">Benahavís</option>
            <option value="sotogrande">Sotogrande</option>
          </select>
        </div>
        <div>
          <label style={L}>Estado</label>
          <select value={filters.activa} onChange={e=>setFilters(p=>({...p,activa:e.target.value}))} style={S}>
            <option value="">Todos</option>
            <option value="activa">Publicadas</option>
            <option value="borrador">Borradores</option>
          </select>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div style={{ padding:"10px 16px", borderRadius:"6px", marginBottom:"16px", background: status.startsWith("✅") ? "#f0fdf4" : "#fef2f2", border:`1px solid ${status.startsWith("✅")?"#86efac":"#fca5a5"}`, color: status.startsWith("✅")?"#166534":"#991b1b", fontSize:"13px" }}>
          {status}
        </div>
      )}

      {/* Tabla */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b7280" }}>Cargando...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b7280" }}>No hay propiedades</div>
      ) : (
        <div style={{ background:"white", borderRadius:"8px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #f3f4f6" }}>
                {["Propiedad","Tipo","Ubicación","Precio","Estado","Destacada","Acciones"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const title = typeof p.titulo === "object" ? (p.titulo.es || p.titulo.en || p.slug) : p.titulo;
                return (
                  <tr key={p.slug} style={{ borderBottom:"1px solid #f3f4f6", background: i%2===0?"white":"#fafafa" }}>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ fontWeight:600, fontSize:"14px", color:"#111" }}>{title}</div>
                      <div style={{ fontSize:"12px", color:"#9ca3af", marginTop:"2px" }}>{p.slug}</div>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151" }}>{p.tipo || "—"}</td>
                    <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151" }}>{p.ubicacion || p.localidad || "—"}</td>
                    <td style={{ padding:"14px 16px", fontSize:"13px", fontWeight:600, color:"#111" }}>
                      {p.precio ? `€${(p.precio/1000000).toFixed(1)}M` : "—"}
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <button onClick={()=>handleToggle(p.slug,"activa",p.activa)}
                        style={{ padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:600, border:"none", cursor:"pointer",
                          background: p.activa ? "#dcfce7" : "#f3f4f6",
                          color: p.activa ? "#166534" : "#6b7280" }}>
                        {p.activa ? "Publicada" : "Borrador"}
                      </button>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <button onClick={()=>handleToggle(p.slug,"destacada",p.destacada)}
                        style={{ padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:600, border:"none", cursor:"pointer",
                          background: p.destacada ? "#fef3c7" : "#f3f4f6",
                          color: p.destacada ? "#92400e" : "#6b7280" }}>
                        {p.destacada ? "⭐ Sí" : "No"}
                      </button>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ display:"flex", gap:"8px" }}>
                        <a href={`/es/propiedades/${p.slug}`} target="_blank"
                          style={{ padding:"6px 10px", background:"#f3f4f6", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#374151", textDecoration:"none" }}>
                          Ver →
                        </a>
                        <button onClick={()=>handleDelete(p.slug)}
                          style={{ padding:"6px 10px", background:"#fef2f2", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#991b1b" }}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
