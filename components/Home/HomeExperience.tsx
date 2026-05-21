"use client";
import PropertyCarousel from "./PropertyCarousel";
import { useRef } from "react";
import { useHomeScroll } from "./useHomeScroll";
import SkyHeader from "./SkyHeader";
import FilterPanels from "./FilterPanels";

interface Props { locale: string; }

const TOTAL_PANELS = 3;

export default function HomeExperience({ locale }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useHomeScroll({ headerRef, filtersRef, carouselRef, panelRefs, totalPanels: TOTAL_PANELS });

  // Debug temporal — forzar visibilidad del carrusel
  if (typeof window !== "undefined") {
    setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.style.opacity = "1";
        carouselRef.current.style.pointerEvents = "auto";
      }
    }, 2000);
  }

  return (
    <div style={{position:"fixed",inset:0,width:"100%",height:"100vh",overflow:"hidden",background:"transparent"}}>

      {/* Header */}
      <div ref={headerRef} style={{
        position:"absolute", inset:0, zIndex:20,
        willChange:"opacity,transform",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
      }}>
        <SkyHeader locale={locale} />
      </div>

      {/* Carrusel — empieza oculto, RAF lo muestra */}
      <div ref={carouselRef} style={{
        position:"absolute", inset:0, zIndex:15,
        opacity:0, pointerEvents:"none",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"0 clamp(1rem,5vw,4rem)",
      }}>
        <PropertyCarousel locale={locale} />
      </div>

      {/* Filtros — empieza oculto, RAF lo muestra */}
      <div ref={filtersRef} style={{
        position:"absolute", inset:0, zIndex:10,
        opacity:0, pointerEvents:"none",
        perspective:"500px",
        perspectiveOrigin:"center center",
        background:"transparent",
      }}>
        <div style={{position:"absolute",inset:0,transformStyle:"preserve-3d"}}>
          <FilterPanels locale={locale} panelRefs={panelRefs} />
        </div>
      </div>

    </div>
  );
}
