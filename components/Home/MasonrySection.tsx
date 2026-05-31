"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { convertGDriveUrl } from "@/lib/gdrive";
import NeonButton from "@/components/ui/NeonButton";

interface Property {
  slug: string;
  titulo: Record<string, string> | string;
  precio: number;
  ubicacion: string;
  m2_construidos: number;
  habitaciones: number;
  banos: number;
  m2_parcela: number;
  descripcion: Record<string, string> | string;
  galeria_urls: string[];
  tipo?: string;
  zona?: string;
}

const FILTERS_DEF = [
  { id:"zona",        label:"Zona",        options:["marbella","estepona","mijas","benahavis","sotogrande"] },
  { id:"ubicacion",   label:"Ubicación",   options:["golden mile","nueva andalucia","puerto banus","sierra blanca","la zagaleta","los monteros","el madroñal"] },
  { id:"tipo",        label:"Tipo",        options:["villa","apartment","penthouse","townhouse","plot"] },
  { id:"habitaciones",label:"Hab.",        options:["2","3","4","5","6+"] },
  { id:"precio",      label:"Precio",      options:["500k-1m","1m-2m","2m-5m","5m+"] },
];

const PRICE_LABELS: Record<string,string> = { "500k-1m":"500K–1M", "1m-2m":"1M–2M", "2m-5m":"2M–5M", "5m+":"5M+" };
const HAB_LABELS: Record<string,string> = { "2":"2+","3":"3+","4":"4+","5":"5+","6+":"6+" };

// Paleta
const ACCENT   = "#2D4A3E";
const TEXT     = "#1A1714";
const TEXT2    = "#4A4540";
const MUTED    = "#8A847C";
const BG       = "#FAF8F4";
const BG_SOFT  = "#F2EDE4";
const BORDER   = "#DDD8D0";

const T: Record<string,Record<string,string>> = {
  es: { surface:"Superficie", bedrooms:"Hab.", bathrooms:"Baños", price:"Precio", viewProperty:"Ver propiedad", loading:"Cargando..." },
  en: { surface:"Built", bedrooms:"Bed.", bathrooms:"Bath", price:"Price", viewProperty:"View property", loading:"Loading..." },
  fr: { surface:"Surface", bedrooms:"Ch.", bathrooms:"SdB", price:"Prix", viewProperty:"Voir", loading:"Chargement..." },
  ru: { surface:"Пл.", bedrooms:"Сп.", bathrooms:"Ван.", price:"Цена", viewProperty:"Смотреть", loading:"Загрузка..." },
};

function getTitle(p: Property, locale: string) {
  return typeof p.titulo === "object" ? p.titulo[locale] || p.titulo["es"] || "" : p.titulo;
}
function getDesc(p: Property, locale: string) {
  const d = typeof p.descripcion === "object"
    ? (p.descripcion as any)[locale] || (p.descripcion as any)["es"] || ""
    : p.descripcion || "";
  return d.match(/^[^.!?]+[.!?]/)?.[0] || "";
}
function matchPrice(precio: number, filter: string) {
  if (filter === "500k-1m") return precio >= 500000 && precio < 1000000;
  if (filter === "1m-2m")   return precio >= 1000000 && precio < 2000000;
  if (filter === "2m-5m")   return precio >= 2000000 && precio < 5000000;
  if (filter === "5m+")     return precio >= 5000000;
  return true;
}

interface PreviewProps { property: Property; locale: string; onClose: () => void; }

