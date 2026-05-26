"use client";
import { useEffect, useRef } from "react";
import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";

const BODY_TEXT_ES = `Rechazamos lo que casi lo logra. Cada residencia que cruza este umbral ha sido contemplada, medida y comprendida en su totalidad. Lo bueno es enemigo de lo extraordinario.

La Costa del Sol guarda tesoros que nunca aparecen en escaparates. Esto es The Edit: el acceso silencioso a lo que la mayoría jamás verá.`;

const BODY_TEXT_EN = `We reject what nearly succeeds. Every residence that crosses this threshold has been studied, measured and fully understood. Good is the enemy of extraordinary.

The Costa del Sol holds treasures that never reach the window. This is The Edit: silent access to what most will never see.`;

const BODY_TEXT_FR = `Nous rejetons ce qui frôle l'excellence. Chaque résidence qui franchit ce seuil a été contemplée, mesurée et pleinement comprise. Le bon est l'ennemi de l'extraordinaire.

La Costa del Sol garde des trésors qui n'apparaissent jamais en vitrine. Voici The Edit: l'accès silencieux à ce que la plupart ne verra jamais.`;

const BODY_TEXT_RU = `Мы отвергаем то, что лишь приближается к совершенству. Каждая резиденция, переступающая этот порог, была изучена, измерена и полностью понята. Хорошее — враг исключительного.

Коста-дель-Соль хранит сокровища, которые никогда не появляются в витринах. Это The Edit: безмолвный доступ к тому, что большинство никогда не увидит.`;

const TEXTS: Record<string, string> = { es: BODY_TEXT_ES, en: BODY_TEXT_EN, fr: BODY_TEXT_FR, ru: BODY_TEXT_RU };

const ORB_DEFS = [
  { fx: 0.75, fy: 0.35, r: 65,  vx: 18,  vy: 12,  color: [201, 169, 110] as [number,number,number] },
  { fx: 0.2,  fy: 0.6,  r: 50,  vx: -14, vy: 20,  color: [201, 169, 110] as [number,number,number] },
  { fx: 0.55, fy: 0.75, r: 45,  vx: 10,  vy: -16, color: [255, 255, 255] as [number,number,number] },
];

type Orb = { x: number; y: number; r: number; vx: number; vy: number; paused: boolean };
type Interval = { left: number; right: number };
type Line = { x: number; y: number; text: string };

const MIN_SLOT = 60;

function circleInterval(cx: number, cy: number, r: number, top: number, bottom: number, pad: number): Interval | null {
  if (top >= cy + r || bottom <= cy - r) return null;
  const midY = Math.max(top, Math.min(bottom, cy));
  const dy = Math.abs(cy - midY);
  if (dy >= r) return null;
  const dx = Math.sqrt(r * r - dy * dy);
  return { left: cx - dx - pad, right: cx + dx + pad };
}

function carveSlots(base: Interval, blocked: Interval[]): Interval[] {
  let slots = [base];
  for (const b of blocked) {
    const next: Interval[] = [];
    for (const s of slots) {
      if (b.right <= s.left || b.left >= s.right) { next.push(s); continue; }
      if (b.left > s.left) next.push({ left: s.left, right: b.left });
      if (b.right < s.right) next.push({ left: b.right, right: s.right });
    }
    slots = next;
  }
  return slots.filter(s => s.right - s.left >= MIN_SLOT);
}

interface Props { locale: string; }

