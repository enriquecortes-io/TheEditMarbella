"use client";
import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [status, setStatus] = useState("");
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState<Record<string,Record<string,string>>>({});

  const [form, setForm] = useState({
    slug: "", sourceLang: "es", tipo: "",
    titulo: "", descripcion: "",
    precio: "", habitaciones: "", banos: "",
    m2Construidos: "", m2Parcela: "", tieneJardin: false,
    ubicacion: "", videoUrl: "",
    galeriaUrls: "", destacada: false, activa: false,
  });

  useEffect(() => {
    if (localStorage.getItem("mdlm_admin") === "mdlm2026secure") setAuth(true);
  }, []);

  const generateSlug = (text: string) =>
    text.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim().replace(/\s+/g, "-");

  const handleAuth = () => {
    if (password === "mdlm2026secure") {
      setAuth(true);
      localStorage.setItem("mdlm_admin", "mdlm2026secure");
    } else setStatus("Contraseña incorrecta");
  };

  const handleTranslate = async (field: "titulo" | "descripcion") => {
    if (!form[field]) return;
    setTranslating(true);
    setStatus(`Traduciendo ${field}...`);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: form[field], sourceLang: form.sourceLang }),
      });
      const data = await res.json();
      setTranslated(prev => ({ ...prev, [field]: data.translations }));
      setStatus(`✅ ${field} traducido en 4 idiomas`);
    } catch {
      setStatus("❌ Error al traducir");
    }
    setTranslating(false);
  };

  const handleSave = async (publish = false) => {
    setStatus(`⏳ Intentando guardar: slug=${form.slug} titulo=${form.titulo} precio=${form.precio}`);
    if (!form.slug || !form.titulo || !form.precio) {
      setStatus("❌ Slug, título y precio son obligatorios");
      return;
    }
    setStatus("Guardando...");
    try {
      const property = {
        slug: form.slug,
        tipo: form.tipo,
        titulo: translated.titulo || { [form.sourceLang]: form.titulo },
        descripcion: translated.descripcion || { [form.sourceLang]: form.descripcion },
        precio: parseFloat(form.precio),
        habitaciones: parseInt(form.habitaciones) || 0,
        banos: parseInt(form.banos) || 0,
        m2_construidos: parseInt(form.m2Construidos) || 0,
        m2_parcela: form.tieneJardin ? (parseInt(form.m2Parcela) || 0) : 0,
        ubicacion: form.ubicacion,
        video_url: form.videoUrl,
        galeria_urls: form.galeriaUrls.split("\n").map(s=>s.trim()).filter(Boolean),
        infografias: [],
        destacada: form.destacada,
        activa: publish ? true : form.activa,
      };

      const res = await fetch("/api/admin/save-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, property }),
      });
      const data = await res.json();
      if (data.ok) setStatus(publish ? "✅ Propiedad publicada" : "✅ Borrador guardado");
      else setStatus(`❌ ${data.error}`);
    } catch {
      setStatus("❌ Error al guardar");
    }
  };

  const F: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1px solid #d1d5db", borderRadius: "6px",
    fontSize: "14px", fontFamily: "system-ui",
    background: "white", color: "#111",
    outline: "none", boxSizing: "border-box",
    marginBottom: "16px",
  };
  const L: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 600,
    color: "#6b7280", textTransform: "uppercase",
    letterSpacing: "0.08em", marginBottom: "4px",
  };
  const BTN = (color = "#2563eb"): React.CSSProperties => ({
    padding: "10px 20px", background: color,
    color: "white", border: "none", borderRadius: "6px",
    fontSize: "13px", fontWeight: 600, cursor: "pointer",
    fontFamily: "system-ui",
  });

  if (!auth) return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"white", padding:"40px", borderRadius:"12px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", width:"360px" }}>
        <h2 style={{ fontFamily:"system-ui", fontSize:"20px", fontWeight:700, marginBottom:"24px", color:"#111" }}>Admin — MDLM</h2>
        <label style={L}>Contraseña</label>
        <input type="password" name="password" autoComplete="current-password"
          value={password} onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleAuth()}
          style={F} placeholder="••••••••"
        />
        <button onClick={handleAuth} style={{...BTN(), width:"100%"}}>Entrar</button>
        {status && <p style={{color:"#ef4444",marginTop:"12px",fontSize:"13px"}}>{status}</p>}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", padding:"40px 24px", fontFamily:"system-ui" }}>
      <div style={{ maxWidth:"900px", margin:"0 auto" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"32px" }}>
          <div>
            <p style={{ fontSize:"12px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:0 }}>Panel de Administración</p>
            <h1 style={{ fontSize:"28px", fontWeight:700, color:"#111", margin:"4px 0 0" }}>Nueva Propiedad</h1>
          </div>
          <button onClick={()=>{localStorage.removeItem("mdlm_admin");setAuth(false);}}
            style={{ background:"none", border:"1px solid #d1d5db", borderRadius:"6px", padding:"8px 16px", fontSize:"13px", cursor:"pointer", color:"#6b7280" }}>
            Salir
          </button>
        </div>

        {/* Status */}
        {status && (
          <div style={{
            padding:"12px 16px", borderRadius:"8px", marginBottom:"24px",
            background: status.startsWith("✅") ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${status.startsWith("✅") ? "#86efac" : "#fca5a5"}`,
            color: status.startsWith("✅") ? "#166534" : "#991b1b",
            fontSize:"14px",
          }}>{status}</div>
        )}

        <div style={{ background:"white", borderRadius:"12px", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", padding:"32px" }}>

          {/* Idioma */}
          <label style={L}>Idioma del texto</label>
          <select value={form.sourceLang} onChange={e=>setForm(p=>({...p,sourceLang:e.target.value}))} style={F}>
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ru">Русский</option>
          </select>

          {/* Título + slug */}
          <label style={L}>Título</label>
          <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
            <input value={form.titulo}
              onChange={e=>setForm(p=>({...p, titulo:e.target.value, slug:generateSlug(e.target.value)}))}
              placeholder="Villa Annabel" style={{...F, marginBottom:0, flex:1}}
            />
            <button onClick={()=>handleTranslate("titulo")} disabled={translating} style={BTN("#7c3aed")}>
              {translating ? "..." : "Traducir"}
            </button>
          </div>
          {translated.titulo && (
            <div style={{ background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:"6px", padding:"12px", marginBottom:"16px", fontSize:"13px" }}>
              {Object.entries(translated.titulo).map(([lang,txt])=>(
                <div key={lang} style={{marginBottom:"4px"}}><strong style={{color:"#7c3aed"}}>{lang.toUpperCase()}:</strong> {txt}</div>
              ))}
            </div>
          )}

          {/* Tipo */}
          <label style={L}>Tipo de Propiedad</label>
          <select value={form.tipo} onChange={e=>setForm(p=>({...p,tipo:e.target.value}))} style={F}>
            <option value="">— Seleccionar —</option>
            <option value="villa">Villa</option>
            <option value="casa-adosada">Casa Adosada</option>
            <option value="atico">Apartamento — Ático</option>
            <option value="media-planta">Apartamento — Media Planta</option>
            <option value="bajo">Apartamento — Bajo</option>
            <option value="terreno">Terreno</option>
          </select>

          {/* Slug */}
          <label style={L}>Slug (URL)</label>
          <input value={form.slug} onChange={e=>setForm(p=>({...p,slug:e.target.value}))}
            placeholder="villa-annabel" style={F}/>

          {/* Descripción */}
          <label style={L}>Descripción</label>
          <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
            <textarea value={form.descripcion} onChange={e=>setForm(p=>({...p,descripcion:e.target.value}))}
              placeholder="Descripción de la propiedad..." rows={4}
              style={{...F, marginBottom:0, flex:1, resize:"vertical"}}/>
            <button onClick={()=>handleTranslate("descripcion")} disabled={translating} style={{...BTN("#7c3aed"), alignSelf:"flex-start"}}>
              {translating ? "..." : "Traducir"}
            </button>
          </div>
          {translated.descripcion && (
            <div style={{ background:"#f5f3ff", border:"1px solid #ddd6fe", borderRadius:"6px", padding:"12px", marginBottom:"16px", fontSize:"13px" }}>
              {Object.entries(translated.descripcion).map(([lang,txt])=>(
                <div key={lang} style={{marginBottom:"6px"}}><strong style={{color:"#7c3aed"}}>{lang.toUpperCase()}:</strong> {txt}</div>
              ))}
            </div>
          )}

          {/* Grid numéricos */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"16px" }}>
            <div>
              <label style={L}>Precio (€)</label>
              <input type="number" value={form.precio} onChange={e=>setForm(p=>({...p,precio:e.target.value}))}
                placeholder="4500000" style={F}/>
            </div>
            <div>
              <label style={L}>Habitaciones</label>
              <input type="number" value={form.habitaciones} onChange={e=>setForm(p=>({...p,habitaciones:e.target.value}))}
                placeholder="6" style={F}/>
            </div>
            <div>
              <label style={L}>Baños</label>
              <input type="number" value={form.banos} onChange={e=>setForm(p=>({...p,banos:e.target.value}))}
                placeholder="4" style={F}/>
            </div>
            <div>
              <label style={L}>M² Construidos</label>
              <input type="number" value={form.m2Construidos} onChange={e=>setForm(p=>({...p,m2Construidos:e.target.value}))}
                placeholder="1200" style={F}/>
            </div>
            <div>
              <label style={L}>
                <input type="checkbox" checked={form.tieneJardin}
                  onChange={e=>setForm(p=>({...p,tieneJardin:e.target.checked}))}
                  style={{marginRight:"6px"}}/>
                M² Parcela/Jardín
              </label>
              {form.tieneJardin && (
                <input type="number" value={form.m2Parcela} onChange={e=>setForm(p=>({...p,m2Parcela:e.target.value}))}
                  placeholder="3500" style={F}/>
              )}
            </div>
            <div>
              <label style={L}>Ubicación</label>
              <input value={form.ubicacion} onChange={e=>setForm(p=>({...p,ubicacion:e.target.value}))}
                placeholder="Golden Mile, Marbella" style={F}/>
            </div>
          </div>

          {/* Video */}
          <label style={L}>URL del Video</label>
          <input value={form.videoUrl} onChange={e=>setForm(p=>({...p,videoUrl:e.target.value}))}
            placeholder="/videos/hero.mp4" style={F}/>

          {/* Galería */}
          <label style={L}>URLs de Galería (una por línea)</label>
          <textarea value={form.galeriaUrls} onChange={e=>setForm(p=>({...p,galeriaUrls:e.target.value}))}
            placeholder="/gallery/foto1.jpg&#10;/gallery/foto2.jpg" rows={5}
            style={{...F, resize:"vertical"}}/>

          {/* Opciones */}
          <div style={{ display:"flex", gap:"24px", marginBottom:"24px" }}>
            <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"14px", cursor:"pointer" }}>
              <input type="checkbox" checked={form.destacada} onChange={e=>setForm(p=>({...p,destacada:e.target.checked}))}/>
              Destacada
            </label>
            <label style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"14px", cursor:"pointer" }}>
              <input type="checkbox" checked={form.activa} onChange={e=>setForm(p=>({...p,activa:e.target.checked}))}/>
              Activa
            </label>
          </div>

          {/* Botones */}
          <div style={{ display:"flex", gap:"12px" }}>
            <button onClick={()=>handleSave(false)} style={{...BTN("#6b7280"), flex:1}}>
              Guardar Borrador
            </button>
            <button onClick={()=>handleSave(true)} style={{...BTN("#16a34a"), flex:2}}>
              ✦ Publicar Propiedad
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