function PropertyPreview({ property: p, locale, onClose }: PreviewProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const t = T[locale] || T.es;
  const title = getTitle(p, locale);
  const desc = getDesc(p, locale);
  const imgs = (p.galeria_urls || []).map(url => convertGDriveUrl(url));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      background:"rgba(26,23,20,0.7)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"clamp(1rem,3vw,2rem)",
      backdropFilter:"blur(8px)",
    }} onClick={onClose}>
      <div className="modal-inner" style={{
        width:"100%", maxWidth:"1100px", maxHeight:"90vh",
        background:BG,
        border:`1px solid ${BORDER}`,
        display:"grid",
        gridTemplateColumns:"clamp(0px,50vw,560px) 1fr",
        gridTemplateRows:"auto",
        overflow:"hidden", position:"relative",
        boxShadow:"0 32px 80px rgba(26,23,20,0.2)",
      }} onClick={e => e.stopPropagation()}>
      <style>{`
        @media (max-width: 640px) {
          .modal-inner { grid-template-columns: 1fr !important; grid-template-rows: 260px 1fr !important; max-height: 92vh !important; }
          .modal-img   { height: 260px !important; min-height: unset !important; }
          .modal-info  { overflow-y: auto !important; }
        }
      `}</style>

        {/* Close */}
        <button onClick={onClose} style={{
          position:"absolute", top:"1rem", right:"1rem", zIndex:10,
          background:"none", border:"none", cursor:"pointer",
          color:MUTED, fontSize:"1rem", lineHeight:1,
          fontFamily:"'Montserrat',sans-serif", letterSpacing:"0.1em",
        }}>✕</button>

        {/* Imagen */}
        <div className="modal-img" style={{ position:"relative", overflow:"hidden", minHeight:"420px" }}>
          {imgs[imgIdx] && (
            <img src={imgs[imgIdx]} alt={title}
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
          )}
          {imgs.length > 1 && (
            <div style={{ position:"absolute", bottom:"1rem", left:0, right:0, display:"flex", justifyContent:"center", gap:"0.4rem" }}>
              {imgs.map((_,i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{
                  width: i===imgIdx ? "1.5rem" : "0.4rem",
                  height:"0.4rem", borderRadius:"2px",
                  background: i===imgIdx ? ACCENT : "rgba(250,248,244,0.5)",
                  border:"none", cursor:"pointer", transition:"all 0.3s",
                }}/>
              ))}
            </div>
          )}
          {/* Nav arrows */}
          {imgs.length > 1 && (<>
            <button onClick={()=>setImgIdx(i=>Math.max(0,i-1))} style={{ position:"absolute",left:"0.75rem",top:"50%",transform:"translateY(-50%)",background:"rgba(250,248,244,0.9)",border:"none",width:"2rem",height:"2rem",borderRadius:"50%",cursor:"pointer",fontSize:"0.8rem",color:TEXT }}>←</button>
            <button onClick={()=>setImgIdx(i=>Math.min(imgs.length-1,i+1))} style={{ position:"absolute",right:"0.75rem",top:"50%",transform:"translateY(-50%)",background:"rgba(250,248,244,0.9)",border:"none",width:"2rem",height:"2rem",borderRadius:"50%",cursor:"pointer",fontSize:"0.8rem",color:TEXT }}>→</button>
          </>)}
        </div>

        {/* Info */}
        <div className="modal-info" style={{
          padding:"clamp(1.5rem,3vw,2.5rem)",
          display:"flex", flexDirection:"column", gap:"1rem",
          overflowY:"auto", background:BG,
        }}>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.55rem", letterSpacing:"0.35em", textTransform:"uppercase", color:ACCENT, margin:0 }}>
            {p.ubicacion}
          </p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:600, color:TEXT, margin:0, lineHeight:1.1 }}>
            {title}
          </h2>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.95rem,1.4vw,1.1rem)", color:TEXT2, lineHeight:1.7, margin:0 }}>
            {desc}
          </p>
          <hr style={{ border:"none", borderTop:`1px solid ${BORDER}`, margin:"0.25rem 0" }}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.8rem" }}>
            {[
              { l:t.surface, v:`${p.m2_construidos} m²` },
              { l:t.bedrooms, v:p.habitaciones },
              { l:t.bathrooms, v:p.banos },
              { l:t.price, v:`€${p.precio?.toLocaleString()}` },
            ].map(s => (
              <div key={s.l}>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.45rem", letterSpacing:"0.3em", textTransform:"uppercase", color:MUTED, margin:"0 0 0.2rem" }}>{s.l}</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.15rem", color:TEXT, margin:0, fontWeight:500 }}>{s.v}</p>
              </div>
            ))}
          </div>
          <hr style={{ border:"none", borderTop:`1px solid ${BORDER}`, margin:"0.25rem 0" }}/>
          <NeonButton onClick={() => { window.location.href = `/${locale}/propiedades/${p.slug}`; }} variant="solid">
            {t.viewProperty} →
          </NeonButton>
        </div>
      </div>
    </div>
  );
}

