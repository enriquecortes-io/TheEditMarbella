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
  const carouselElRef = useRef<HTMLDivElement | null>(null);
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

      // Actualizar ref al elemento del carrusel
      if (carouselRef?.current) carouselElRef.current = carouselRef.current;
      const carEl = carouselElRef.current;
      const phase = phaseRef.current;
      
      // Header
      if (headerRef.current) {
        headerRef.current.style.opacity = String(1 - smoothHeader);
        headerRef.current.style.transform = `translate3d(0,${-smoothHeader * 80}px,0) scale(${1 - smoothHeader * 0.03})`;
        headerRef.current.style.pointerEvents = smoothHeader > 0.85 ? "none" : "auto";
      }

      // Carousel
      if (carEl) {
        const show = phase === "carousel";
        const cur = parseFloat(carEl.style.opacity || "0");
        const next = lerp(cur, show ? 1 : 0, 0.06);
        carEl.style.opacity = String(next);
        carEl.style.pointerEvents = next > 0.3 ? "auto" : "none";
      }

      // Filters
      if (filtersRef.current) {
        const show = phaseRef.current === "filters";
        const cur = parseFloat(filtersRef.current.style.opacity || "0");
        filtersRef.current.style.opacity = String(lerp(cur, show ? 1 : 0, 0.06));
        filtersRef.current.style.pointerEvents = cur > 0.3 ? "auto" : "none";
      }

      // Panels
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
          scale = 1 + t * 1.5; zPos = t * 450; blur = t * 20;
        } else if (diff >= -0.3 && diff <= 0.05) {
          opacity = 1; scale = 1; zPos = 0; blur = 0;
        } else {
          const t = Math.abs(diff);
          opacity = Math.max(0, 1 - t * 1.5);
          scale = Math.max(0.4, 1 - t * 0.5);
          zPos = -t * 350; blur = t * 12;
        }
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0,0,${zPos}px) scale(${scale})`;
        el.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
        el.style.pointerEvents = Math.abs(diff) < 0.4 ? "auto" : "none";
      }

      (window as any).__phase = phaseRef.current;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    (window as any).__advancePanel = (next: number) => {
      targetProgressRef.current = Math.max(0, Math.min(totalPanels - 1, next));
    };

    const handleDelta = (delta: number) => {
      if (phaseRef.current === "header") {
        targetHeader = Math.max(0, Math.min(1, targetHeader + delta * 0.002));
        if (targetHeader >= 1) {
          targetHeader = 1;
          phaseRef.current = "carousel";
        }
      } else if (phaseRef.current === "carousel") {
        if (delta < 0) {
          phaseRef.current = "header";
          const dh = document.getElementById("phase-debug");
          if (dh) dh.textContent = "header";
          targetHeader = 0.5;
        } else if (delta > 0) {
          phaseRef.current = "filters";
          const df = document.getElementById("phase-debug");
          if (df) df.textContent = "filters";
          targetProgressRef.current = 0;
        }
      } else if (phaseRef.current === "filters") {
        if (targetProgressRef.current <= 0 && delta < 0) {
          phaseRef.current = "carousel";
        }
      }
    };

    const handleWheel = (e: WheelEvent) => { e.preventDefault(); handleDelta(e.deltaY); };
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
