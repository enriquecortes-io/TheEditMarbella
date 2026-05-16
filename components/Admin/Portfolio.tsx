"use client";
import { useState, useEffect } from "react";

interface Property {
  id: string; slug: string; titulo: any; descripcion: any; precio: number;
  habitaciones: number; banos: number; m2_construidos: number;
  ubicacion: string; tipo: string; zona: string;
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
  const [sort, setSort] = useState<{field:"precio"|"zona"|null, dir:"asc"|"desc"}>({field:null, dir:"asc"});
  const [editing, setEditing] = useState<Property|null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editTranslating, setEditTranslating] = useState(false);
  const [editTranslated, setEditTranslated] = useState<Record<string,Record<string,string>>>({});
  const [editSourceLang, setEditSourceLang] = useState("es");

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

  const handleEdit = (p: Property) => {
    setEditing(p);
    // Normalizar a objeto multiidioma
    const normalizeLang = (val: any, defaultLang = "en") => {
      if (!val) return { es:"", en:"", fr:"", ru:"" };
      if (typeof val === "string") return { es:"", en:"", fr:"", ru:"", [defaultLang]: val };
      return val;
    };
    const sourceLang = typeof p.titulo === "string" ? "en" : "es";
    setEditSourceLang(sourceLang);
    setEditForm({
      ...p,
      titulo: normalizeLang(p.titulo, sourceLang),
      descripcion: normalizeLang(p.descripcion, sourceLang),
    });
    setEditTranslated({});
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setStatus("Guardando...");
    try {
      const res = await fetch("/api/admin/save-property", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ password, property: {
          ...editForm,
          titulo: editTranslated.titulo
            ? editTranslated.titulo
            : typeof editForm.titulo === "object"
              ? editForm.titulo
              : { es:editForm.titulo, en:editForm.titulo, fr:editForm.titulo, ru:editForm.titulo },
          descripcion: editTranslated.descripcion
            ? editTranslated.descripcion
            : typeof editForm.descripcion === "object"
              ? editForm.descripcion
              : { es:editForm.descripcion, en:editForm.descripcion, fr:editForm.descripcion, ru:editForm.descripcion },
        }}),
      });
      const data = await res.json();
      if (data.ok) { setStatus("✅ Actualizado"); setEditing(null); fetchProperties(); }
      else setStatus(`❌ ${data.error}`);
    } catch { setStatus("❌ Error"); }
  };

  const handleEditTranslate = async (field: "titulo"|"descripcion") => {
    const obj = editForm[field];
    const text = typeof obj === "object" ? (obj[editSourceLang] || obj["es"] || obj["en"] || "") : obj || "";
    if (!text) return;
    setEditTranslating(true);
    try {
      const res = await fetch("/api/admin/translate", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ text, sourceLang: editSourceLang }),
      });
      const data = await res.json();
      // Volcar traducciones directamente en editForm como objeto multiidioma
      setEditForm((prev: any) => ({
        ...prev,
        [field]: data.translations,
      }));
      setEditTranslated(prev => ({...prev, [field]: data.translations}));
    } catch {}
    setEditTranslating(false);
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

  const toggleSort = (field: "precio"|"zona") => {
    setSort(prev => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc"
    }));
  };

  const filtered = properties.filter(p => {
    const title = typeof p.titulo === "object" ? (p.titulo.es || p.titulo.en || "") : p.titulo;
    if (filters.search && !title.toLowerCase().includes(filters.search.toLowerCase()) && !p.slug.includes(filters.search)) return false;
    if (filters.tipo && p.tipo !== filters.tipo) return false;
    if (filters.localidad && (p as any).zona !== filters.localidad) return false;
    if (filters.activa === "activa" && !p.activa) return false;
    if (filters.activa === "borrador" && p.activa) return false;
    return true;
  }).sort((a,b) => {
    if (!sort.field) return 0;
    if (sort.field === "precio") return sort.dir === "asc" ? a.precio - b.precio : b.precio - a.precio;
    if (sort.field === "zona") {
      const az = a.localidad || a.ubicacion || "";
      const bz = b.localidad || b.ubicacion || "";
      return sort.dir === "asc" ? az.localeCompare(bz) : bz.localeCompare(az);
    }
    return 0;
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
                {["Propiedad","Tipo"].map(h=>(
                <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
              ))}
              <th onClick={()=>toggleSort("zona")} style={{padding:"12px 16px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",cursor:"pointer",userSelect:"none"}}>
                Zona {sort.field==="zona" ? (sort.dir==="asc"?"↑":"↓") : "↕"}
              </th>
              <th style={{padding:"12px 16px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Ubicación
              </th>
              <th onClick={()=>toggleSort("precio")} style={{padding:"12px 16px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",cursor:"pointer",userSelect:"none"}}>
                Precio {sort.field==="precio" ? (sort.dir==="asc"?"↑":"↓") : "↕"}
              </th>
              {["Estado","Destacada","Acciones"].map(h=>(
                <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
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
                    <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151", textTransform:"capitalize" }}>{(p as any).zona || "—"}</td>
                    <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151" }}>{p.ubicacion || "—"}</td>
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
                      <div style={{ display:"flex", gap:"6px" }}>
                        <a href={`/es/propiedades/${p.slug}`} target="_blank"
                          style={{ padding:"6px 10px", background:"#f3f4f6", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#374151", textDecoration:"none" }}>
                          Ver →
                        </a>
                        <button onClick={()=>handleEdit(p)}
                          style={{ padding:"6px 10px", background:"#eff6ff", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#1d4ed8" }}>
                          Editar
                        </button>
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
      {/* Modal edición */}
      {editing && (
        <div onClick={()=>setEditing(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:"12px",padding:"32px",width:"100%",maxWidth:"600px",maxHeight:"90vh",overflowY:"auto"}}>
            <h2 style={{fontSize:"18px",fontWeight:700,marginBottom:"24px",color:"#111"}}>Editar Propiedad</h2>

            {/* Idioma fuente */}
            <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px"}}>Idioma del texto</label>
            <select value={editSourceLang} onChange={e=>setEditSourceLang(e.target.value)}
              style={{width:"100%",padding:"10px 12px",border:"1px solid #d1d5db",borderRadius:"6px",fontSize:"14px",outline:"none",boxSizing:"border-box",marginBottom:"16px"}}>
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ru">Русский</option>
            </select>

            {/* Título */}
            <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px"}}>Título</label>
            <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
              <input value={typeof editForm.titulo==="object"?(editForm.titulo[editSourceLang]||""):editForm.titulo||""}
                onChange={e=>setEditForm((p:any)=>({...p,titulo:{...(typeof p.titulo==="object"?p.titulo:{}), [editSourceLang]:e.target.value}}))}
                style={{flex:1,padding:"10px 12px",border:"1px solid #d1d5db",borderRadius:"6px",fontSize:"14px",outline:"none"}}/>
              <button onClick={()=>handleEditTranslate("titulo")} disabled={editTranslating}
                style={{padding:"10px 16px",background:"#7c3aed",color:"white",border:"none",borderRadius:"6px",fontSize:"13px",cursor:"pointer"}}>
                {editTranslating?"...":"Traducir"}
              </button>
            </div>
            {editTranslated.titulo && (
              <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:"6px",padding:"12px",marginBottom:"16px",fontSize:"12px"}}>
                <div style={{fontWeight:700,color:"#7c3aed",marginBottom:"6px",fontSize:"11px"}}>✅ Traducido en 4 idiomas</div>
                {Object.entries(editTranslated.titulo).map(([lang,txt])=>(
                  <div key={lang} style={{marginBottom:"2px"}}><strong style={{color:"#7c3aed"}}>{lang.toUpperCase()}:</strong> {txt as string}</div>
                ))}
              </div>
            )}

            {/* Descripción */}
            <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px"}}>Descripción</label>
            <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
              <textarea value={typeof editForm.descripcion==="object"?(editForm.descripcion[editSourceLang]||""):editForm.descripcion||""}
                onChange={e=>setEditForm((p:any)=>({...p,descripcion:{...(typeof p.descripcion==="object"?p.descripcion:{}), [editSourceLang]:e.target.value}}))}
                rows={4} style={{flex:1,padding:"10px 12px",border:"1px solid #d1d5db",borderRadius:"6px",fontSize:"14px",outline:"none",resize:"vertical"}}/>
              <button onClick={()=>handleEditTranslate("descripcion")} disabled={editTranslating}
                style={{padding:"10px 16px",background:"#7c3aed",color:"white",border:"none",borderRadius:"6px",fontSize:"13px",cursor:"pointer",alignSelf:"flex-start"}}>
                {editTranslating?"...":"Traducir"}
              </button>
            </div>
            {editTranslated.descripcion && (
              <div style={{background:"#f5f3ff",border:"1px solid #ddd6fe",borderRadius:"6px",padding:"12px",marginBottom:"16px",fontSize:"12px"}}>
                <div style={{fontWeight:700,color:"#7c3aed",marginBottom:"6px",fontSize:"11px"}}>✅ Traducido en 4 idiomas</div>
                {Object.entries(editTranslated.descripcion).map(([lang,txt])=>(
                  <div key={lang} style={{marginBottom:"4px"}}><strong style={{color:"#7c3aed"}}>{lang.toUpperCase()}:</strong> {txt as string}</div>
                ))}
              </div>
            )}

            {/* Campos numéricos */}
            {[
              {label:"Precio (€)", field:"precio", type:"number"},
              {label:"Habitaciones", field:"habitaciones", type:"number"},
              {label:"Baños", field:"banos", type:"number"},
              {label:"M² Construidos", field:"m2_construidos", type:"number"},
              {label:"M² Parcela", field:"m2_parcela", type:"number"},
              {label:"Ubicación", field:"ubicacion", type:"text"},
              {label:"Zona (filtro)", field:"zona", type:"text"},
            ].map(({label,field,type})=>(
              <div key={field}>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:"4px"}}>{label}</label>
                <input type={type} value={(editForm as any)[field]||""}
                  onChange={e=>setEditForm((p:any)=>({...p,[field]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))}
                  style={{width:"100%",padding:"10px 12px",border:"1px solid #d1d5db",borderRadius:"6px",fontSize:"14px",outline:"none",boxSizing:"border-box",marginBottom:"16px"}}/>
              </div>
            ))}
            <div style={{display:"flex",gap:"12px",marginTop:"8px"}}>
              <button onClick={()=>setEditing(null)} style={{flex:1,padding:"10px",background:"#f3f4f6",border:"none",borderRadius:"6px",fontSize:"13px",cursor:"pointer",color:"#374151"}}>Cancelar</button>
              <button onClick={handleSaveEdit} style={{flex:2,padding:"10px",background:"#16a34a",color:"white",border:"none",borderRadius:"6px",fontSize:"13px",fontWeight:600,cursor:"pointer"}}>✦ Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
