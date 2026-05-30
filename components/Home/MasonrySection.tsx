"use client";
import NeonButton from "@/components/ui/NeonButton";
import { useState, useEffect, useRef } from "react";
import { convertGDriveUrl } from "@/lib/gdrive";

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
  { id:"zona",        label:"ZONA",        options:["marbella","estepona","mijas","benahavis","sotogrande"] },
  { id:"ubicacion",   label:"UBICACIÓN",   options:["golden mile","nueva andalucia","puerto banus","sierra blanca","la zagaleta","los monteros","el madroñal"] },
  { id:"tipo",        label:"TIPO",        options:["villa","apartment","penthouse","townhouse","plot"] },
  { id:"habitaciones",label:"HAB.",        options:["2","3","4","5","6+"] },
  { id:"precio",      label:"PRECIO",      options:["500k-1m","1m-2m","2m-5m","5m+"] },
];

const PRICE_LABELS: Record<string,string> = { "500k-1m":"500K–1M", "1m-2m":"1M–2M", "2m-5m":"2M–5M", "5m+":"5M+" };
const HAB_LABELS: Record<string,string> = { "2":"2+", "3":"3+", "4":"4+", "5":"5+", "6+":"6+" };

const GOLD = "#2D4A3E";
const GOLD_DIM = "rgba(45,74,62,0.6)";
const WHITE = "#111111";
const WHITE_DIM = "#4A4A4A";
const BG = "#FAFAF7";

