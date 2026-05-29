"use client";
import { useState, useEffect } from "react";

const CATEGORIAS = ["venta","captacion","agencia","colaborador","proveedor"] as const;
type Categoria = typeof CATEGORIAS[number];

const CAT_COLORS: Record<Categoria, string> = {
  venta:        "#16a34a",
  captacion:    "#2563eb",
  agencia:      "#7c3aed",
  colaborador:  "#d97706",
  proveedor:    "#6b7280",
};

const CAT_LABELS: Record<Categoria, string> = {
  venta:        "Venta",
  captacion:    "Captación",
  agencia:      "Agencia",
  colaborador:  "Colaborador",
  proveedor:    "Proveedor",
};

interface Contacto {
  id: string;
  created_at: string;
  categoria: Categoria;
  nombre: string;
  email: string;
  telefono: string;
  propiedad_interes: string;
  notas: string;
  activo: boolean;
  origen: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Prefer": "return=representation",
};

const INP: React.CSSProperties = {
  width:"100%", padding:"8px 10px", border:"1px solid #e5e7eb",
  borderRadius:"6px", fontSize:"13px", boxSizing:"border-box" as const,
  fontFamily:"inherit", outline:"none",
};

const EMPTY: Omit<Contacto,"id"|"created_at"|"origen"> = {
  categoria:"venta", nombre:"", email:"", telefono:"",
  propiedad_interes:"", notas:"", activo:true,
};

interface Props { password: string; }