export default function ManifestoEngine({ locale }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const text = TEXTS[locale] || BODY_TEXT_ES;
    const BODY_FONT = `300 clamp(14px,1.4vw,18px) 'Cormorant Garamond', serif`;
    const LINE_H = 28;
    const PAD = 8;

    // Preparar texto
    let prepared: ReturnType<typeof prepareWithSegments> | null = null;
    try {
      prepared = prepareWithSegments(text, `300 16px 'Cormorant Garamond', serif`);
    } catch { return; }

    // Estado orbes
    const orbs: Orb[] = ORB_DEFS.map(d => ({
      x: d.fx * stage.offsetWidth,
      y: d.fy * stage.offsetHeight,
      r: d.r, vx: d.vx, vy: d.vy, paused: false,
    }));

    // Crear elementos orbe
    const orbEls = ORB_DEFS.map((d, i) => {
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;transition:opacity .3s;`;
      el.style.background = `radial-gradient(circle at 35% 35%, rgba(${d.color.join(",")},0.5), rgba(${d.color.join(",")},0.2) 55%, transparent 72%)`;
      el.style.boxShadow = `0 0 60px 20px rgba(${d.color.join(",")},0.35)`;
      stage!.appendChild(el);
      return el;
    });

    // Pool de líneas de texto
    const linePool: HTMLSpanElement[] = [];
    function getLine(index: number): HTMLSpanElement {
      if (!linePool[index]) {
        const el = document.createElement("span");
        el.style.cssText = `position:absolute;white-space:nowrap;font:${BODY_FONT};color:rgba(255,255,255,0.85);line-height:${LINE_H}px;`;
        stage!.appendChild(el);
        linePool.push(el);
      }
      return linePool[index]!;
    }

    // Eyebrow
    const eyebrow = document.createElement("p");
    eyebrow.style.cssText = `position:absolute;top:${PAD*3}px;left:50%;transform:translateX(-50%);font-family:'Montserrat',sans-serif;font-size:0.45rem;color:rgba(201,169,110,0.6);letter-spacing:0.6em;text-transform:uppercase;margin:0;white-space:nowrap;`;
    eyebrow.textContent = "THE EDIT";
    stage.appendChild(eyebrow);

    let lastTime: number | null = null;
    let activeLines = 0;

    function render(now: number) {
      const dt = Math.min((now - (lastTime ?? now)) / 1000, 0.05);
      lastTime = now;
      const W = stage!.offsetWidth;
      const H = stage!.offsetHeight;

      // Mover orbes
      for (const orb of orbs) {
        if (orb.paused) continue;
        orb.x += orb.vx * dt;
        orb.y += orb.vy * dt;
        if (orb.x - orb.r < 0) { orb.x = orb.r; orb.vx = Math.abs(orb.vx); }
        if (orb.x + orb.r > W) { orb.x = W - orb.r; orb.vx = -Math.abs(orb.vx); }
        if (orb.y - orb.r < 0) { orb.y = orb.r; orb.vy = Math.abs(orb.vy); }
        if (orb.y + orb.r > H) { orb.y = H - orb.r; orb.vy = -Math.abs(orb.vy); }
      }

      // Layout texto
      const topY = PAD * 4;
      const lines: Line[] = [];
      let lineY = topY;

      // Reset cursor
      let cursor: any = prepareWithSegments ? { segmentIndex: 0, graphemeIndex: 0 } : { segmentIndex: 0, graphemeIndex: 0 };
      let exhausted = false;

      while (lineY + LINE_H <= H - PAD * 2 && !exhausted) {
        const blocked: Interval[] = [];
        for (const orb of orbs) {
          const iv = circleInterval(orb.x, orb.y, orb.r, lineY, lineY + LINE_H, 12);
          if (iv) blocked.push(iv);
        }
        const slots = carveSlots({ left: PAD * 2, right: W - PAD * 2 }, blocked);

        if (slots.length === 0) { lineY += LINE_H; continue; }

        for (const slot of slots.sort((a, b) => a.left - b.left)) {
          const slotW = slot.right - slot.left;
          try {
            const line = layoutNextLine(prepared!, cursor, slotW);
            if (!line) { exhausted = true; break; }
            lines.push({ x: slot.left, y: lineY, text: line.text });
            cursor = line.end;
          } catch { exhausted = true; break; }
        }
        lineY += LINE_H;
      }

      // Render líneas
      for (let i = 0; i < lines.length; i++) {
        const el = getLine(i);
        el.style.display = "";
        el.style.left = `${lines[i]!.x}px`;
        el.style.top = `${lines[i]!.y}px`;
        el.textContent = lines[i]!.text;
      }
      for (let i = lines.length; i < linePool.length; i++) {
        linePool[i]!.style.display = "none";
      }
      activeLines = lines.length;

      // Render orbes
      orbEls.forEach((el, i) => {
        const orb = orbs[i]!;
        el.style.left = `${orb.x - orb.r}px`;
        el.style.top = `${orb.y - orb.r}px`;
        el.style.width = `${orb.r * 2}px`;
        el.style.height = `${orb.r * 2}px`;
      });

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    // Drag orbes
    let drag: { i: number; ox: number; oy: number; px: number; py: number } | null = null;
    const onDown = (e: PointerEvent) => {
      const rect = stage!.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      for (let i = orbs.length - 1; i >= 0; i--) {
        const o = orbs[i]!;
        if ((px - o.x) ** 2 + (py - o.y) ** 2 <= o.r ** 2) {
          drag = { i, ox: o.x, oy: o.y, px, py };
          e.preventDefault();
          return;
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const rect = stage!.getBoundingClientRect();
      orbs[drag.i]!.x = drag.ox + (e.clientX - rect.left - drag.px);
      orbs[drag.i]!.y = drag.oy + (e.clientY - rect.top - drag.py);
    };
    const onUp = () => { drag = null; };
    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      stage.innerHTML = "";
    };
  }, [locale]);

  return (
    <div
      ref={stageRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: "default",
      }}
    />
  );
}