const T: Record<string, Record<string,string>> = {
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

interface PreviewProps {
  property: Property;
  locale: string;
  onClose: () => void;
}

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
      background:"rgba(0,0,0,0.85)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"clamp(1rem,3vw,2rem)",
    }} onClick={onClose}>
      <div style={{
        width:"100%", maxWidth:"1100px", maxHeight:"90vh",
        background:BG,
        border:"1px solid rgba(201,169,110,0.15)",
        display:"grid", gridTemplateColumns:"1fr 1fr",
        overflow:"hidden",
        position:"relative",
      }} onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{
          position:"absolute", top:"1rem", right:"1rem", zIndex:10,
          background:"none", border:"none", cursor:"pointer",
          color:WHITE_DIM, fontSize:"1.2rem", lineHeight:1,
        }}>✕</button>

        {/* Imagen izquierda */}
        <div style={{ position:"relative", overflow:"hidden", minHeight:"400px" }}>
          {imgs[imgIdx] && (
            <img
              src={imgs[imgIdx]}
              alt={title}
              style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
            />
          )}
          {/* Dots */}
          {imgs.length > 1 && (
            <div style={{ position:"absolute", bottom:"1rem", left:0, right:0, display:"flex", justifyContent:"center", gap:"0.4rem" }}>
              {imgs.map((_,i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{
                  width: i === imgIdx ? "1.5rem" : "0.4rem",
                  height:"0.4rem", borderRadius:"2px",
                  background: i === imgIdx ? GOLD : "rgba(255,255,255,0.3)",
                  border:"none", cursor:"pointer", transition:"all 0.3s",
                }}/>
              ))}
            </div>
          )}
        </div>

        {/* Info derecha */}
        <div style={{
          padding:"clamp(1.5rem,3vw,2.5rem)",
          display:"flex", flexDirection:"column", gap:"1rem",
          overflowY:"auto",
        }}>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.5rem", letterSpacing:"0.4em", textTransform:"uppercase", color:GOLD_DIM, margin:0 }}>
            {p.ubicacion}
          </p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:600, color:WHITE, margin:0, lineHeight:1.1 }}>
            {title}
          </h2>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.95rem,1.4vw,1.1rem)", color:WHITE_DIM, lineHeight:1.7, margin:0 }}>
            {desc}
          </p>
          <hr style={{ border:"none", borderTop:"1px solid rgba(201,169,110,0.15)", margin:"0.5rem 0" }}/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.8rem" }}>
            {[
              { l:t.surface, v:`${p.m2_construidos} m²` },
              { l:t.bedrooms, v:p.habitaciones },
              { l:t.bathrooms, v:p.banos },
              { l:t.price, v:`€${p.precio?.toLocaleString()}` },
            ].map(s => (
              <div key={s.l}>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.45rem", letterSpacing:"0.3em", textTransform:"uppercase", color:GOLD_DIM, margin:"0 0 0.2rem" }}>{s.l}</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:WHITE, margin:0 }}>{s.v}</p>
              </div>
            ))}
          </div>
          <hr style={{ border:"none", borderTop:"1px solid rgba(201,169,110,0.15)", margin:"0.5rem 0" }}/>
          <NeonButton onClick={() => { window.location.href = `/${locale}/propiedades/${p.slug}`; }}>
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
  const t = T[locale] || T.es;

  useEffect(() => {
    fetch("/api/properties")
      .then(r => r.json())
      .then(d => setProperties(d.properties || []))
      .catch(() => {});
  }, []);

  const filtered = properties.filter(p => {
    // Zona — coincidencia exacta con campo zona
    if (filters.zona) {
      const zona = (p.zona || "").toLowerCase().trim();
      if (zona !== filters.zona.toLowerCase().trim()) return false;
    }
    // Ubicacion — búsqueda flexible sin tildes
    if (filters.ubicacion) {
      const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const ub = normalize(p.ubicacion || "");
      const f = normalize(filters.ubicacion);
      if (!ub.includes(f)) return false;
    }
    // Tipo — coincidencia exacta
    if (filters.tipo) {
      const tipo = (p.tipo || "").toLowerCase().trim();
      if (tipo !== filters.tipo.toLowerCase().trim()) return false;
    }
    // Habitaciones — mínimo
    if (filters.habitaciones) {
      const hab = Number(p.habitaciones) || 0;
      if (filters.habitaciones === "6+") { if (hab < 6) return false; }
      else { if (hab < parseInt(filters.habitaciones)) return false; }
    }
    // Precio
    if (filters.precio && !matchPrice(Number(p.precio), filters.precio)) return false;
    return true;
  });

  const toggleFilter = (id: string, val: string) => {
    setFilters(prev => ({ ...prev, [id]: prev[id] === val ? "" : val }));
    setActiveFilter(null);
  };

  return (
    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", overflow:"hidden", background:"transparent",
      backdropFilter:"none",
      WebkitBackdropFilter:"none",
    }}>

      {/* Barra filtros */}
      <div style={{
        flexShrink:0,
        padding:"clamp(3.5rem,6vw,4.5rem) clamp(1rem,3vw,2rem) 0.8rem",
        display:"flex", flexDirection:"column", gap:"0.6rem",
        borderBottom:"1px solid rgba(201,169,110,0.1)",
      }}>
        <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.85rem", letterSpacing:"0.4em", textTransform:"uppercase", color:GOLD, margin:0, whiteSpace:"nowrap", textShadow:"0 0 10px rgba(201,169,110,0.9), 0 0 25px rgba(201,169,110,0.5)" }}>
          THE EDITS · {filtered.length}
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:"0.8rem", flexWrap:"wrap" }}>

        {FILTERS_DEF.map(f => (
          <div key={f.id} style={{ position:"relative" }}>
            <button
              onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
              style={{
                background:"none", border:"1px solid #E2DDD6",
                padding:"0.7rem 1.4rem", cursor:"pointer",
                fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem",
                letterSpacing:"0.2em", textTransform:"uppercase",
                color: filters[f.id] ? GOLD : WHITE_DIM,
                transition:"all 0.2s",
              }}
            >
              {filters[f.id]
                ? f.id === "precio" ? PRICE_LABELS[filters[f.id]]
                : f.id === "habitaciones" ? `${HAB_LABELS[filters[f.id]] || filters[f.id]} HAB`
                : filters[f.id].toUpperCase()
                : f.label} ▾
            </button>
            {activeFilter === f.id && (
              <div style={{
                position:"absolute", top:"calc(100% + 0.5rem)", left:0, zIndex:50,
                background:"#FAFAF7", border:"1px solid #E2DDD6",
                minWidth:"140px",
              }}>
                {f.options.map(opt => (
                  <button key={opt} onClick={() => toggleFilter(f.id, opt)} style={{
                    display:"block", width:"100%", textAlign:"left",
                    background: filters[f.id] === opt ? "rgba(201,169,110,0.1)" : "none",
                    border:"none", borderBottom:"1px solid rgba(201,169,110,0.08)",
                    padding:"0.8rem 1.2rem", cursor:"pointer",
                    fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem",
                    letterSpacing:"0.15em", textTransform:"uppercase",
                    color: filters[f.id] === opt ? GOLD : WHITE_DIM,
                  }}>
                    {f.id === "precio" ? PRICE_LABELS[opt] : f.id === "habitaciones" ? `${opt} hab.` : opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

          {Object.values(filters).some(Boolean) && (
            <button onClick={() => setFilters({})} style={{
              background:"none", border:"none", cursor:"pointer",
              fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem",
              letterSpacing:"0.3em", textTransform:"uppercase", color:WHITE_DIM,
            }}>
              LIMPIAR ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid masonry */}
      <div style={{
        flex:1, overflowY:"auto", padding:"clamp(0.8rem,2vw,1.5rem) clamp(0.8rem,3vw,2rem)",
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
        gap:"clamp(0.8rem,1.5vw,1.2rem)",
        alignContent:"start",
      }}>
        {filtered.map((p, idx) => {
          const img = p.galeria_urls?.[0] ? convertGDriveUrl(p.galeria_urls[0]) : "";
          const title = getTitle(p, locale);
          const h = typeof window !== 'undefined' && window.innerWidth < 600 ? '220px' : '260px';

          return (
            <div
              key={p.slug}
              onClick={() => setPreview(p)}
              style={{
                cursor:"pointer", position:"relative", overflow:"hidden",
                height:h,
                background:"#FAFAF7",
                border:"1px solid #E2DDD6",
                transition:"border-color 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.08)")}
            >
              {img && (
                <img src={img} alt={title} style={{
                  width:"100%", height:"100%", objectFit:"cover", display:"block",
                  transition:"transform 0.5s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
              )}
              <div style={{
                position:"absolute", inset:0,
                background:"linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                display:"flex", flexDirection:"column", justifyContent:"flex-end",
                padding:"1rem",
              }}>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", letterSpacing:"0.3em", textTransform:"uppercase", color:GOLD_DIM, margin:"0 0 0.2rem" }}>
                  {p.ubicacion}
                </p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1rem,1.8vw,1.3rem)", fontWeight:600, color:WHITE, margin:0, lineHeight:1.2 }}>
                  {title}
                </p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.9rem", color:GOLD, margin:"0.2rem 0 0" }}>
                  €{p.precio?.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview modal */}
      {preview && <PropertyPreview property={preview} locale={locale} onClose={() => setPreview(null)} />}
    </div>
  );
}
