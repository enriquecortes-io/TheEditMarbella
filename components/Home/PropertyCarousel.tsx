"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CarouselScrollIndicator from "./CarouselScrollIndicator";
import ScrollIndicator from "../Experience/ScrollIndicator";
import CarouselDiscoverIndicator from "./CarouselDiscoverIndicator";

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
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: { latestListings:"Últimos Listados", surface:"Superficie", bedrooms:"Habitaciones", bathrooms:"Baños", garden:"Jardín / Terraza", price:"Precio", viewProperty:"Ver propiedad", loading:"Cargando selección..." },
  en: { latestListings:"Latest Listings", surface:"Built Area", bedrooms:"Bedrooms", bathrooms:"Bathrooms", garden:"Garden / Terrace", price:"Price", viewProperty:"View property", loading:"Loading selection..." },
  fr: { latestListings:"Dernières Annonces", surface:"Surface", bedrooms:"Chambres", bathrooms:"Salles de bain", garden:"Jardin / Terrasse", price:"Prix", viewProperty:"Voir la propriété", loading:"Chargement..." },
  ru: { latestListings:"Последние объекты", surface:"Площадь", bedrooms:"Спальни", bathrooms:"Ванные", garden:"Сад / Терраса", price:"Цена", viewProperty:"Смотреть объект", loading:"Загрузка..." },
};

