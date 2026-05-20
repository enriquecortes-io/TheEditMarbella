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

  useHomeScroll({ headerRef, filtersRef, panelRefs, totalPanels: TOTAL_PANELS });

  return (
    <div style={{position:"fixed",inset:0,width:"100%",height:"100vh",overflow:"hidden",background:"transparent"}}>
      {/* Header con tipografia */}
      <div ref={headerRef} style={{
        position:"absolute", inset:0, zIndex:20,
        willChange:"opacity,transform",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
      }}>
        <SkyHeader locale={locale} />
      </div>

      {/* Filtros */}
      {/* Carrusel 3D propiedades */}
      <div style={{
        position:"fixed", inset:0, zIndex:5,
        display:"flex", alignItems:"center", justifyContent:"center",
        pointerEvents:"none",
      }} id="carousel-wrapper">
        <PropertyCarousel locale={locale} />
      </div>

      <div ref={filtersRef} style={{
        position:"absolute", inset:0, zIndex:10,
        opacity:1, pointerEvents:"none",
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
