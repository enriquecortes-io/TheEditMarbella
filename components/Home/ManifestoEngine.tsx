"use client";
import { useEffect, useRef } from "react";
import { prepareWithSegments, layoutNextLine } from "@chenglou/pretext";

const TEXTS: Record<string, string> = {
  es: `Rechazamos lo que casi lo logra. Cada residencia que cruza este umbral ha sido contemplada, medida y comprendida en su totalidad. Lo bueno es enemigo de lo extraordinario. La Costa del Sol guarda tesoros que nunca aparecen en escaparates. Esto es The Edit: el acceso silencioso a lo que la mayoría jamás verá.`,
  en: `We reject what nearly succeeds. Every residence that crosses this threshold has been studied, measured and fully understood. Good is the enemy of extraordinary. The Costa del Sol holds treasures that never reach the window. This is The Edit: silent access to what most will never see.`,
  fr: `Nous rejetons ce qui frôle l'excellence. Chaque résidence qui franchit ce seuil a été contemplée, mesurée et pleinement comprise. Le bon est l'ennemi de l'extraordinaire. La Costa del Sol garde des trésors qui n'apparaissent jamais en vitrine. Voici The Edit: l'accès silencieux à ce que la plupart ne verra jamais.`,
  ru: `Мы отвергаем то, что лишь приближается к совершенству. Каждая резиденция была изучена, измерена и полностью понята. Хорошее — враг исключительного. Коста-дель-Соль хранит сокровища, которые никогда не появляются в витринах. Это The Edit: безмолвный доступ к тому, что большинство никогда не увидит.`,
};

const ORB_DEFS = [
  { fx: 0.78, fy: 0.35, r: 85, vx: 18, vy: 12 },
  { fx: 0.15, fy: 0.65, r: 65, vx: -14, vy: 20 },
];

type Interval = { left: number; right: number };
type Orb = { x: number; y: number; r: number; vx: number; vy: number };

const MIN_SLOT = 80;
const LINE_H = 32;
const PAD_X = 48;
const PAD_Y = 48;
const BODY_FONT = "300 17px 'Cormorant Garamond', Georgia, serif";