export default function Contactos({ password }: Props) {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Categoria|"">("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Contacto|null>(null);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [showNew, setShowNew] = useState(false);
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<{field:string|null,dir:"asc"|"desc"}>({field:null,dir:"asc"});
  const toggleSort = (field:string) => setSort(p=>({field,dir:p.field===field&&p.dir==="asc"?"desc":"asc"}));

  const fetch_ = async () => {
    setLoading(true);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contactos?order=created_at.desc&limit=200`, { headers });
    const data = await res.json();
    setContactos(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const sorted = [...contactos].sort((a,b)=>{
    if(!sort.field) return 0;
    const f=sort.field as keyof typeof a;
    const av=a[f],bv=b[f];
    if(typeof av==="number"&&typeof bv==="number") return sort.dir==="asc"?av-bv:bv-av;
    return sort.dir==="asc"?String(av||"").localeCompare(String(bv||"")):String(bv||"").localeCompare(String(av||""));
  });
  const filtered = sorted.filter(c => {
    if (filtro && c.categoria !== filtro) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!c.nombre?.toLowerCase().includes(s) && !c.email?.toLowerCase().includes(s) && !c.telefono?.includes(s)) return false;
    }
    return true;
  });

  const handleSave = async () => {
    setStatus("Guardando...");
    if (editing) {
      await fetch(`${SUPABASE_URL}/rest/v1/contactos?id=eq.${editing.id}`, {
        method:"PATCH", headers, body: JSON.stringify(form),
      });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/contactos`, {
        method:"POST", headers, body: JSON.stringify({ ...form, origen:"manual" }),
      });
    }
    setStatus("✅ Guardado");
    setEditing(null); setShowNew(false);
    setForm({ ...EMPTY });
    fetch_();
    setTimeout(() => setStatus(""), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar contacto?")) return;
    await fetch(`${SUPABASE_URL}/rest/v1/contactos?id=eq.${id}`, { method:"DELETE", headers });
    fetch_();
  };

  const toggleActivo = async (c: Contacto) => {
    await fetch(`${SUPABASE_URL}/rest/v1/contactos?id=eq.${c.id}`, {
      method:"PATCH", headers, body: JSON.stringify({ activo: !c.activo }),
    });
    fetch_();
  };

  const openEdit = (c: Contacto) => {
    setEditing(c);
    setForm({ categoria:c.categoria, nombre:c.nombre, email:c.email||"", telefono:c.telefono||"", propiedad_interes:c.propiedad_interes||"", notas:c.notas||"", activo:c.activo });
    setShowNew(true);
  };

  const counts = CATEGORIAS.reduce((acc, cat) => {
    acc[cat] = contactos.filter(c => c.categoria === cat).length;
    return acc;
  }, {} as Record<Categoria, number>);

  return (
    <div style={{ padding:"2rem", maxWidth:"1200px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"1.5rem" }}>
        <div>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111827", margin:0 }}>Contactos</h1>
          <p style={{ color:"#6b7280", fontSize:"13px", margin:"4px 0 0" }}>{contactos.length} contactos en total</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({...EMPTY}); setShowNew(true); }} style={{ background:"#111827", color:"white", border:"none", borderRadius:"6px", padding:"10px 18px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
          + Nuevo Contacto
        </button>
      </div>

      {/* Resumen categorías */}
      <div style={{ display:"flex", gap:"0.75rem", flexWrap:"wrap", marginBottom:"1.5rem" }}>
        {CATEGORIAS.map(cat => (
          <button key={cat} onClick={() => setFiltro(filtro === cat ? "" : cat)} style={{
            padding:"6px 14px", borderRadius:"20px", border:"2px solid",
            borderColor: filtro === cat ? CAT_COLORS[cat] : "#e5e7eb",
            background: filtro === cat ? CAT_COLORS[cat] : "white",
            color: filtro === cat ? "white" : "#374151",
            fontSize:"12px", fontWeight:600, cursor:"pointer",
          }}>
            {CAT_LABELS[cat]} · {counts[cat]}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre, email o teléfono..." style={{...INP, marginBottom:"1rem", maxWidth:"400px"}}/>

      {/* Tabla */}
      {loading ? <p style={{color:"#6b7280"}}>Cargando...</p> : (
        <div style={{ background:"white", borderRadius:"8px", border:"1px solid #e5e7eb", overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f9fafb" }}>
                {["Categoría","Nombre","Email","Teléfono","Propiedad","Origen","Activo","Acciones"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderTop:"1px solid #f3f4f6", background: i%2===0?"white":"#fafafa" }}>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ background:CAT_COLORS[c.categoria], color:"white", borderRadius:"4px", padding:"2px 8px", fontSize:"11px", fontWeight:600 }}>
                      {CAT_LABELS[c.categoria]}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px", fontSize:"13px", fontWeight:600, color:"#111827" }}>{c.nombre}</td>
                  <td style={{ padding:"12px 16px", fontSize:"13px", color:"#374151" }}>{c.email||"—"}</td>
                  <td style={{ padding:"12px 16px", fontSize:"13px", color:"#374151" }}>{c.telefono||"—"}</td>
                  <td style={{ padding:"12px 16px", fontSize:"13px", color:"#374151" }}>{c.propiedad_interes||"—"}</td>
                  <td style={{ padding:"12px 16px", fontSize:"11px", color:"#6b7280" }}>{c.origen}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <button onClick={()=>toggleActivo(c)} style={{ background:c.activo?"#dcfce7":"#f3f4f6", color:c.activo?"#16a34a":"#6b7280", border:"none", borderRadius:"4px", padding:"2px 8px", fontSize:"11px", fontWeight:600, cursor:"pointer" }}>
                      {c.activo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td style={{ padding:"12px 16px", display:"flex", gap:"8px" }}>
                    <button onClick={()=>openEdit(c)} style={{ background:"#eff6ff", color:"#2563eb", border:"none", borderRadius:"4px", padding:"4px 10px", fontSize:"12px", cursor:"pointer" }}>Editar</button>
                    <button onClick={()=>handleDelete(c.id)} style={{ background:"#fef2f2", color:"#dc2626", border:"none", borderRadius:"4px", padding:"4px 10px", fontSize:"12px", cursor:"pointer" }}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding:"2rem", textAlign:"center", color:"#6b7280", fontSize:"13px" }}>Sin contactos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal nuevo/editar */}
      {showNew && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
          onClick={e=>{ if(e.target===e.currentTarget){setShowNew(false);setEditing(null);} }}>
          <div style={{ background:"white", borderRadius:"12px", padding:"2rem", width:"100%", maxWidth:"560px", maxHeight:"90vh", overflowY:"auto" }}>
            <h2 style={{ fontSize:"18px", fontWeight:700, marginBottom:"1.5rem" }}>{editing ? "Editar Contacto" : "Nuevo Contacto"}</h2>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
              <div>
                <label style={{ display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>Categoría</label>
                <select value={form.categoria} onChange={e=>setForm(p=>({...p,categoria:e.target.value as Categoria}))} style={INP}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>Nombre *</label>
                <input value={form.nombre} onChange={e=>setForm(p=>({...p,nombre:e.target.value}))} style={INP} placeholder="Nombre completo"/>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
              <div>
                <label style={{ display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>Email</label>
                <input value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} style={INP} placeholder="email@ejemplo.com"/>
              </div>
              <div>
                <label style={{ display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>Teléfono</label>
                <input value={form.telefono} onChange={e=>setForm(p=>({...p,telefono:e.target.value}))} style={INP} placeholder="+34 600 000 000"/>
              </div>
            </div>

            <div style={{ marginBottom:"1rem" }}>
              <label style={{ display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>Propiedad de Interés</label>
              <input value={form.propiedad_interes} onChange={e=>setForm(p=>({...p,propiedad_interes:e.target.value}))} style={INP} placeholder="Nombre o slug de la propiedad"/>
            </div>

            <div style={{ marginBottom:"1rem" }}>
              <label style={{ display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>Notas</label>
              <textarea value={form.notas} onChange={e=>setForm(p=>({...p,notas:e.target.value}))} style={{...INP,height:"80px",resize:"vertical"}} placeholder="Notas adicionales..."/>
            </div>

            <div style={{ marginBottom:"1.5rem" }}>
              <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", cursor:"pointer" }}>
                <input type="checkbox" checked={form.activo} onChange={e=>setForm(p=>({...p,activo:e.target.checked}))}/>
                Activo
              </label>
            </div>

            {status && <p style={{ color:"#16a34a", fontSize:"13px", marginBottom:"1rem" }}>{status}</p>}

            <div style={{ display:"flex", gap:"12px" }}>
              <button onClick={()=>{setShowNew(false);setEditing(null);}} style={{ flex:1, padding:"10px", background:"#f3f4f6", border:"none", borderRadius:"6px", fontSize:"13px", cursor:"pointer" }}>Cancelar</button>
              <button onClick={handleSave} style={{ flex:2, padding:"10px", background:"#111827", color:"white", border:"none", borderRadius:"6px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
                {editing ? "Guardar Cambios" : "Crear Contacto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
