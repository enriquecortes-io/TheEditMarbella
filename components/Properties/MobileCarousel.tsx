"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";

interface Props {
  properties: Property[];
  locale: string;
  tp: any;
}

export default function MobileCarousel({ properties, locale, tp }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const n = properties.length;

  const getTitle = (p: Property) =>
    typeof p.titulo === "object" ? (p.titulo as any)[locale] || (p.titulo as any)["es"] || "" : p.titulo;

  const goTo = (next: number) => {
    setActive(Math.max(0, Math.min(n - 1, next)));
    setDragX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy)) setDragX(dx);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setDragging(false);
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      goTo(active + (dx > 0 ? 1 : -1));
    } else {
      setDragX(0);
    }
  };

  const cardW = Math.min(window?.innerWidth * 0.78 || 300, 340);
  const cardH = Math.min(window?.innerHeight * 0.62 || 500, 560);

  return (
    <div style={{
      position:"fixed", inset:0,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      overflow:"hidden",
    }}>
      <style>{`
        @keyframes springIn {
          0%   { transform: scale(0.92); opacity: 0; }
          60%  { transform: scale(1.02); }
          100% { transform: scale(1);    opacity: 1; }
        }
      `}</style>

      {/* Stage */}
      <div
        style={{ position:"relative", width:"100%", height:`${cardH}px`, perspective:"800px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {properties.map((p, i) => {
          const diff = i - active;
          const abs = Math.abs(diff);
          if (abs > 2) return null;

          // Drag offset solo para el card activo
          const drag = i === active ? dragX * 0.3 : 0;

          const translateX = diff * (cardW * 0.72) + drag;
          const translateZ = abs === 0 ? 0 : abs === 1 ? -120 : -240;
          const rotateY    = diff * 28 + (i === active ? dragX * 0.02 : 0);
          const scale      = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.66;
          const opacity    = abs === 0 ? 1 : abs === 1 ? 0.65 : 0.35;

          return (
            <div
              key={p.slug}
              onClick={() => {
                if (abs === 0) router.push(`/${locale}/propiedades/${p.slug}`);
                else goTo(i);
              }}
              style={{
                position:"absolute",
                left:"50%", top:"50%",
                width:`${cardW}px`, height:`${cardH}px`,
                marginLeft:`${-cardW/2}px`, marginTop:`${-cardH/2}px`,
                transform:`translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                transition: dragging ? "none" : "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                transformOrigin:"center center",
                cursor: abs === 0 ? "pointer" : "pointer",
                zIndex: 10 - abs,
                borderRadius:"2px",
                overflow:"hidden",
                border:`1px solid rgba(201,169,110,${abs === 0 ? 0.5 : 0.15})`,
                boxShadow: abs === 0 ? "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,169,110,0.1)" : "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              {/* Imagen */}
              {p.galeria_urls?.[0]
                ? <img src={p.galeria_urls[0]} alt={getTitle(p)} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                : <div style={{ width:"100%", height:"100%", background:"#111" }}/>
              }

              {/* Overlay */}
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 35%, rgba(4,3,2,0.97) 100%)" }}/>

              {/* Línea dorada */}
              <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:`linear-gradient(90deg,transparent,rgba(201,169,110,${abs===0?0.8:0.2}),transparent)` }}/>

              {/* Info */}
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"1.2rem 1rem" }}>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem", color:"rgba(201,169,110,0.8)", letterSpacing:"0.35em", textTransform:"uppercase", margin:"0 0 0.4rem" }}>{p.ubicacion}</p>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.1rem,4vw,1.4rem)", color:"white", margin:"0 0 0.6rem", fontWeight:600, lineHeight:1.1 }}>{getTitle(p)}</h3>
                <div style={{ display:"flex", gap:"1rem", alignItems:"baseline" }}>
                  {p.precio && <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", color:"#c9a96e", fontWeight:300 }}>€{(p.precio/1000000).toFixed(1)}M</span>}
                  {p.m2_construidos && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem", color:"rgba(255,255,255,0.5)", letterSpacing:"0.2em" }}>{p.m2_construidos} m²</span>}
                  {p.habitaciones && <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem", color:"rgba(255,255,255,0.5)", letterSpacing:"0.2em" }}>{p.habitaciones} {tp.bed}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div style={{ display:"flex", gap:"0.4rem", marginTop:"1.5rem", zIndex:20 }}>
        {properties.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === active ? "1.2rem" : "0.3rem",
            height:"0.3rem", borderRadius:"2px", border:"none",
            background: i === active ? "#c9a96e" : "rgba(255,255,255,0.2)",
            transition:"all 0.3s", padding:0, cursor:"pointer",
          }}/>
        ))}
      </div>

      {/* Counter */}
      <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem", color:"rgba(201,169,110,0.5)", letterSpacing:"0.4em", marginTop:"0.8rem", zIndex:20 }}>
        {String(active+1).padStart(2,"0")} / {String(n).padStart(2,"0")}
      </p>
    </div>
  );
}
