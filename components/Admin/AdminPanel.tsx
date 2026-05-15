"use client";
import { useState } from "react";

const INPUT = {
  background:"transparent",
  border:"none",
  borderBottom:"1px solid rgba(255,255,255,0.15)",
  color:"white",
  fontFamily:"'Helvetica Neue',sans-serif",
  fontSize:"0.9rem",
  fontWeight:200,
  padding:"0.6rem 0",
  outline:"none",
  width:"100%",
  marginBottom:"1.5rem",
} as React.CSSProperties;

const LABEL = {
  fontFamily:"'Helvetica Neue',sans-serif",
  fontSize:"0.4rem",
  color:"rgba(201,169,110,0.7)",
  letterSpacing:"0.5em",
  textTransform:"uppercase" as const,
  display:"block",
  marginBottom:"0.3rem",
};

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [status, setStatus] = useState("");
  const [translating, setTranslating] = useState(false);

  const [form, setForm] = useState({
    slug: "", sourceLang: "es",
    titulo: "", descripcion: "",
    precio: "", habitaciones: "", banos: "",
    m2Construidos: "", m2Parcela: "",
    ubicacion: "", videoUrl: "",
    galeriaUrls: "", destacada: false, activa: true,
  });

  const [translated, setTranslated] = useState<Record<string,Record<string,string>>>({});

  const handleAuth = () => {
    if (password === "mdlm2026secure") setAuth(true);
    else setStatus("❌ Contraseña incorrecta");
  };

  const handleTranslate = async (field: "titulo" | "descripcion") => {
    const text = form[field];
    if (!text) return;
    setTranslating(true);
    setStatus(`Traduciendo ${field}...`);
    try {
      const res = await fetch("/api/admin/translate", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ text, sourceLang: form.sourceLang }),
      });
      const data = await res.json();
      setTranslated(prev => ({ ...prev, [field]: data.translations }));
      setStatus(`✅ ${field} traducido`);
    } catch {
      setStatus("❌ Error al traducir");
    }
    setTranslating(false);
  };

  const handleSave = async () => {
    if (!form.slug || !form.titulo || !form.precio) {
      setStatus("❌ Slug, título y precio son obligatorios");
      return;
    }
    setStatus("Guardando...");
    try {
      const tituloFinal = translated.titulo || { [form.sourceLang]: form.titulo };
      const descFinal = translated.descripcion || { [form.sourceLang]: form.descripcion };

      const property = {
        slug: form.slug,
        titulo: tituloFinal,
        descripcion: descFinal,
        precio: parseFloat(form.precio),
        habitaciones: parseInt(form.habitaciones) || 0,
        banos: parseInt(form.banos) || 0,
        m2_construidos: parseInt(form.m2Construidos) || 0,
        m2_parcela: parseInt(form.m2Parcela) || 0,
        ubicacion: form.ubicacion,
        video_url: form.videoUrl,
        galeria_urls: form.galeriaUrls.split("\n").map(s=>s.trim()).filter(Boolean),
        infografias: [],
        destacada: form.destacada,
        activa: form.activa,
      };

      const res = await fetch("/api/admin/save-property", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ password, property }),
      });
      const data = await res.json();
      if (data.ok) setStatus("✅ Propiedad guardada correctamente");
      else setStatus(`❌ Error: ${data.error}`);
    } catch {
      setStatus("❌ Error al guardar");
    }
  };

  if (!auth) return (
    <div style={{
      position:"fixed", inset:0,
      background:"#080604",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div style={{ width:"320px", textAlign:"center" }}>
        <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", color:"rgba(201,169,110,0.7)", letterSpacing:"0.5em", textTransform:"uppercase", marginBottom:"2rem" }}>
          ADMIN ACCESS
        </p>
        <h2 style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"1.5rem", fontWeight:100, color:"white", marginBottom:"2rem" }}>
          Million Dollars Listing
        </h2>
        <input
          type="password" placeholder="Contraseña"
          value={password} onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleAuth()}
          style={{...INPUT, marginBottom:"1rem", textAlign:"center"}}
        />
        <button onClick={handleAuth} style={{
          background:"none", border:"1px solid rgba(201,169,110,0.4)",
          color:"#c9a96e", fontFamily:"'Helvetica Neue',sans-serif",
          fontSize:"0.5rem", letterSpacing:"0.5em", textTransform:"uppercase",
          padding:"1rem 2rem", cursor:"pointer", width:"100%",
        }}>Entrar</button>
        {status && <p style={{color:"#ff6b6b",marginTop:"1rem",fontSize:"0.8rem"}}>{status}</p>}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight:"100vh", background:"#080604",
      padding:"4rem 2rem", color:"white",
    }}>
      <div style={{ maxWidth:"800px", margin:"0 auto" }}>
        <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", color:"rgba(201,169,110,0.7)", letterSpacing:"0.5em", textTransform:"uppercase", marginBottom:"0.5rem" }}>
          PANEL DE ADMINISTRACIÓN
        </p>
        <h1 style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"2rem", fontWeight:100, marginBottom:"3rem" }}>
          Nueva Propiedad
        </h1>

        {/* Idioma fuente */}
        <label style={LABEL}>Idioma del texto</label>
        <select value={form.sourceLang} onChange={e=>setForm(p=>({...p,sourceLang:e.target.value}))}
          style={{...INPUT, cursor:"pointer"}}>
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="ru">Русский</option>
        </select>

        {/* Slug */}
        <label style={LABEL}>Slug (URL)</label>
        <input value={form.slug} onChange={e=>setForm(p=>({...p,slug:e.target.value}))}
          placeholder="villa-golden-mile" style={INPUT}/>

        {/* Título */}
        <label style={LABEL}>Título</label>
        <div style={{display:"flex",gap:"1rem",alignItems:"flex-end"}}>
          <input value={form.titulo} onChange={e=>setForm(p=>({...p,titulo:e.target.value}))}
            placeholder="Villa Golden Mile" style={{...INPUT,flex:1}}/>
          <button onClick={()=>handleTranslate("titulo")} disabled={translating}
            style={{background:"none",border:"1px solid rgba(201,169,110,0.3)",color:"#c9a96e",
            fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.4rem",letterSpacing:"0.3em",
            textTransform:"uppercase",padding:"0.5rem 1rem",cursor:"pointer",whiteSpace:"nowrap",marginBottom:"1.5rem"}}>
            ✦ Traducir
          </button>
        </div>
        {translated.titulo && (
          <div style={{background:"rgba(201,169,110,0.05)",border:"1px solid rgba(201,169,110,0.1)",padding:"1rem",marginBottom:"1.5rem",fontSize:"0.75rem",color:"rgba(255,255,255,0.5)"}}>
            {Object.entries(translated.titulo).map(([lang,txt])=>(
              <div key={lang}><strong style={{color:"rgba(201,169,110,0.7)"}}>{lang.toUpperCase()}:</strong> {txt}</div>
            ))}
          </div>
        )}

        {/* Descripción */}
        <label style={LABEL}>Descripción</label>
        <div style={{display:"flex",gap:"1rem",alignItems:"flex-start"}}>
          <textarea value={form.descripcion} onChange={e=>setForm(p=>({...p,descripcion:e.target.value}))}
            placeholder="Descripción de la propiedad..."
            rows={4} style={{...INPUT,flex:1,resize:"vertical"}}/>
          <button onClick={()=>handleTranslate("descripcion")} disabled={translating}
            style={{background:"none",border:"1px solid rgba(201,169,110,0.3)",color:"#c9a96e",
            fontFamily:"'Helvetica Neue',sans-serif",fontSize:"0.4rem",letterSpacing:"0.3em",
            textTransform:"uppercase",padding:"0.5rem 1rem",cursor:"pointer",whiteSpace:"nowrap",marginTop:"0.3rem"}}>
            ✦ Traducir
          </button>
        </div>
        {translated.descripcion && (
          <div style={{background:"rgba(201,169,110,0.05)",border:"1px solid rgba(201,169,110,0.1)",padding:"1rem",marginBottom:"1.5rem",fontSize:"0.75rem",color:"rgba(255,255,255,0.5)"}}>
            {Object.entries(translated.descripcion).map(([lang,txt])=>(
              <div key={lang} style={{marginBottom:"0.5rem"}}><strong style={{color:"rgba(201,169,110,0.7)"}}>{lang.toUpperCase()}:</strong> {txt}</div>
            ))}
          </div>
        )}

        {/* Grid de campos numéricos */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2rem"}}>
          <div>
            <label style={LABEL}>Precio (€)</label>
            <input type="number" value={form.precio} onChange={e=>setForm(p=>({...p,precio:e.target.value}))}
              placeholder="4500000" style={INPUT}/>
          </div>
          <div>
            <label style={LABEL}>Ubicación</label>
            <input value={form.ubicacion} onChange={e=>setForm(p=>({...p,ubicacion:e.target.value}))}
              placeholder="Golden Mile, Marbella" style={INPUT}/>
          </div>
          <div>
            <label style={LABEL}>Habitaciones</label>
            <input type="number" value={form.habitaciones} onChange={e=>setForm(p=>({...p,habitaciones:e.target.value}))}
              placeholder="6" style={INPUT}/>
          </div>
          <div>
            <label style={LABEL}>Baños</label>
            <input type="number" value={form.banos} onChange={e=>setForm(p=>({...p,banos:e.target.value}))}
              placeholder="4" style={INPUT}/>
          </div>
          <div>
            <label style={LABEL}>M² Construidos</label>
            <input type="number" value={form.m2Construidos} onChange={e=>setForm(p=>({...p,m2Construidos:e.target.value}))}
              placeholder="1200" style={INPUT}/>
          </div>
          <div>
            <label style={LABEL}>M² Parcela</label>
            <input type="number" value={form.m2Parcela} onChange={e=>setForm(p=>({...p,m2Parcela:e.target.value}))}
              placeholder="3500" style={INPUT}/>
          </div>
        </div>

        {/* Video URL */}
        <label style={LABEL}>URL del Video</label>
        <input value={form.videoUrl} onChange={e=>setForm(p=>({...p,videoUrl:e.target.value}))}
          placeholder="/videos/hero.mp4 o https://..." style={INPUT}/>

        {/* Galería */}
        <label style={LABEL}>URLs de Galería (una por línea)</label>
        <textarea value={form.galeriaUrls} onChange={e=>setForm(p=>({...p,galeriaUrls:e.target.value}))}
          placeholder="/gallery/foto1.jpg&#10;/gallery/foto2.jpg"
          rows={4} style={{...INPUT,resize:"vertical"}}/>

        {/* Opciones */}
        <div style={{display:"flex",gap:"2rem",marginBottom:"2rem"}}>
          <label style={{display:"flex",alignItems:"center",gap:"0.5rem",cursor:"pointer",fontSize:"0.75rem",color:"rgba(255,255,255,0.5)"}}>
            <input type="checkbox" checked={form.destacada} onChange={e=>setForm(p=>({...p,destacada:e.target.checked}))}/>
            Destacada
          </label>
          <label style={{display:"flex",alignItems:"center",gap:"0.5rem",cursor:"pointer",fontSize:"0.75rem",color:"rgba(255,255,255,0.5)"}}>
            <input type="checkbox" checked={form.activa} onChange={e=>setForm(p=>({...p,activa:e.target.checked}))}/>
            Activa
          </label>
        </div>

        {/* Status */}
        {status && (
          <div style={{
            padding:"1rem", marginBottom:"1.5rem",
            background: status.startsWith("✅") ? "rgba(0,200,100,0.1)" : "rgba(255,100,100,0.1)",
            border: `1px solid ${status.startsWith("✅") ? "rgba(0,200,100,0.3)" : "rgba(255,100,100,0.3)"}`,
            fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.8rem",
            color: status.startsWith("✅") ? "rgba(0,220,120,0.9)" : "rgba(255,120,120,0.9)",
          }}>
            {status}
          </div>
        )}

        {/* Guardar */}
        <button onClick={handleSave} style={{
          width:"100%", background:"none",
          border:"1px solid rgba(201,169,110,0.5)",
          color:"#c9a96e", fontFamily:"'Helvetica Neue',sans-serif",
          fontSize:"0.5rem", letterSpacing:"0.6em",
          textTransform:"uppercase", padding:"1.2rem",
          cursor:"pointer", transition:"all 0.3s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,169,110,0.1)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="none";}}
        >
          ✦ Guardar Propiedad
        </button>
      </div>
    </div>
  );
}
