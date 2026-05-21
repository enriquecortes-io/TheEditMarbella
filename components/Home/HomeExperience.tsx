"use client";
import { useRef, useEffect } from "react";
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
  const carouselRef = useRef<HTMLDivElement>(null);
  useHomeScroll({ headerRef, filtersRef, carouselRef, panelRefs, totalPanels: TOTAL_PANELS });

  return (
    <div style={{position:"fixed",inset:0,width:"100%",height:"100vh",overflow:"hidden",background:"transparent"}}>

      <div ref={headerRef} style={{
        position:"absolute", inset:0, zIndex:20,
        willChange:"opacity,transform",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <SkyHeader locale={locale} />
      </div>

      {/* Carrusel — siempre en DOM, opacidad gestionada por RAF */}
      <div ref={carouselRef} style={{
        position:"absolute", inset:0, zIndex:25,
        opacity:0, pointerEvents:"none",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:"0 clamp(1rem,5vw,4rem)",
      }}>
        <PropertyCarousel locale={locale} />
      </div>

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
