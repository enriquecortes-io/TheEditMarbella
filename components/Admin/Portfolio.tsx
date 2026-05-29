"use client";
import { useState, useEffect } from "react";
import ImageSorter from "./ImageSorter";
import { convertGDriveUrl } from "@/lib/gdrive";

interface Property {
  id: string; slug: string; titulo: any; descripcion: any; precio: number;
  habitaciones: number; banos: number; m2_construidos: number; m2_parcela: number;
  ubicacion: string; tipo: string; zona: string;
  activa: boolean; destacada: boolean; video_url: string; galeria_urls: string[];
  referencia?: string;
  estado?: string; orientacion?: string; amueblado?: string;
  certificado_energetico?: string; amenidades?: string[];
  ano_construccion?: number; garajes?: number; trasteros?: number;
  planta?: number; google_maps_url?: string;
  contacto_nombre?: string; contacto_telefono?: string; contacto_email?: string;
}

interface Props { password: string; onEdit: (slug: string) => void; }

const L: React.CSSProperties = { display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"4px" };
const S: React.CSSProperties = { padding:"8px 12px", border:"1px solid #d1d5db", borderRadius:"6px", fontSize:"13px", fontFamily:"system-ui", outline:"none", background:"white", color:"#111" };
const INP: React.CSSProperties = { width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:"6px", fontSize:"14px", fontFamily:"system-ui", outline:"none", boxSizing:"border-box", marginBottom:"16px" };

const toLangObj = (val: any, fallbackLang = "en") => {
  if (!val) return { es:"", en:"", fr:"", ru:"" };
  if (typeof val === "string") return { es:"", en:"", fr:"", ru:"", [fallbackLang]: val };
  return { es:"", en:"", fr:"", ru:"", ...val };
};

