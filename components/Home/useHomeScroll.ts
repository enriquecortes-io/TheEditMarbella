"use client";
import { useEffect, useRef } from "react";

interface Props {
  headerRef: React.RefObject<HTMLDivElement | null>;
  filtersRef: React.RefObject<HTMLDivElement | null>;
  carouselRef?: React.RefObject<HTMLDivElement | null>;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  totalPanels: number;
}

export function useHomeScroll({ headerRef, filtersRef, carouselRef, panelRefs, totalPanels }: Props) {
  const phaseRef = useRef<"header" | "carousel" | "filters">("header");
  const headerProgressRef = useRef(0);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    let smoothHeader = 0;
    let targetHeader = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      smoothHeader = lerp(smoothHeader, targetHeader, 0.055);

      // Header
      if (headerRef.current) {
        headerRef.current.style.opacity = String(1 - smoothHeader);
        headerRef.current.style.transform = `translate3d(0,${-smoothHeader * 80}px,0) scale(${1 - smoothHeader * 0.03})`;
        headerRef.current.style.pointerEvents = smoothHeader > 0.85 ? "none" : "auto";
      }

      // Carousel — fade suave
      if (carouselRef?.current) {
        const show = phaseRef.current === "carousel";
        const cur = parseFloat(carouselRef.current.style.opacity || "0");
        const target = show ? 1 : 0;
        const next = lerp(cur, target, 0.08);
        carouselRef.current.style.opacity = String(next);
        carouselRef.current.style.pointerEvents = next > 0.3 ? "auto" : "none";
      }

      // Filtros — fade suave
      if (filtersRef.current) {
        const show = phaseRef.current === "filters";
        const cur = parseFloat(filtersRef.current.style.opacity || "0");
        const target = show ? 1 : 0;
        const next = lerp(cur, target, 0.08);
        filtersRef.current.style.opacity = String(next);
        filtersRef.current.style.pointerEvents = next > 0.3 ? "auto" : "none";
      }

      // Panels Z-axis — solo se animan, NO avanzan solos
      progressRef.current = lerp(progressRef.current, targetProgressRef.current, 0.07);
      for (let i = 0; i < totalPanels; i++) {
        const el = panelRefs.current[i];
        if (!el) continue;
        const diff = i - progressRef.current;
        let opacity = 0, scale = 1, zPos = 0, blur = 0;
        if (diff > 1 || diff < -1.5) {
          opacity = 0; scale = 0.3; zPos = diff > 0 ? 450 : -450; blur = 30;
        } else if (diff > 0 && diff <= 1) {
          const t = diff;
          opacity = Math.max(0, 1 - t * 0.7);
          scale = 1 + t * 1.5;
          zPos = t * 450;
          blur = t * 20;
        } else if (diff >= -0.3 && diff <= 0.05) {
          opacity = 1; scale = 1; zPos = 0; blur = 0;
        } else {
          const t = Math.abs(diff);
          opacity = Math.max(0, 1 - t * 1.5);
          scale = Math.max(0.4, 1 - t * 0.5);
          zPos = -t * 350;
          blur = t * 12;
        }
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0,0,${zPos}px) scale(${scale})`;
        el.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
        el.style.pointerEvents = Math.abs(diff) < 0.4 ? "auto" : "none";
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Los paneles del filtro solo avanzan cuando el usuario selecciona una opción
    (window as any).__advancePanel = (next: number) => {
      targetProgressRef.current = Math.max(0, Math.min(totalPanels - 1, next));
    };

    const handleDelta = (delta: number) => {
      if (phaseRef.current === "header") {
        headerProgressRef.current = Math.max(0, Math.min(1, headerProgressRef.current + delta * 0.003));
        targetHeader = headerProgressRef.current;
        if (headerProgressRef.current >= 1) {
          phaseRef.current = "carousel";
        }
      } else if (phaseRef.current === "carousel") {
        if (delta < 0) {
          phaseRef.current = "header";
          headerProgressRef.current = 0.95;
          targetHeader = 0.95;
        } else if (delta > 100) {
          phaseRef.current = "filters";
          targetProgressRef.current = 0;
        }
      } else if (phaseRef.current === "filters") {
        // En filtros el scroll NO avanza paneles — solo se avanza seleccionando opciones
        // Solo permite volver al carrusel
        if (targetProgressRef.current <= 0 && delta < -100) {
          phaseRef.current = "carousel";
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleDelta(e.deltaY);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = (touchStartY - e.touches[0].clientY) * 2;
      touchStartY = e.touches[0].clientY;
      handleDelta(delta);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);
}
