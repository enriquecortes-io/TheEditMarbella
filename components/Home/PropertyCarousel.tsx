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
  banos: number;
  m2_parcela: number;
  descripcion: Record<string, string> | string;
  galeria_urls: string[];
}

export default function PropertyCarousel({ locale = "es" }: { locale?: string }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [active, setActive] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    fetch("/api/properties")
      .then(r => r.json())
      .then(data => {
        const props = (data.properties || []).slice(0, 5);
        setProperties(props);
        setActive(2);
      })
      .catch(() => {});
  }, []);

  const getTitle = (p: Property) =>
    typeof p.titulo === "object" ? p.titulo[locale] || p.titulo["es"] || "" : p.titulo;

  if (properties.length === 0) {
    return (
      <div style={{ color:"rgba(201,169,110,0.6)", fontFamily:"'Montserrat',sans-serif", fontSize:"0.5rem", letterSpacing:"0.5em", textTransform:"uppercase" }}>
        Cargando selección...
      </div>
    );
  }

  const p = properties[active];

  return (
    <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 clamp(1rem,3vw,3rem)" }}>
      <div style={{
        width:"100%", maxWidth:"1400px",
        height:"clamp(500px,80vh,800px)",
        display:"grid", gridTemplateColumns:"1fr 1fr",
        background:"rgba(6,4,2,0.65)",
        border:"1px solid rgba(201,169,110,0.18)",
        boxShadow:"0 0 0 1px rgba(255,255,255,0.04),0 20px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.08)",
        backdropFilter:"blur(50px)",
        overflow:"hidden", position:"relative",
      }}>
        {/* Línea dorada */}
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(201,169,110,0.8),transparent)", zIndex:2 }}/>

        {/* Columna izquierda — Carrusel */}
        <div style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"3.5rem 1rem 2rem", borderRight:"1px solid rgba(201,169,110,0.12)" }}>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.45rem", color:"rgba(201,169,110,0.8)", letterSpacing:"0.65em", textTransform:"uppercase", margin:"0 0 0.8rem", alignSelf:"flex-start", paddingLeft:"1rem" }}>Últimos Listados</p>
          <div style={{ width:"1.5rem", height:"1px", background:"rgba(201,169,110,0.4)", marginBottom:"1.5rem", alignSelf:"flex-start", marginLeft:"1rem" }}/>

          {/* Stage 3D */}
          <div
            style={{ position:"relative", width:"100%", flex:1, perspective:"1000px", perspectiveOrigin:"50% 50%", transformStyle:"preserve-3d" }}
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
              return (
                <div key={prop.slug}
                  style={{
                    position:"absolute", left:"50%", top:"50%",
                    width:"clamp(200px,26vw,320px)", height:"clamp(280px,36vw,440px)",
                    marginLeft:`-${abs === 0 ? 150 : 110}px`,
                    marginTop:`-220px`,
                    transform:`translateX(${diff * 45}%) translateZ(${abs === 0 ? 0 : -160}px) rotateY(${diff * 38}deg) scale(${abs === 0 ? 1 : abs === 1 ? 0.75 : 0.55})`,
                    opacity: abs === 0 ? 1 : abs === 1 ? 0.7 : abs === 2 ? 0.45 : 0.25,
                    zIndex: 10 - abs,
                    transition:"all 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
                    cursor: diff !== 0 ? "pointer" : "default",
                  }}
                  onClick={() => diff !== 0 && setActive(i)}
                >
                  <div style={{ width:"100%", height:"100%", background:"rgba(6,4,2,0.8)", border:`1px solid rgba(201,169,110,${i === active ? 0.5 : 0.15})`, boxShadow: i === active ? "0 20px 60px rgba(0,0,0,0.8)" : "0 10px 30px rgba(0,0,0,0.5)", overflow:"hidden", position:"relative" }}>
                    <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:`linear-gradient(90deg,transparent,rgba(201,169,110,${i === active ? 0.8 : 0.2}),transparent)` }}/>
                    {prop.galeria_urls?.[0]
                      ? <img src={prop.galeria_urls[0]} alt={getTitle(prop)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
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

          {/* Dots */}
          <div style={{ display:"flex", gap:"0.4rem", marginTop:"1rem" }}>
            {properties.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? "1.2rem" : "0.3rem", height:"0.3rem", borderRadius:"2px", border:"none", cursor:"pointer", background: i === active ? "#c9a96e" : "rgba(255,255,255,0.2)", transition:"all 0.3s", padding:0 }}/>
            ))}
          </div>
        </div>

        {/* Columna derecha — Info propiedad */}
        <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"3rem 2.5rem", background:"rgba(6,4,2,0.82)" }}>
          <div>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", color:"#c9a96e", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.8rem" }}>{p.ubicacion}</p>
            <div style={{ width:"2rem", height:"1px", background:"rgba(201,169,110,0.5)", margin:"0 0 1.2rem" }}/>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.5rem,2.5vw,2.5rem)", fontWeight:600, color:"white", lineHeight:1.1, margin:"0 0 2rem" }}>{getTitle(p)}</h2>
          </div>

          <div style={{ display:"flex", flexDirection:"column" }}>
            {[
              { label:"Superficie", value: p.m2_construidos ? `${p.m2_construidos} m²` : null },
              { label:"Habitaciones", value: p.habitaciones || null },
              { label:"Baños", value: p.banos || null },
            ].filter(d => d.value).map(d => (
              <div key={d.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", padding:"1rem 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.55rem", color:"rgba(255,255,255,0.6)", letterSpacing:"0.25em", textTransform:"uppercase" }}>{d.label}</span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", color:"white", fontWeight:300 }}>{String(d.value)}</span>
              </div>
            ))}
          </div>

          {(() => {
            const desc = typeof p.descripcion === "object" ? (p.descripcion as any)["es"] || (p.descripcion as any)["en"] || "" : p.descripcion || "";
            const first = desc.match(/^[^.!?]+[.!?]/)?.[0] || "";
            return first ? <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.85rem,1.1vw,1rem)", fontStyle:"italic", color:"rgba(255,255,255,0.75)", lineHeight:1.7, margin:"1rem 0 1.5rem" }}>{first}</p> : null;
          })()}
          {(() => {
            const desc = typeof p.descripcion === "object"
              ? (p.descripcion as any)["es"] || (p.descripcion as any)["en"] || ""
              : p.descripcion || "";
            const first = desc.match(/^[^.!?]+[.!?]/)?.[0] || "";
            return first ? (
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.85rem,1.1vw,1rem)", fontStyle:"italic", color:"rgba(255,255,255,0.5)", lineHeight:1.7, margin:"1rem 0" }}>
                {first}
              </p>
            ) : null;
          })()}
          {p.precio && (
            <div style={{ paddingTop:"1.5rem", borderTop:"1px solid rgba(201,169,110,0.2)" }}>
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", color:"rgba(201,169,110,0.5)", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.4rem" }}>Precio</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.5rem,4vw,3.5rem)", color:"#c9a96e", margin:"0 0 1.5rem", fontWeight:300 }}>€{(p.precio/1000000).toFixed(1)}M</p>
              <Link href={`/${locale}/propiedades/${p.slug}`} style={{ display:"block", textAlign:"center", fontFamily:"'Montserrat',sans-serif", fontSize:"0.42rem", letterSpacing:"0.45em", textTransform:"uppercase", color:"rgba(201,169,110,0.7)", textDecoration:"none", padding:"0.8rem", border:"1px solid rgba(201,169,110,0.3)" }}>
                Ver propiedad
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
