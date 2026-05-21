"use client";
import { useRef, useState, useEffect } from "react";
import PropertyCarousel from "./PropertyCarousel";
import { useHomeScroll } from "./useHomeScroll";
import SkyHeader from "./SkyHeader";
import FilterPanels from "./FilterPanels";

interface Props { locale: string; }

const TOTAL_PANELS = 3;

export default function HomeExperience({ locale }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showCarousel, setShowCarousel] = useState(false);

  useHomeScroll({ headerRef, filtersRef, panelRefs, totalPanels: TOTAL_PANELS });

  // Observar la opacidad del header — cuando casi desaparece, mostrar carrusel
  useEffect(() => {
    const observer = setInterval(() => {
      if (!headerRef.current || !filtersRef.current) return;
      const headerOp = parseFloat(headerRef.current.style.opacity || "1");
      const filtersOp = parseFloat(filtersRef.current.style.opacity || "0");
      // Carrusel solo visible cuando header invisible Y filtros invisibles
      setShowCarousel(headerOp < 0.15 && filtersOp < 0.15);
    }, 100);
    return () => clearInterval(observer);
  }, []);

  return (
    <div style={{position:"fixed",inset:0,width:"100%",height:"100vh",overflow:"hidden",background:"transparent"}}>

      <div ref={headerRef} style={{
        position:"absolute", inset:0, zIndex:20,
        willChange:"opacity,transform",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <SkyHeader locale={locale} />
      </div>

      {/* Carrusel — controlado por state React, no por refs */}
      {showCarousel && (
        <div style={{
          position:"absolute", inset:0, zIndex:25,
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"0 clamp(1rem,5vw,4rem)",
          animation:"carouselFadeIn 0.5s ease forwards",
        }}>
          <style>{`
            @keyframes carouselFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
          <PropertyCarousel locale={locale} />
        </div>
      )}

      <div ref={filtersRef} style={{
        position:"absolute", inset:0, zIndex:10,
        opacity:0, pointerEvents:"none",
        perspective:"500px",
      }}>
        <div style={{position:"absolute",inset:0,transformStyle:"preserve-3d"}}>
          <FilterPanels locale={locale} panelRefs={panelRefs} />
        </div>
      </div>

    </div>
  );
}