function circleInterval(cx: number, cy: number, r: number, top: number, bottom: number, pad: number): Interval | null {
  if (top >= cy + r || bottom <= cy - r) return null;
  const midY = cy < top ? top : cy > bottom ? bottom : cy;
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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const text = TEXTS[locale] || TEXTS.es;
    let prepared: ReturnType<typeof prepareWithSegments>;
    try {
      prepared = prepareWithSegments(text, BODY_FONT);
    } catch { return; }

    // Orbes
    const orbs: Orb[] = ORB_DEFS.map(d => ({
      x: d.fx * stage.offsetWidth,
      y: d.fy * stage.offsetHeight,
      r: d.r, vx: d.vx, vy: d.vy,
    }));

    const orbEls = orbs.map(() => {
      const el = document.createElement("div");
      el.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        background:radial-gradient(circle at 38% 32%, rgba(255,255,255,0.12), rgba(200,210,255,0.04) 55%, transparent 75%);
        box-shadow:inset 0 0 40px rgba(255,255,255,0.06), 0 0 50px 8px rgba(120,140,220,0.1), 0 12px 40px rgba(0,0,0,0.5);
        border:1px solid rgba(255,255,255,0.1);
        backdrop-filter:blur(12px);
        -webkit-backdrop-filter:blur(12px);
      `;
      stage.appendChild(el);
      return el;
    });

    // Eyebrow
    const eyebrow = document.createElement("p");
    eyebrow.style.cssText = `position:absolute;top:24px;left:0;right:0;text-align:center;font-family:'Montserrat',sans-serif;font-size:0.45rem;color:rgba(201,169,110,0.6);letter-spacing:0.6em;text-transform:uppercase;margin:0;z-index:10;`;
    eyebrow.textContent = "THE EDIT";
    stage.appendChild(eyebrow);

    // Pool de líneas
    const linePool: HTMLSpanElement[] = [];
    function getLine(i: number): HTMLSpanElement {
      if (!linePool[i]) {
        const el = document.createElement("span");
        el.style.cssText = `position:absolute;white-space:nowrap;font:${BODY_FONT};color:rgba(255,255,255,0.85);line-height:${LINE_H}px;pointer-events:none;`;
        stage!.appendChild(el);
        linePool.push(el);
      }
      return linePool[i]!;
    }

    let raf: number;
    let last: number | null = null;

    function render(now: number) {
      const dt = Math.min((now - (last ?? now)) / 1000, 0.05);
      last = now;
      const W = stage!.offsetWidth;
      const H = stage!.offsetHeight;

      // Mover orbes
      for (const orb of orbs) {
        orb.x += orb.vx * dt;
        orb.y += orb.vy * dt;
        if (orb.x - orb.r < 0)   { orb.x = orb.r;     orb.vx =  Math.abs(orb.vx); }
        if (orb.x + orb.r > W)   { orb.x = W - orb.r; orb.vx = -Math.abs(orb.vx); }
        if (orb.y - orb.r < 0)   { orb.y = orb.r;     orb.vy =  Math.abs(orb.vy); }
        if (orb.y + orb.r > H)   { orb.y = H - orb.r; orb.vy = -Math.abs(orb.vy); }
      }

      // Actualizar orbes DOM
      orbEls.forEach((el, i) => {
        const o = orbs[i]!;
        el.style.left   = `${o.x - o.r}px`;
        el.style.top    = `${o.y - o.r}px`;
        el.style.width  = `${o.r * 2}px`;
        el.style.height = `${o.r * 2}px`;
      });

      // Layout texto con pretext
      const lines: { x: number; y: number; text: string }[] = [];
      let cursor: any = { segmentIndex: 0, graphemeIndex: 0 };
      let lineY = PAD_Y + 40;
      let exhausted = false;

      while (lineY + LINE_H <= H - PAD_Y && !exhausted) {
        const blocked: Interval[] = [];
        for (const orb of orbs) {
          const iv = circleInterval(orb.x, orb.y, orb.r, lineY, lineY + LINE_H, 16);
          if (iv) blocked.push(iv);
        }
        const slots = carveSlots({ left: PAD_X, right: W - PAD_X }, blocked);

        if (slots.length === 0) { lineY += LINE_H; continue; }

        for (const slot of slots.sort((a, b) => a.left - b.left)) {
          const slotW = slot.right - slot.left;
          try {
            const line = layoutNextLine(prepared, cursor, slotW);
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
        el.style.left    = `${lines[i]!.x}px`;
        el.style.top     = `${lines[i]!.y}px`;
        el.textContent   = lines[i]!.text;
      }
      for (let i = lines.length; i < linePool.length; i++) {
        linePool[i]!.style.display = "none";
      }

      raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);

    // Drag
    let drag: { i: number; ox: number; oy: number; px: number; py: number } | null = null;
    const onDown = (e: PointerEvent) => {
      const rect = stage!.getBoundingClientRect();
      const px = e.clientX - rect.left, py = e.clientY - rect.top;
      for (let i = orbs.length - 1; i >= 0; i--) {
        const o = orbs[i]!;
        if ((px-o.x)**2 + (py-o.y)**2 <= o.r**2) {
          drag = { i, ox: o.x, oy: o.y, px, py };
          e.preventDefault(); return;
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const rect = stage!.getBoundingClientRect();
      orbs[drag.i]!.x = drag.ox + (e.clientX - rect.left - drag.px);
      orbs[drag.i]!.y = drag.oy + (e.clientY - rect.top  - drag.py);
    };
    const onUp = () => { drag = null; };

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      cancelAnimationFrame(raf);
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
        position:"relative",
        width:"100%",
        minHeight:"60vh",
        overflow:"hidden",
      }}
    />
  );
}
