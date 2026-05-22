"use client";
import { useEffect, useRef } from "react";

type Phase = "header" | "manifesto" | "carousel" | "filters";

interface Props {
  headerRef: React.RefObject<HTMLDivElement | null>;
  manifestoRef: React.RefObject<HTMLDivElement | null>;
  filtersRef: React.RefObject<HTMLDivElement | null>;
  carouselRef?: React.RefObject<HTMLDivElement | null>;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  totalPanels: number;
}

export function useHomeScroll({ headerRef, manifestoRef, filtersRef, carouselRef, panelRefs, totalPanels }: Props) {
  const phaseRef = useRef<Phase>("header");
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let rafId: number;
    let smoothHeader = 0;
    let targetHeader = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let lastPhaseChange = 0;
    const PHASE_COOLDOWN = 800;

    const emitPhase = (phase: Phase) => {
      window.dispatchEvent(new CustomEvent("scrollphase", { detail: phase }));
    };

    const setPhase = (next: Phase) => {
      if (phaseRef.current !== next) {
        phaseRef.current = next;
        emitPhase(next);
      }
    };

    const lerpOpacity = (el: HTMLDivElement | null, target: number) => {
      if (!el) return;
      const cur = parseFloat(el.style.opacity || "0");
      const next = lerp(cur, target, 0.08);
      el.style.opacity = String(next);
      el.style.pointerEvents = next > 0.3 ? "auto" : "none";
    };

    const tick = () => {
      smoothHeader = lerp(smoothHeader, targetHeader, 0.055);
      const phase = phaseRef.current;

      // Header (controlado por smoothHeader/targetHeader)
      if (headerRef.current) {
        headerRef.current.style.opacity = String(1 - smoothHeader);
        headerRef.current.style.transform = `translate3d(0,${-smoothHeader * 80}px,0) scale(${1 - smoothHeader * 0.03})`;
        headerRef.current.style.pointerEvents = smoothHeader > 0.85 ? "none" : "auto";
      }

      // Manifesto / Carousel / Filters — opacidad fase-target
      lerpOpacity(manifestoRef.current, phase === "manifesto" ? 1 : 0);
      // Carousel — fade + scale + blur reveal
      const carEl2 = carouselRef?.current;
      if (carEl2) {
        const target = phase === "carousel" ? 1 : 0;
        const cur = parseFloat(carEl2.style.opacity || "0");
        const next = lerp(cur, target, 0.06);
        carEl2.style.opacity = String(next);
        carEl2.style.pointerEvents = next > 0.3 ? "auto" : "none";
        // Scale: entra desde 0.88 hasta 1
        const sc = 0.88 + next * 0.12;
        // Blur: se despeja de 12px a 0
        const bl = Math.max(0, (1 - next) * 12);
        carEl2.style.transform = `scale(${sc})`;
        carEl2.style.filter = bl > 0.1 ? `blur(${bl.toFixed(1)}px)` : "none";
      }
      lerpOpacity(filtersRef.current,   phase === "filters" ? 1 : 0);

      // Panels Z-axis
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

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    (window as any).__advancePanel = (next: number) => {
      targetProgressRef.current = Math.max(0, Math.min(totalPanels - 1, next));
    };

    // ── Transición direccional entre fases ───────────────────────────────
    const PHASE_ORDER: Phase[] = ["header", "manifesto", "carousel", "filters"];

    const goNext = () => {
      const idx = PHASE_ORDER.indexOf(phaseRef.current);
      const next = PHASE_ORDER[Math.min(PHASE_ORDER.length - 1, idx + 1)];
      if (next === "filters") targetProgressRef.current = 0;
      if (next !== "header") targetHeader = 1;
      setPhase(next);
    };

    const goPrev = () => {
      const idx = PHASE_ORDER.indexOf(phaseRef.current);
      const next = PHASE_ORDER[Math.max(0, idx - 1)];
      if (next === "header") targetHeader = 0;
      setPhase(next);
    };

    // ── WHEEL — snap acumulado ──────────────────────────────────────────
    let wheelAccum = 0;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;
    const WHEEL_SNAP = 300;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastPhaseChange < PHASE_COOLDOWN) return;

      // En header, scroll progresivo hasta el final
      if (phaseRef.current === "header") {
        targetHeader = Math.max(0, Math.min(1, targetHeader + e.deltaY * 0.002));
        if (targetHeader >= 1) {
          targetHeader = 1;
          lastPhaseChange = now;
          setPhase("manifesto");
        }
        return;
      }

      // En filters, manejar paneles internos primero
      if (phaseRef.current === "filters" && e.deltaY < 0 && targetProgressRef.current > 0) {
        return; // dejar que FilterPanels gestione paneles internos
      }

      wheelAccum += e.deltaY;
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelAccum = 0; }, 300);

      if (Math.abs(wheelAccum) >= WHEEL_SNAP) {
        const dir = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;
        lastPhaseChange = now;
        if (dir > 0) goNext(); else goPrev();
      }
    };

    // ── TOUCH — snap por gesto completo ─────────────────────────────────
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastPhaseChange < PHASE_COOLDOWN) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const elapsed = now - touchStartTime;
      const velocity = Math.abs(deltaY) / elapsed;

      const isSwipeDown = deltaY > 60 || (deltaY > 30 && velocity > 0.3);
      const isSwipeUp   = deltaY < -60 || (deltaY < -30 && velocity > 0.3);

      if (!isSwipeDown && !isSwipeUp) return;

      lastPhaseChange = now;
      if (isSwipeDown) goNext();
      else if (isSwipeUp) goPrev();
    };

    const handleTouchMove = (e: TouchEvent) => { e.preventDefault(); };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [headerRef, manifestoRef, filtersRef, carouselRef, panelRefs, totalPanels]);
}
