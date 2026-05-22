"use client";
import { useRef } from "react";
import PropertyCarousel from "./PropertyCarousel";
import { useHomeScroll } from "./useHomeScroll";
import SkyHeader from "./SkyHeader";
import FilterPanels from "./FilterPanels";
import Manifesto from "./Manifesto";

interface Props { locale: string; }
const TOTAL_PANELS = 3;

export default function HomeExperience({ locale }: Props) {
  const headerRef    = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const filtersRef   = useRef<HTMLDivElement>(null);
  const carouselRef  = useRef<HTMLDivElement>(null);
  const panelRefs    = useRef<(HTMLDivElement | null)[]>([]);

  useHomeScroll({ headerRef, manifestoRef, filtersRef, carouselRef, panelRefs, totalPanels: TOTAL_PANELS });

  return (
    <div style={{position:"fixed",inset:0,width:"100%",height:"100vh",overflow:"hidden",background:"transparent"}}>

      {/* Header */}
      <div ref={headerRef} style={{
        position:"absolute", inset:0, zIndex:20,
        willChange:"opacity,transform",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <SkyHeader locale={locale} />
      </div>

      {/* Manifesto */}
      <Manifesto ref={manifestoRef} locale={locale} />

      {/* Carrusel */}
      <div ref={carouselRef} style={{
        position:"absolute", inset:0, zIndex:25,
        opacity:0, pointerEvents:"none",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"clamp(0px,2vw,2rem) clamp(0px,5vw,4rem)",
        transformOrigin:"center center",
      }}>
        <PropertyCarousel locale={locale} />
      </div>

      {/* Filtros */}
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
