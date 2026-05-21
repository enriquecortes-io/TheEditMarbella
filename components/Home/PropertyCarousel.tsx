"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Property {
  slug: string;
  titulo: Record<string, string> | string;
  precio: number;
  ubicacion: string;
  m2_construidos: number;
  habitaciones: number;
  galeria_urls: string[];
}

export default function PropertyCarousel({ locale = "es" }: { locale?: string }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [active, setActive] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    fetch("/api/admin/properties")
      .then(r => r.json())
      .then(data => {
        const props = (data.properties || []).filter((p: any) => p.activa).slice(0, 5);
        setProperties(props);
        setActive(Math.floor(props.length / 2));
      })
      .catch(() => {});
  }, []);

  const getTitle = (p: Property) =>
    typeof p.titulo === "object" ? p.titulo[locale] || p.titulo["es"] || "" : p.titulo;

  // Si no hay propiedades, mostrar placeholder
  if (properties.length === 0) {
    return (
      <div style={{
        color:"rgba(201,169,110,0.6)",
        fontFamily:"'Montserrat',sans-serif",
        fontSize:"0.5rem",
        letterSpacing:"0.5em",
        textTransform:"uppercase",
      }}>Cargando selección...</div>
    );
  }

  const getCardStyle = (i: number): React.CSSProperties => {
    const diff = i - active;
    const abs = Math.abs(diff);
    if (abs > 2) return { display: "none" };
    return {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: "clamp(200px,25vw,300px)",
      height: "clamp(280px,35vw,420px)",
      marginLeft: `-${abs === 0 ? 150 : 120}px`,
      marginTop: `-${abs === 0 ? 210 : 168}px`,
      transform: `translateX(${diff * 52}%) translateZ(${abs === 0 ? 0 : -180}px) rotateY(${diff * 42}deg) scale(${abs === 0 ? 1 : abs === 1 ? 0.78 : 0.58})`,
      opacity: abs === 0 ? 1 : abs === 1 ? 0.65 : 0.35,
      zIndex: 10 - abs,
      transition: "all 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
      cursor: diff !== 0 ? "pointer" : "default",
    };
  };

  return (
    <div style={{
      width:"100%", maxWidth:"1200px", margin:"0 auto",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      gap:"2rem",
    }}>
      <div style={{ textAlign:"center" }}>
        <p style={{
          fontFamily:"'Montserrat',sans-serif",
          fontSize:"0.45rem", fontWeight:400,
          color:"rgba(201,169,110,0.8)",
          letterSpacing:"0.65em", textTransform:"uppercase",
          margin:0,
        }}>Selección</p>
        <div style={{ width:"2rem", height:"1px", background:"rgba(201,169,110,0.4)", margin:"0.6rem auto 0" }}/>
      </div>

      <div
        style={{
          position:"relative",
          width:"100%",
          height:"clamp(300px,40vw,440px)",
          perspective:"1200px",
          perspectiveOrigin:"50% 50%",
          transformStyle:"preserve-3d",
        }}
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
      >
        {properties.map((p, i) => (
          <div key={p.slug} style={getCardStyle(i)} onClick={() => i !== active && setActive(i)}>
            <div style={{
              width:"100%", height:"100%",
              background:"rgba(6,4,2,0.65)",
              border:`1px solid rgba(201,169,110,${i === active ? 0.4 : 0.12})`,
              boxShadow: i === active
                ? "0 0 0 1px rgba(255,255,255,0.04), 0 40px 120px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)"
                : "0 20px 60px rgba(0,0,0,0.5)",
              backdropFilter:"blur(20px)",
              display:"flex", flexDirection:"column",
              overflow:"hidden", position:"relative",
            }}>
              <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:`linear-gradient(90deg,transparent,rgba(201,169,110,${i === active ? 0.8 : 0.3}),transparent)` }}/>

              <div style={{ flex:1, overflow:"hidden", position:"relative" }}>
                {p.galeria_urls?.[0] ? (
                  <img src={p.galeria_urls[0]} alt={getTitle(p)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                ) : (
                  <div style={{ width:"100%", height:"100%", background:"#111" }}/>
                )}
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(6,4,2,0.9) 100%)" }}/>
              </div>

              <div style={{ padding:"1rem 1.2rem 1.2rem" }}>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem", color:"rgba(201,169,110,0.7)", letterSpacing:"0.5em", textTransform:"uppercase", display:"block", marginBottom:"0.4rem" }}>{p.ubicacion}</span>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.95rem,1.4vw,1.2rem)", fontWeight:600, color:"white", margin:"0 0 0.6rem", lineHeight:1.1 }}>{getTitle(p)}</h3>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:"0.8rem" }}>
                    {p.m2_construidos && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", color:"rgba(255,255,255,0.35)" }}>{p.m2_construidos}m²</span>}
                    {p.habitaciones && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", color:"rgba(255,255,255,0.35)" }}>{p.habitaciones} hab</span>}
                  </div>
                  {p.precio && <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.9rem,1.3vw,1.1rem)", color:"#c9a96e", fontWeight:300 }}>€{(p.precio/1000000).toFixed(1)}M</span>}
                </div>
                {i === active && (
                  <Link href={`/${locale}/propiedades/${p.slug}`} style={{ display:"block", textAlign:"center", fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem", letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(201,169,110,0.7)", textDecoration:"none", marginTop:"0.8rem", paddingTop:"0.7rem", borderTop:"1px solid rgba(201,169,110,0.2)" }}>Ver propiedad</Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
        {properties.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === active ? "1.5rem" : "0.35rem",
            height:"0.35rem", borderRadius:"2px", border:"none", cursor:"pointer",
            background: i === active ? "#c9a96e" : "rgba(255,255,255,0.2)",
            transition:"all 0.3s ease", padding:0,
          }}/>
        ))}
      </div>
    </div>
  );
}