export default function PropertyCarousel({ locale = "es" }: { locale?: string }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);
  const [slideDir, setSlideDir] = useState<"left"|"right"|null>(null);
  const [prevActive, setPrevActive] = useState(0);
  const [displayActive, setDisplayActive] = useState(0);
  const imgRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[locale] || TRANSLATIONS["es"];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch("/api/properties")
      .then(r => r.json())
      .then(data => {
        const props = (data.properties || []).slice(0, 5);
        setProperties(props);
        setActive(isMobile ? 0 : 2);
      })
      .catch(() => {});
  }, []);

  const getTitle = (p: Property) =>
    typeof p.titulo === "object" ? p.titulo[locale] || p.titulo["es"] || "" : p.titulo;

  const getDesc = (p: Property) => {
    const desc = typeof p.descripcion === "object"
      ? (p.descripcion as any)[locale] || (p.descripcion as any)["es"] || (p.descripcion as any)["en"] || ""
      : p.descripcion || "";
    return desc.match(/^[^.!?]+[.!?]/)?.[0] || "";
  };

  if (properties.length === 0) {
    return (
      <div style={{ color:"rgba(201,169,110,0.6)", fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", letterSpacing:"0.5em", textTransform:"uppercase", textAlign:"center" }}>
        {t.loading}
      </div>
    );
  }

  const p = properties[displayActive !== undefined ? displayActive : active];

  const stats = [
    { label: t.surface,   value: p.m2_construidos ? `${p.m2_construidos} m²` : null },
    { label: t.bedrooms,  value: p.habitaciones || null },
    { label: t.bathrooms, value: p.banos || null },
    { label: t.garden,    value: p.m2_parcela ? `${p.m2_parcela} m²` : null },
  ].filter(d => d.value);

  // ── MOBILE LAYOUT ─────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        width:"100%",
        height:"calc(100dvh - 4rem)",   // descuenta el navbar
        maxHeight:"calc(100dvh - 4rem)",
        marginTop:"4rem",
        display:"flex", flexDirection:"column",
        overflow:"hidden",
        background:"rgba(6,4,2,0.85)",
        border:"1px solid rgba(201,169,110,0.18)",
        boxShadow:"0 0 0 1px rgba(255,255,255,0.04),0 20px 60px rgba(0,0,0,0.5)",
        backdropFilter:"blur(12px)",
        position:"relative",
        paddingTop:"env(safe-area-inset-top)",   // respeta notch iOS
        boxSizing:"border-box",
      }}
      onTouchStart={e => { isDragging.current = true; dragStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const diff = dragStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          const dir = diff > 0 ? "left" : "right";
          const next = Math.max(0, Math.min(properties.length-1, active + (diff > 0 ? 1 : -1)));
          if (next !== active) {
            setPrevActive(active);
            setSlideDir(dir);
            setActive(next);
            setTimeout(() => {
              setDisplayActive(next);
              setSlideDir(null);
            }, 380);
          }
        }
      }}
      >
        <style>{`
          @keyframes slideInLeft  { from { opacity:0; transform:translateX(60px);  } to { opacity:1; transform:translateX(0); } }
          @keyframes slideInRight { from { opacity:0; transform:translateX(-60px); } to { opacity:1; transform:translateX(0); } }
          .slide-left  { animation: slideInLeft  0.35s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
          .slide-right { animation: slideInRight 0.35s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
        `}</style>
        {/* Línea dorada */}
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(201,169,110,0.8),transparent)", zIndex:2 }}/>

        {/* Imagen con swipe — altura fija 38% del viewport */}
        <div
          style={{ position:"relative", width:"100%", height:"38dvh", flexShrink:0, overflow:"hidden" }}
        >
          {/* Imagen saliente — se queda estática */}
          {properties[prevActive]?.galeria_urls?.[0] && slideDir && (
            <img
              src={convertGDriveThumb(properties[prevActive].galeria_urls[0])}
              alt=""
              style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:1 }}
            />
          )}
          {/* Imagen entrante — anima encima */}
          <img
            key={active}
            src={properties[active]?.galeria_urls?.[0] || ""}
            alt={getTitle(p)}
            style={{
              position:"absolute", inset:0,
              width:"100%", height:"100%", objectFit:"cover",
              zIndex:2,
              animation: slideDir
                ? `${slideDir === "left" ? "slideInLeft" : "slideInRight"} 0.38s cubic-bezier(0.25,0.46,0.45,0.94) forwards`
                : "none",
            }}
          />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(6,4,2,0.95) 100%)" }}/>

          {/* Infografía esquina superior izquierda */}
          <div style={{ position:"absolute", top:"0.8rem", left:"0.8rem", padding:"0.5rem 0.8rem", background:"rgba(6,4,2,0.75)", border:"1px solid rgba(201,169,110,0.35)", backdropFilter:"blur(4px)" }}>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem", color:"rgba(255,255,255,1)", letterSpacing:"0.45em", textTransform:"uppercase", margin:"0 0 0.3rem" }}>{t.latestListings}</p>
            <div style={{ width:"1.2rem", height:"1px", background:"rgba(201,169,110,0.6)" }}/>
          </div>

          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0.8rem 1rem" }}>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.45rem", color:"rgba(201,169,110,0.8)", letterSpacing:"0.35em", textTransform:"uppercase", margin:0 }}>{p.ubicacion}</p>
          </div>
        </div>

        {/* Indicador horizontal elástico */}
        <div style={{ flexShrink:0, paddingTop:"0.5rem" }}>
          <CarouselScrollIndicator total={properties.length} active={active} />
        </div>

        {/* Info — ocupa el resto, scroll interno si necesario */}
        <div style={{ flex:1, overflowY:"auto", padding:"0.8rem 1.2rem 1.2rem", display:"flex", flexDirection:"column", gap:"0.5rem", boxSizing:"border-box" }}>
          <div style={{ width:"1.5rem", height:"1px", background:"rgba(201,169,110,0.5)", flexShrink:0 }}/>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.3rem,5vw,1.8rem)", fontWeight:600, color:"white", lineHeight:1.1, margin:0, flexShrink:0 }}>{getTitle(p)}</h2>

          {/* Stats 2×2 grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.4rem 1rem", flexShrink:0 }}>
            {stats.map(d => (
              <div key={d.label} style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:"0.4rem" }}>
                <span style={{ display:"block", fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem", color:"rgba(255,255,255,0.5)", letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"0.15rem" }}>{d.label}</span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"white", fontWeight:300 }}>{String(d.value)}</span>
              </div>
            ))}
          </div>

          {getDesc(p) && (
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.85rem", fontStyle:"italic", color:"rgba(255,255,255,0.7)", lineHeight:1.6, margin:0 }}>
              {getDesc(p)}
            </p>
          )}

          {p.precio && (
            <div style={{ borderTop:"1px solid rgba(201,169,110,0.2)", paddingTop:"0.8rem", marginTop:"auto", flexShrink:0 }}>
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem", color:"rgba(201,169,110,0.5)", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.25rem" }}>{t.price}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", color:"#c9a96e", margin:"0 0 0.7rem", fontWeight:300 }}>€{(p.precio/1000000).toFixed(1)}M</p>
              <Link href={`/${locale}/propiedades/${p.slug}`} style={{ display:"block", textAlign:"center", fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", letterSpacing:"0.4em", textTransform:"uppercase", color:"rgba(201,169,110,0.7)", textDecoration:"none", padding:"0.7rem", border:"1px solid rgba(201,169,110,0.3)" }}>
                {t.viewProperty}
              </Link>
            </div>
          )}
        </div>

        {/* Indicador scroll vertical — señala que hay más secciones abajo */}
        <div style={{ position:"absolute", bottom:"5rem", right:"0", zIndex:10 }}>
          <CarouselDiscoverIndicator />
        </div>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ────────────────────────────────────────────────────────
  const CARD_W = 308;
  const CARD_H = 418;

  return (
    <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 clamp(1rem,3vw,3rem)" }}>
      <div style={{
        width:"100%", maxWidth:"1400px",
        height:"clamp(560px,82vh,860px)",
        display:"grid", gridTemplateColumns:"1fr 1fr",
        background:"rgba(6,4,2,0.65)",
        border:"1px solid rgba(201,169,110,0.18)",
        boxShadow:"0 0 0 1px rgba(255,255,255,0.04),0 20px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)",
        backdropFilter:"blur(30px)",
        overflow:"hidden", position:"relative",
      }}>
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(201,169,110,0.8),transparent)", zIndex:2 }}/>

        {/* Columna izquierda — Carrusel 3D */}
        <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", padding:"3.5rem 1rem 1.5rem", borderRight:"1px solid rgba(201,169,110,0.12)", height:"100%", boxSizing:"border-box" }}>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", color:"rgba(201,169,110,0.9)", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.8rem", alignSelf:"flex-start", paddingLeft:"1rem" }}>{t.latestListings}</p>
          <div style={{ width:"1.5rem", height:"1px", background:"rgba(201,169,110,0.4)", marginBottom:"1.5rem", alignSelf:"flex-start", marginLeft:"1rem" }}/>

          <div
            style={{ position:"relative", width:"100%", flex:1, overflow:"hidden", perspective:"1000px", perspectiveOrigin:"50% 50%" }}
            onMouseDown={e => { isDragging.current = true; dragStartX.current = e.clientX; }}
            onMouseUp={e => {
              if (!isDragging.current) return;
              isDragging.current = false;
              const diff = dragStartX.current - e.clientX;
              if (Math.abs(diff) > 40) setActive(a => Math.max(0, Math.min(properties.length-1, a + (diff > 0 ? 1 : -1))));
            }}
            onTouchStart={e => { isDragging.current = true; dragStartX.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
              if (!isDragging.current) return;
              isDragging.current = false;
              const diff = dragStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) setActive(a => Math.max(0, Math.min(properties.length-1, a + (diff > 0 ? 1 : -1))));
            }}
            onWheel={e => {
              e.stopPropagation();
              if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                if (e.deltaX > 30) setActive(a => Math.min(properties.length-1, a + 1));
                if (e.deltaX < -30) setActive(a => Math.max(0, a - 1));
              }
            }}
          >
            {properties.map((prop, i) => {
              const diff = i - active;
              const abs = Math.abs(diff);
              if (abs > 3) return null;
              const scale = abs === 0 ? 1 : abs === 1 ? 0.75 : 0.55;
              return (
                <div key={prop.slug}
                  style={{
                    position:"absolute", left:"50%", top:"50%",
                    width:`${CARD_W}px`, height:`${CARD_H}px`,
                    transform:[`translate(-50%, -50%)`,`translateX(${diff * 55}%)`,`translateZ(${abs === 0 ? 0 : -160}px)`,`rotateY(${diff * 38}deg)`,`scale(${scale})`].join(" "),
                    opacity: abs === 0 ? 1 : abs === 1 ? 0.7 : abs === 2 ? 0.45 : 0.25,
                    zIndex: 10 - abs,
                    transition:"all 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
                    cursor: diff !== 0 ? "pointer" : "default",
                    transformOrigin:"center center",
                  }}
                  onClick={() => diff !== 0 && setActive(i)}
                >
                  <div style={{ width:"100%", height:"100%", background:"rgba(6,4,2,0.8)", border:`1px solid rgba(201,169,110,${i === active ? 0.5 : 0.15})`, boxShadow: i === active ? "0 20px 60px rgba(0,0,0,0.8)" : "0 10px 30px rgba(0,0,0,0.5)", overflow:"hidden", position:"relative" }}>
                    <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:`linear-gradient(90deg,transparent,rgba(201,169,110,${i === active ? 0.8 : 0.2}),transparent)` }}/>
                    {prop.galeria_urls?.[0]
                      ? <img src={convertGDriveUrl(prop.galeria_urls[0], 400, 75)} alt={getTitle(prop)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                      : <div style={{ width:"100%", height:"100%", background:"#111" }}/>
                    }
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(6,4,2,0.95) 100%)" }}/>
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0.6rem" }}>
                      <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.32rem", color:"rgba(201,169,110,0.7)", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.2rem" }}>{prop.ubicacion}</p>
                      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.7rem,1vw,0.9rem)", color:"white", margin:0, fontWeight:600, lineHeight:1.1 }}>{getTitle(prop)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display:"flex", gap:"0.4rem", marginTop:"1rem", flexShrink:0, paddingBottom:"0.5rem" }}>
            {properties.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? "1.2rem" : "0.3rem", height:"0.3rem", borderRadius:"2px", border:"none", cursor:"pointer", background: i === active ? "#c9a96e" : "rgba(255,255,255,0.2)", transition:"all 0.3s", padding:0, flexShrink:0 }}/>
            ))}
          </div>
        </div>

        {/* Columna derecha — Info */}
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"3rem 2.5rem 2rem", background:"rgba(6,4,2,0.82)", overflow:"auto", boxSizing:"border-box" }}>
          <div>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", color:"#c9a96e", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.8rem" }}>{p.ubicacion}</p>
            <div style={{ width:"2rem", height:"1px", background:"rgba(201,169,110,0.5)", margin:"0 0 1.2rem" }}/>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.5rem,2.5vw,2.5rem)", fontWeight:600, color:"white", lineHeight:1.1, margin:"0 0 1.5rem" }}>{getTitle(p)}</h2>
          </div>

          <div style={{ display:"flex", flexDirection:"column" }}>
            {stats.map(d => (
              <div key={d.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"0.75rem 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.55rem", color:"rgba(255,255,255,0.6)", letterSpacing:"0.25em", textTransform:"uppercase" }}>{d.label}</span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.8rem", color:"white", fontWeight:300 }}>{String(d.value)}</span>
              </div>
            ))}
          </div>

          {getDesc(p) && (
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.85rem,1.1vw,1rem)", fontStyle:"italic", color:"rgba(255,255,255,0.75)", lineHeight:1.7, margin:"1rem 0 0" }}>
              {getDesc(p)}
            </p>
          )}

          {p.precio && (
            <div style={{ paddingTop:"1.25rem", borderTop:"1px solid rgba(201,169,110,0.2)", marginTop:"1rem", flexShrink:0 }}>
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", color:"rgba(201,169,110,0.5)", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.4rem" }}>{t.price}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,3.5vw,3rem)", color:"#c9a96e", margin:"0 0 1.25rem", fontWeight:300 }}>€{(p.precio/1000000).toFixed(1)}M</p>
              <Link href={`/${locale}/propiedades/${p.slug}`} style={{ display:"block", textAlign:"center", fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(201,169,110,0.7)", textDecoration:"none", padding:"0.9rem", border:"1px solid rgba(201,169,110,0.3)", transition:"all 0.3s" }}>
                {t.viewProperty}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Indicador scroll vertical — señala que hay más secciones abajo */}
      <div style={{ position:"absolute", bottom:"3.5rem", left:"50%", transform:"translateX(-50%)", zIndex:10, pointerEvents:"none" }}>
        <ScrollIndicator />
      </div>
    </div>
  );
}
