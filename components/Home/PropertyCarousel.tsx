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
  const [active, setActive] = useState(2);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartIdx = useRef(0);

  useEffect(() => {
    fetch("/api/admin/properties")
      .then(r => r.json())
      .then(data => {
        const props = (data.properties || [])
          .filter((p: any) => p.activa)
          .slice(0, 5);
        setProperties(props);
        setActive(Math.floor(props.length / 2));
      });
  }, []);

  if (properties.length === 0) return null;

  const getTitle = (p: Property) =>
    typeof p.titulo === "object" ? p.titulo[locale] || p.titulo["es"] || "" : p.titulo;

  const getCardStyle = (i: number): React.CSSProperties => {
    const diff = i - active;
    const absDiff = Math.abs(diff);

    if (absDiff > 2) return { display: "none" };

    const rotateY = diff * 45;
    const translateX = diff * 55;
    const translateZ = absDiff === 0 ? 0 : -200;
    const scale = absDiff === 0 ? 1 : absDiff === 1 ? 0.8 : 0.6;
    const opacity = absDiff === 0 ? 1 : absDiff === 1 ? 0.7 : 0.4;
    const zIndex = 10 - absDiff;

    return {
      position: "absolute",
      width: "clamp(220px,28vw,340px)",
      height: "clamp(300px,38vw,460px)",
      transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      transition: "all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
      cursor: diff !== 0 ? "pointer" : "default",
      transformOrigin: "center center",
    };
  };

  const handleDragStart = (x: number) => {
    setDragging(true);
    dragStartX.current = x;
    dragStartIdx.current = active;
  };

  const handleDragEnd = (x: number) => {
    if (!dragging) return;
    setDragging(false);
    const diff = dragStartX.current - x;
    if (Math.abs(diff) > 50) {
      const next = diff > 0
        ? Math.min(properties.length - 1, dragStartIdx.current + 1)
        : Math.max(0, dragStartIdx.current - 1);
      setActive(next);
    }
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "clamp(360px,50vw,520px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      perspective: "1200px",
      perspectiveOrigin: "50% 50%",
      overflow: "hidden",
    }}
      onMouseDown={e => handleDragStart(e.clientX)}
      onMouseUp={e => handleDragEnd(e.clientX)}
      onTouchStart={e => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={e => handleDragEnd(e.changedTouches[0].clientX)}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
        {properties.map((p, i) => (
          <div
            key={p.slug}
            style={{ ...getCardStyle(i), left: "50%", marginLeft: `calc(-${i === active ? "170px" : "140px"})` }}
            onClick={() => i !== active && setActive(i)}
          >
            {/* Card */}
            <div style={{
              width: "100%", height: "100%",
              borderRadius: "2px",
              overflow: "hidden",
              border: i === active ? "1px solid rgba(201,169,110,0.5)" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: i === active
                ? "0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(201,169,110,0.15)"
                : "0 20px 60px rgba(0,0,0,0.6)",
              position: "relative",
            }}>
              {/* Foto */}
              <div style={{ width: "100%", height: "65%", overflow: "hidden", position: "relative" }}>
                {p.galeria_urls?.[0] ? (
                  <img
                    src={p.galeria_urls[0]}
                    alt={getTitle(p)}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }}/>
                )}
                {/* Overlay gradiente */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to bottom, transparent 40%, rgba(6,4,2,0.8) 100%)",
                }}/>
              </div>

              {/* Info */}
              <div style={{
                background: "#080604",
                padding: "1.2rem 1.4rem",
                height: "35%",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <div>
                  <p style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.4rem", color: "#c9a96e", letterSpacing: "0.4em", textTransform: "uppercase", margin: "0 0 0.4rem" }}>
                    {p.ubicacion}
                  </p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1rem,1.5vw,1.3rem)", fontWeight: 600, color: "white", margin: "0 0 0.6rem", lineHeight: 1.1 }}>
                    {getTitle(p)}
                  </h3>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {p.m2_construidos && (
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.45rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                        {p.m2_construidos} m²
                      </span>
                    )}
                    {p.habitaciones && (
                      <span style={{ fontFamily: "'Montserrat',sans-serif", fontSize: "0.45rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                        {p.habitaciones} hab
                      </span>
                    )}
                  </div>
                  {p.precio && (
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(1rem,1.4vw,1.2rem)", color: "#c9a96e", fontWeight: 300 }}>
                      €{(p.precio / 1000000).toFixed(1)}M
                    </span>
                  )}
                </div>

                {/* CTA solo en card activa */}
                {i === active && (
                  <Link href={`/${locale}/propiedades/${p.slug}`} style={{
                    display: "block", textAlign: "center",
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: "0.4rem", letterSpacing: "0.4em",
                    textTransform: "uppercase", color: "#c9a96e",
                    textDecoration: "none", marginTop: "0.8rem",
                    paddingTop: "0.8rem",
                    borderTop: "1px solid rgba(201,169,110,0.2)",
                  }}>
                    Ver propiedad →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div style={{
        position: "absolute", bottom: "1rem", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "0.5rem",
      }}>
        {properties.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === active ? "1.5rem" : "0.4rem",
            height: "0.4rem",
            borderRadius: "2px",
            background: i === active ? "#c9a96e" : "rgba(255,255,255,0.2)",
            border: "none", cursor: "pointer",
            transition: "all 0.3s ease",
            padding: 0,
          }}/>
        ))}
      </div>
    </div>
  );
}