export default function Portfolio({ password, onEdit }: Props) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [filters, setFilters] = useState({ tipo:"", zona:"", activa:"", search:"" });
  const [sort, setSort] = useState<{field:"precio"|"zona"|null, dir:"asc"|"desc"}>({field:null, dir:"asc"});
  const [editing, setEditing] = useState<Property|null>(null);
  const [lang, setLang] = useState("en");
  const [titulo, setTitulo] = useState<Record<string,string>>({es:"",en:"",fr:"",ru:""});
  const [descripcion, setDescripcion] = useState<Record<string,string>>({es:"",en:"",fr:"",ru:""});
  const [editFields, setEditFields] = useState<any>({});
  const [translating, setTranslating] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/properties", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ password }) });
      const data = await res.json();
      setProperties(data.properties || []);
    } catch { setStatus("❌ Error al cargar"); }
    setLoading(false);
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleEdit = (p: Property) => {
    setEditing(p);
    const t = toLangObj(p.titulo);
    const d = toLangObj(p.descripcion);
    // Detectar idioma con contenido
    const detectedLang = t.en ? "en" : t.es ? "es" : t.fr ? "fr" : "ru";
    setLang(detectedLang);
    setTitulo(t);
    setDescripcion(d);
    setEditFields({
      slug: p.slug,
      referencia: p.referencia,
      precio: p.precio, habitaciones: p.habitaciones, banos: p.banos,
      m2_construidos: p.m2_construidos, m2_parcela: p.m2_parcela,
      ubicacion: p.ubicacion, zona: p.zona, tipo: p.tipo,
      video_url: p.video_url, galeria_urls: (p.galeria_urls||[]).join("\n"),
      activa: p.activa, destacada: p.destacada,
      estado: p.estado || "",
      orientacion: p.orientacion || "",
      amueblado: p.amueblado || "no",
      certificado_energetico: p.certificado_energetico || "",
      amenidades: p.amenidades || [],
      ano_construccion: p.ano_construccion || "",
      garajes: p.garajes || 0,
      trasteros: p.trasteros || 0,
      planta: p.planta || "",
      google_maps_url: p.google_maps_url || "",
      contacto_nombre: p.contacto_nombre || "",
      contacto_telefono: p.contacto_telefono || "",
      contacto_email: p.contacto_email || "",
    });
    setStatus("");
  };

  const handleTranslate = async (field: "titulo"|"descripcion") => {
    const obj = field === "titulo" ? titulo : descripcion;
    const text = obj[lang];
    if (!text) { setStatus("❌ Escribe el texto primero"); return; }
    setTranslating(true);
    setStatus("Traduciendo...");
    try {
      const res = await fetch("/api/admin/translate", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ text, sourceLang: lang }),
      });
      const data = await res.json();
      if (field === "titulo") setTitulo(data.translations);
      else setDescripcion(data.translations);
      setStatus(`✅ ${field} traducido — cambia de idioma para verlo`);
    } catch { setStatus("❌ Error al traducir"); }
    setTranslating(false);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setStatus("Guardando...");
    try {
      const property = {
        slug: editing.slug,
        titulo, descripcion,
        ...editFields,
        galeria_urls: editFields.galeria_urls.split("\n").map((s:string)=>convertGDriveUrl(s.trim())).filter(Boolean),
        video_url: convertGDriveUrl(editFields.video_url||""),
      };
      const res = await fetch("/api/admin/save-property", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ password, property }),
      });
      const data = await res.json();
      if (data.ok) { setStatus("✅ Guardado correctamente"); fetchProperties(); }
      else setStatus(`❌ ${data.error}`);
    } catch { setStatus("❌ Error al guardar"); }
  };

  const handleToggle = async (slug: string, field: "activa"|"destacada", current: boolean) => {
    try {
      await fetch("/api/admin/save-property", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ password, property: { slug, [field]: !current } }),
      });
      fetchProperties();
    } catch {}
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`¿Eliminar ${slug}?`)) return;
    try {
      const res = await fetch("/api/admin/delete-property", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ password, slug }),
      });
      const data = await res.json();
      if (data.ok) { setStatus("✅ Eliminada"); fetchProperties(); }
      else setStatus(`❌ ${data.error}`);
    } catch {}
  };

  const toggleSort = (field: "precio"|"zona") => {
    setSort(prev => ({ field, dir: prev.field===field && prev.dir==="asc" ? "desc" : "asc" }));
  };

  const filtered = properties.filter(p => {
    const title = typeof p.titulo==="object" ? (p.titulo.es||p.titulo.en||"") : p.titulo;
    if (filters.search && !title.toLowerCase().includes(filters.search.toLowerCase()) && !p.slug.includes(filters.search) && !(p.referencia||"").toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.tipo && p.tipo!==filters.tipo) return false;
    if (filters.zona && p.zona!==filters.zona) return false;
    if (filters.activa==="activa" && !p.activa) return false;
    if (filters.activa==="borrador" && p.activa) return false;
    return true;
  }).sort((a,b) => {
    if (!sort.field) return 0;
    if (sort.field==="precio") return sort.dir==="asc" ? a.precio-b.precio : b.precio-a.precio;
    if (sort.field==="zona") { const az=a.zona||"", bz=b.zona||""; return sort.dir==="asc" ? az.localeCompare(bz) : bz.localeCompare(az); }
    return 0;
  });

  return (
    <div style={{ padding:"32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Panel de Administración</p>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111", margin:0 }}>Portfolio</h1>
        </div>
        <span style={{ background:"#f3f4f6", padding:"4px 12px", borderRadius:"20px", fontSize:"13px", color:"#6b7280" }}>{filtered.length} propiedades</span>
      </div>

      {/* Filtros */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:"12px", marginBottom:"24px", background:"white", padding:"16px", borderRadius:"8px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
        <div>
          <label style={L}>Buscar</label>
          <input value={filters.search} onChange={e=>setFilters(p=>({...p,search:e.target.value}))} placeholder="Nombre o slug..." style={{...S,width:"100%",boxSizing:"border-box"}}/>
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
          <label style={L}>Zona</label>
          <select value={filters.zona} onChange={e=>setFilters(p=>({...p,zona:e.target.value}))} style={S}>
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

      {status && (
        <div style={{ padding:"10px 16px", borderRadius:"6px", marginBottom:"16px", background:status.startsWith("✅")?"#f0fdf4":"#fef2f2", border:`1px solid ${status.startsWith("✅")?"#86efac":"#fca5a5"}`, color:status.startsWith("✅")?"#166534":"#991b1b", fontSize:"13px" }}>
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
                <th style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>Ref</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>Propiedad</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>Tipo</th>
                <th onClick={()=>toggleSort("zona")} style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", cursor:"pointer" }}>
                  Zona {sort.field==="zona"?(sort.dir==="asc"?"↑":"↓"):"↕"}
                </th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>Ubicación</th>
                <th onClick={()=>toggleSort("precio")} style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", cursor:"pointer" }}>
                  Precio {sort.field==="precio"?(sort.dir==="asc"?"↑":"↓"):"↕"}
                </th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>Estado</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>Destacada</th>
                <th style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i) => {
                const title = typeof p.titulo==="object" ? (p.titulo.es||p.titulo.en||p.slug) : p.titulo;
                return (
                  <tr key={p.slug} style={{ borderBottom:"1px solid #f3f4f6", background:i%2===0?"white":"#fafafa" }}>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ fontFamily:"monospace", fontSize:"12px", fontWeight:700, color:"#7c3aed", background:"#f5f3ff", padding:"3px 8px", borderRadius:"4px", whiteSpace:"nowrap" }}>{p.referencia||"—"}</span>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ fontWeight:600, fontSize:"14px", color:"#111" }}>{title}</div>
                      <div style={{ fontSize:"12px", color:"#9ca3af", marginTop:"2px" }}>{p.slug}</div>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151" }}>{p.tipo||"—"}</td>
                    <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151", textTransform:"capitalize" }}>{p.zona||"—"}</td>
                    <td style={{ padding:"14px 16px", fontSize:"13px", color:"#374151" }}>{p.ubicacion||"—"}</td>
                    <td style={{ padding:"14px 16px", fontSize:"13px", fontWeight:600, color:"#111" }}>{p.precio?`€${(p.precio/1000000).toFixed(1)}M`:"—"}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <button onClick={()=>handleToggle(p.slug,"activa",p.activa)}
                        style={{ padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:600, border:"none", cursor:"pointer", background:p.activa?"#dcfce7":"#f3f4f6", color:p.activa?"#166534":"#6b7280" }}>
                        {p.activa?"Publicada":"Borrador"}
                      </button>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <button onClick={()=>handleToggle(p.slug,"destacada",p.destacada)}
                        style={{ padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:600, border:"none", cursor:"pointer", background:p.destacada?"#fef3c7":"#f3f4f6", color:p.destacada?"#92400e":"#6b7280" }}>
                        {p.destacada?"⭐ Sí":"No"}
                      </button>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ display:"flex", gap:"6px" }}>
                        <a href={`/es/propiedades/${p.slug}`} target="_blank"
                          style={{ padding:"6px 10px", background:"#f3f4f6", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#374151", textDecoration:"none" }}>Ver →</a>
                        <button onClick={()=>handleEdit(p)}
                          style={{ padding:"6px 10px", background:"#eff6ff", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#1d4ed8" }}>Editar</button>
                        <button onClick={()=>handleDelete(p.slug)}
                          style={{ padding:"6px 10px", background:"#fef2f2", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#991b1b" }}>Eliminar</button>
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
        <div onClick={()=>setEditing(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"white", borderRadius:"12px", padding:"32px", width:"100%", maxWidth:"680px", maxHeight:"90vh", overflowY:"auto" }}>
            <h2 style={{ fontSize:"18px", fontWeight:700, marginBottom:"24px", color:"#111" }}>Editar — {editing.slug}</h2>

            {/* Selector idioma */}
            <label style={L}>Idioma activo</label>
            <select value={lang} onChange={e=>setLang(e.target.value)}
              style={{ ...INP, cursor:"pointer" }}>
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇬🇧 English</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="ru">🇷🇺 Русский</option>
            </select>

            {/* Título */}
            <label style={L}>Título ({lang.toUpperCase()})</label>
            <div style={{ display:"flex", gap:"8px", marginBottom:"16px" }}>
              <input value={titulo[lang]||""}
                onChange={e=>setTitulo(p=>({...p,[lang]:e.target.value}))}
                style={{ ...INP, marginBottom:0, flex:1 }}/>
              <button onClick={()=>handleTranslate("titulo")} disabled={translating}
                style={{ padding:"10px 16px", background:"#7c3aed", color:"white", border:"none", borderRadius:"6px", fontSize:"13px", cursor:"pointer", whiteSpace:"nowrap" }}>
                {translating?"...":"Traducir →4"}
              </button>
            </div>

            {/* Descripción */}
            <label style={L}>Descripción ({lang.toUpperCase()})</label>
            <div style={{ display:"flex", gap:"8px", marginBottom:"16px" }}>
              <textarea value={descripcion[lang]||""}
                onChange={e=>setDescripcion(p=>({...p,[lang]:e.target.value}))}
                rows={6} style={{ ...INP, marginBottom:0, flex:1, resize:"vertical" }}/>
              <button onClick={()=>handleTranslate("descripcion")} disabled={translating}
                style={{ padding:"10px 16px", background:"#7c3aed", color:"white", border:"none", borderRadius:"6px", fontSize:"13px", cursor:"pointer", alignSelf:"flex-start", whiteSpace:"nowrap" }}>
                {translating?"...":"Traducir →4"}
              </button>
            </div>

            {/* Indicador de traducciones */}
            <div style={{ display:"flex", gap:"8px", marginBottom:"24px" }}>

              <div style={{marginBottom:"1rem"}}>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"4px"}}>Tipo</label>
                <select value={editFields.tipo||""} onChange={e=>setEditFields((p:any)=>({...p,tipo:e.target.value}))} style={{...INP}}>
                  <option value="">— Seleccionar —</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="plot">Plot</option>
                </select>
              </div>
              <div style={{marginBottom:"1rem"}}>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"4px"}}>Zona</label>
                <select value={editFields.zona||""} onChange={e=>setEditFields((p:any)=>({...p,zona:e.target.value}))} style={{...INP}}>
                  <option value="">— Seleccionar —</option>
                  <option value="marbella">Marbella</option>
                  <option value="estepona">Estepona</option>
                  <option value="mijas">Mijas</option>
                  <option value="benahavis">Benahavís</option>
                  <option value="sotogrande">Sotogrande</option>
                </select>
              </div>
              {["es","en","fr","ru"].map(l => (
                <span key={l} onClick={()=>setLang(l)} style={{
                  padding:"4px 10px", borderRadius:"20px", fontSize:"11px", cursor:"pointer",
                  fontWeight: l===lang ? 700 : 400,
                  background: titulo[l] ? "#dcfce7" : "#f3f4f6",
                  color: titulo[l] ? "#166534" : "#9ca3af",
                  border: l===lang ? "2px solid #7c3aed" : "2px solid transparent",
                }}>{l.toUpperCase()} {titulo[l]?"✓":""}</span>
              ))}
            </div>

            {/* Campos numéricos */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              {[
                {label:"Precio (€)", field:"precio", type:"number"},
                {label:"Habitaciones", field:"habitaciones", type:"number"},
                {label:"Baños", field:"banos", type:"number"},
                {label:"M² Construidos", field:"m2_construidos", type:"number"},
                {label:"M² Parcela", field:"m2_parcela", type:"number"},
                {label:"Ubicación", field:"ubicacion", type:"text"},
              ].map(({label,field,type})=>(
                <div key={field}>
                  <label style={L}>{label}</label>
                  <input type={type} value={editFields[field]||""}
                    onChange={e=>setEditFields((p:any)=>({...p,[field]:type==="number"?parseFloat(e.target.value)||0:e.target.value}))}
                    style={INP}/>
                </div>
              ))}
            </div>

            {/* Selects */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"16px", marginBottom:"16px" }}>
              <div>
                <label style={L}>Estado</label>
                <select value={editFields.estado||""} onChange={e=>setEditFields((p:any)=>({...p,estado:e.target.value}))} style={{...INP}}>
                  <option value="">—</option>
                  <option value="nueva">Nueva construcción</option>
                  <option value="buen-estado">Buen estado</option>
                  <option value="reformado">Reformado</option>
                  <option value="a-reformar">A reformar</option>
                </select>
              </div>
              <div>
                <label style={L}>Orientación</label>
                <select value={editFields.orientacion||""} onChange={e=>setEditFields((p:any)=>({...p,orientacion:e.target.value}))} style={{...INP}}>
                  <option value="">—</option>
                  <option value="sur">Sur</option>
                  <option value="norte">Norte</option>
                  <option value="este">Este</option>
                  <option value="oeste">Oeste</option>
                  <option value="sur-este">Sur-Este</option>
                  <option value="sur-oeste">Sur-Oeste</option>
                </select>
              </div>
              <div>
                <label style={L}>Amueblado</label>
                <select value={editFields.amueblado||"no"} onChange={e=>setEditFields((p:any)=>({...p,amueblado:e.target.value}))} style={{...INP}}>
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                  <option value="parcial">Parcial</option>
                </select>
              </div>
              <div>
                <label style={L}>Cert. Energético</label>
                <select value={editFields.certificado_energetico||""} onChange={e=>setEditFields((p:any)=>({...p,certificado_energetico:e.target.value}))} style={{...INP}}>
                  <option value="">—</option>
                  {["A","B","C","D","E","F","G"].map(l=><option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Amenidades */}
            <label style={L}>Amenidades</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"16px" }}>
              {["Piscina","Jardín","Terraza","Ascensor","Aire acondicionado","Calefacción","Seguridad 24h","Spa","Gimnasio","Garaje","Trastero","Bodega","Cine","Sala de juegos","Pista de tenis","Paddle","Domótica","Vistas al mar","Primera línea de playa","Acceso directo playa","Urbanización cerrada"].map(a=>{
                const amenidades = editFields.amenidades || [];
                const isChecked = amenidades.includes(a);
                return (
                  <label key={a} onClick={()=>setEditFields((p:any)=>({...p,amenidades:isChecked?amenidades.filter((x:string)=>x!==a):[...amenidades,a]}))}
                    style={{ fontSize:"12px", cursor:"pointer", padding:"5px 10px", border:`1px solid ${isChecked?"#2563eb":"#d1d5db"}`, borderRadius:"20px", background:isChecked?"#eff6ff":"white", color:isChecked?"#1d4ed8":"#374151" }}>
                    {a}
                  </label>
                );
              })}
            </div>

            <label style={L}>URL Video — acepta Google Drive</label>
            <input value={editFields.video_url||""} onChange={e=>setEditFields((p:any)=>({...p,video_url:e.target.value}))} style={INP}/>

            <label style={L}>URLs Galería (una por línea)</label>
            <textarea value={editFields.galeria_urls||""} onChange={e=>setEditFields((p:any)=>({...p,galeria_urls:e.target.value}))}
              rows={4} style={{...INP,resize:"vertical"}}/>
            <ImageSorter
             urls={(editFields.galeria_urls||"").split("\n").map((s:string)=>s.trim()).filter(Boolean)}
             onChange={urls => setEditFields((p:any)=>({...p, galeria_urls: urls.join("\n")}))}
             onSave={handleSaveEdit}
           />

            {/* Contacto propiedad */}
            <div style={{marginBottom:"1.5rem",paddingTop:"1rem",borderTop:"1px solid #e5e7eb"}}>
              <p style={{fontSize:"11px",fontWeight:700,color:"#374151",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"1rem"}}>Contacto Propiedad</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem",marginBottom:"1rem"}}>
                <div>
                  <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"4px"}}>Nombre</label>
                  <input value={editFields.contacto_nombre||""} onChange={e=>setEditFields((p:any)=>({...p,contacto_nombre:e.target.value}))} style={INP} placeholder="Nombre del contacto"/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"4px"}}>Teléfono</label>
                  <input value={editFields.contacto_telefono||""} onChange={e=>setEditFields((p:any)=>({...p,contacto_telefono:e.target.value}))} style={INP} placeholder="+34 600 000 000"/>
                </div>
              </div>
              <div>
                <label style={{display:"block",fontSize:"11px",fontWeight:600,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:"4px"}}>Email</label>
                <input value={editFields.contacto_email||""} onChange={e=>setEditFields((p:any)=>({...p,contacto_email:e.target.value}))} style={INP} placeholder="email@ejemplo.com"/>
              </div>
            </div>
            <div style={{ display:"flex", gap:"16px", marginBottom:"24px" }}>
              <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"14px", cursor:"pointer" }}>
                <input type="checkbox" checked={editFields.activa||false} onChange={e=>setEditFields((p:any)=>({...p,activa:e.target.checked}))}/>
                Publicada
              </label>
              <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"14px", cursor:"pointer" }}>
                <input type="checkbox" checked={editFields.destacada||false} onChange={e=>setEditFields((p:any)=>({...p,destacada:e.target.checked}))}/>
                Destacada
              </label>
            </div>

            {/* Status */}
            {status && (
              <div style={{ padding:"12px", borderRadius:"6px", marginBottom:"16px", background:status.startsWith("✅")?"#f0fdf4":"#fef2f2", border:`1px solid ${status.startsWith("✅")?"#86efac":"#fca5a5"}`, color:status.startsWith("✅")?"#166534":"#991b1b", fontSize:"13px" }}>
                {status}
              </div>
            )}

            <div style={{ display:"flex", gap:"12px" }}>
              <button onClick={()=>setEditing(null)} style={{ flex:1, padding:"12px", background:"#f3f4f6", border:"none", borderRadius:"6px", fontSize:"13px", cursor:"pointer", color:"#374151" }}>Cancelar</button>
              <button onClick={handleSaveEdit} style={{ flex:2, padding:"12px", background:"#16a34a", color:"white", border:"none", borderRadius:"6px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>✦ Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