export default function MasonrySection({ locale = "es" }: { locale?: string }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<Record<string,string>>({});
  const [preview, setPreview] = useState<Property | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const t = T[locale] || T.es;

  useEffect(() => {
    fetch("/api/properties")
      .then(r => r.json())
      .then(d => setProperties(d.properties || []))
      .catch(() => {});
  }, []);

  const filtered = properties.filter(p => {
    if (filters.zona) {
      const zona = (p.zona || "").toLowerCase().trim();
      if (zona !== filters.zona.toLowerCase().trim()) return false;
    }
    if (filters.ubicacion) {
      const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!normalize(p.ubicacion || "").includes(normalize(filters.ubicacion))) return false;
    }
    if (filters.tipo) {
      if ((p.tipo || "").toLowerCase().trim() !== filters.tipo.toLowerCase().trim()) return false;
    }
    if (filters.habitaciones) {
      const hab = Number(p.habitaciones) || 0;
      if (filters.habitaciones === "6+") { if (hab < 6) return false; }
      else { if (hab < parseInt(filters.habitaciones)) return false; }
    }
    if (filters.precio && !matchPrice(Number(p.precio), filters.precio)) return false;
    return true;
  });

  const toggleFilter = (id: string, val: string) => {
    setFilters(prev => ({ ...prev, [id]: prev[id] === val ? "" : val }));
    setActiveFilter(null);
  };

  const getFilterLabel = (f: typeof FILTERS_DEF[0]) => {
    const v = filters[f.id];
    if (!v) return f.label;
    if (f.id === "precio") return PRICE_LABELS[v] || v;
    if (f.id === "habitaciones") return `${HAB_LABELS[v] || v} Hab`;
    return v.charAt(0).toUpperCase() + v.slice(1);
  };

  return (
    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", overflow:"hidden", background:BG }}>

      {/* Header + Filtros */}
      <div style={{
        flexShrink:0,
        padding:"clamp(3.5rem,6vw,4.5rem) clamp(1.5rem,4vw,3rem) 0",
        borderBottom:`1px solid ${BORDER}`,
        background:BG,
      }}>
        {/* THE EDITS */}
        <p style={{
          fontFamily:"'Montserrat',sans-serif",
          fontSize:"0.85rem",
          letterSpacing:"0.5em",
          textTransform:"uppercase",
          color:ACCENT,
          margin:"0 0 1rem",
          textShadow:`0 0 20px rgba(45,74,62,0.2)`,
        }}>
          THE EDITS · {filtered.length}
        </p>

        {/* Filtros */}
        <div style={{ display:"flex", alignItems:"center", gap:"0", flexWrap:"wrap", marginBottom:"0", paddingBottom:"0" }}>
          {FILTERS_DEF.map((f, idx) => {
            const active = !!filters[f.id];
            return (
              <div key={f.id} style={{ position:"relative" }}>
                <button
                  onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
                  style={{
                    background:"none",
                    border:"none",
                    borderBottom: active
                      ? `1.5px solid ${ACCENT}`
                      : activeFilter === f.id
                      ? `0.5px solid ${TEXT2}`
                      : `0.5px solid transparent`,
                    padding:"0.6rem 1.2rem 0.5rem",
                    cursor:"pointer",
                    fontFamily:"'Montserrat',sans-serif",
                    fontSize:"0.55rem",
                    letterSpacing:"0.25em",
                    textTransform:"uppercase",
                    color: active ? ACCENT : activeFilter === f.id ? TEXT : TEXT2,
                    opacity: active || activeFilter === f.id ? 1 : 0.65,
                    transition:"all 0.2s ease",
                    marginBottom:"-1px",
                  }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.color=ACCENT;}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity=active||activeFilter===f.id?"1":"0.65"; (e.currentTarget as HTMLElement).style.color=active?ACCENT:activeFilter===f.id?TEXT:TEXT2;}}
                >
                  {getFilterLabel(f)} {active ? "×" : "∨"}
                </button>

                {/* Dropdown */}
                {activeFilter === f.id && (
                  <div style={{
                    position:"absolute", top:"calc(100% + 1px)", left:0, zIndex:50,
                    background:BG,
                    border:`1px solid ${BORDER}`,
                    minWidth:"160px",
                    boxShadow:"0 8px 24px rgba(26,23,20,0.08)",
                  }}>
                    {f.options.map((opt, i) => (
                      <button key={opt} onClick={() => toggleFilter(f.id, opt)} style={{
                        display:"block", width:"100%", textAlign:"left",
                        background: filters[f.id] === opt ? BG_SOFT : "none",
                        border:"none",
                        borderBottom: i < f.options.length-1 ? `1px solid ${BORDER}` : "none",
                        padding:"0.7rem 1.2rem",
                        cursor:"pointer",
                        fontFamily:"'Montserrat',sans-serif",
                        fontSize:"0.55rem",
                        letterSpacing:"0.2em",
                        textTransform:"uppercase",
                        color: filters[f.id] === opt ? ACCENT : TEXT2,
                        transition:"all 0.15s",
                      }}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=BG_SOFT; (e.currentTarget as HTMLElement).style.color=ACCENT;}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background=filters[f.id]===opt?BG_SOFT:"none"; (e.currentTarget as HTMLElement).style.color=filters[f.id]===opt?ACCENT:TEXT2;}}
                      >
                        {f.id === "precio" ? PRICE_LABELS[opt] : f.id === "habitaciones" ? `${opt} hab.` : opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {Object.values(filters).some(Boolean) && (
            <button onClick={() => setFilters({})} style={{
              background:"none", border:"none", cursor:"pointer",
              fontFamily:"'Montserrat',sans-serif", fontSize:"0.5rem",
              letterSpacing:"0.25em", textTransform:"uppercase",
              color:MUTED, padding:"0.6rem 1rem",
              opacity:0.7, transition:"opacity 0.2s",
            }}
            onMouseEnter={e=>(e.currentTarget.style.opacity="1")}
            onMouseLeave={e=>(e.currentTarget.style.opacity="0.7")}
            >
              Limpiar ×
            </button>
          )}
        </div>
      </div>

      {/* Grid Masonry */}
      <div style={{
        flex:1, overflowY:"auto", WebkitOverflowScrolling:"touch",
        padding:"0.5rem 0.5rem 4rem",
        display:"grid",
        gridTemplateColumns:"repeat(3, 1fr)",
        gap:"clamp(0.3rem,0.8vw,0.6rem)",
        alignContent:"start",
        position:"relative",
      }}>
        {filtered.map((p) => {
          const img = p.galeria_urls?.[0] ? convertGDriveUrl(p.galeria_urls[0]) : "";
          const title = getTitle(p, locale);
          const isHovered = hoveredCard === p.slug;

          return (
            <div
              key={p.slug}
              onClick={() => setPreview(p)}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                if (el.dataset.expanded === "1") return;
                el.dataset.expanded = "1";
                el.style.zIndex = "9999";
                gsap.to(el, {
                  scale: 1.18,
                  boxShadow: "0 24px 64px rgba(26,23,20,0.22)",
                  duration: 0.4,
                  ease: "power2.out",
                });
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.dataset.expanded = "0";
                gsap.to(el, {
                  scale: 1,
                  boxShadow: "0 1px 4px rgba(26,23,20,0.06)",
                  duration: 0.4,
                  ease: "power2.inOut",
                  onComplete: () => { el.style.zIndex = ""; }
                });
              }}
              style={{
                cursor:"pointer",
                background:"#FFFFFF",
                border:`1px solid ${BORDER}`,
                transition:"border-color 0.3s, box-shadow 0.3s",
                boxShadow:`0 1px 4px rgba(26,23,20,0.06)`,
                overflow:"visible",
                
              }}
            >
              {/* Imagen */}
              <div style={{ position:"relative", overflow:"hidden", height:"clamp(90px,20vw,180px)" }}>
                {img ? (
                  <img src={img} alt={title} style={{
                    width:"100%", height:"100%", objectFit:"cover", display:"block",
                    transform:"scale(1)",
                    
                  }}/>
                ) : (
                  <div style={{ width:"100%", height:"clamp(90px,20vw,180px)", background:BG_SOFT }}/>
                )}
                {p.tipo && (
                  <div style={{
                    position:"absolute", top:"0.6rem", left:"0.6rem",
                    background:"rgba(250,248,244,0.95)",
                    padding:"0.2rem 0.5rem",
                    fontFamily:"'Montserrat',sans-serif",
                    fontSize:"0.38rem", letterSpacing:"0.2em",
                    textTransform:"uppercase", color:ACCENT,
                    fontWeight:600,
                  }}>
                    {p.tipo}
                  </div>
                )}
              </div>

              {/* Info — fuera de la imagen, fondo blanco */}
              <div style={{ padding:"0.5rem 0.6rem 0.7rem", background:"#FFFFFF" }}>
                {/* Título */}
                <h3 style={{
                  fontFamily:"'Montserrat',sans-serif",
                  fontSize:"0.65rem", fontWeight:600,
                  letterSpacing:"0.08em", textTransform:"uppercase",
                  color:TEXT, margin:"0 0 0.3rem", lineHeight:1.3,
                }}>
                  {title}
                </h3>
                {/* Ubicación */}
                <p style={{
                  fontFamily:"'Montserrat',sans-serif",
                  fontSize:"0.55rem", letterSpacing:"0.05em",
                  color:TEXT2, margin:"0 0 0.6rem", fontWeight:300,
                }}>
                  {p.ubicacion}
                </p>
                {/* Precio */}
                <p style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontSize:"1.3rem", fontWeight:700,
                  color:TEXT, margin:"0 0 0.4rem", lineHeight:1,
                }}>
                  €{p.precio?.toLocaleString()}
                </p>
                {/* Stats */}
                {(p.m2_construidos > 0 || p.habitaciones > 0) && (
                  <div style={{ display:"flex", gap:"0.8rem", borderTop:`1px solid ${BORDER}`, paddingTop:"0.4rem", marginTop:"0.4rem" }}>
                    {p.m2_construidos > 0 && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.42rem", letterSpacing:"0.1em", color:MUTED }}>{p.m2_construidos} m²</span>}
                    {p.habitaciones > 0 && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.42rem", letterSpacing:"0.1em", color:MUTED }}>{p.habitaciones} {t.bedrooms}</span>}
                    {p.banos > 0 && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.42rem", letterSpacing:"0.1em", color:MUTED }}>{p.banos} {t.bathrooms}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"4rem", color:MUTED, fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", letterSpacing:"0.3em", textTransform:"uppercase" }}>
            Sin propiedades con estos filtros
          </div>
        )}
      </div>

      {preview && <PropertyPreview property={preview} locale={locale} onClose={() => setPreview(null)} />}
    </div>
  );
}
