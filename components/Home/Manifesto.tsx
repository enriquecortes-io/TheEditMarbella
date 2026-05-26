"use client";
import { forwardRef, useEffect, useRef } from "react";
import { getT } from "@/lib/i18n";

interface Props { locale: string; }

const Manifesto = forwardRef<HTMLDivElement, Props>(({ locale }, ref) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const t = getT(locale);
  const m = (t.manifesto as any) || {};

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const ORB_DEFS = [
      { fx: 0.78, fy: 0.3,  r: 90, vx: 18, vy: 12 },
      { fx: 0.18, fy: 0.65, r: 70, vx: -14, vy: 20 },
    ];

    type Orb = { x: number; y: number; r: number; vx: number; vy: number };
    const orbs: Orb[] = ORB_DEFS.map(d => ({
      x: d.fx * container.offsetWidth,
      y: d.fy * container.offsetHeight,
      r: d.r, vx: d.vx, vy: d.vy,
    }));

    const orbEls = orbs.map((_, i) => {
      const el = document.createElement("div");
      el.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        background:radial-gradient(circle at 40% 35%, rgba(255,255,255,0.08), rgba(180,180,200,0.04) 50%, transparent 70%);
        box-shadow:inset 0 0 30px rgba(255,255,255,0.05), 0 0 40px 10px rgba(100,120,180,0.12), 0 8px 32px rgba(0,0,0,0.4);
        border:1px solid rgba(255,255,255,0.08);
        backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px);
      `;
      container.appendChild(el);
      return el;
    });

    let raf: number;
    let last: number | null = null;

    function render(now: number) {
      const dt = Math.min((now - (last ?? now)) / 1000, 0.05);
      last = now;
      const W = container!.offsetWidth;
      const H = container!.offsetHeight;

      for (const orb of orbs) {
        orb.x += orb.vx * dt;
        orb.y += orb.vy * dt;
        if (orb.x - orb.r < 0)  { orb.x = orb.r;  orb.vx = Math.abs(orb.vx); }
        if (orb.x + orb.r > W)  { orb.x = W - orb.r; orb.vx = -Math.abs(orb.vx); }
        if (orb.y - orb.r < 0)  { orb.y = orb.r;  orb.vy = Math.abs(orb.vy); }
        if (orb.y + orb.r > H)  { orb.y = H - orb.r; orb.vy = -Math.abs(orb.vy); }
      }

      orbEls.forEach((el, i) => {
        const o = orbs[i]!;
        el.style.left   = `${o.x - o.r}px`;
        el.style.top    = `${o.y - o.r}px`;
        el.style.width  = `${o.r * 2}px`;
        el.style.height = `${o.r * 2}px`;
      });

      raf = requestAnimationFrame(render);
    }

    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); container.innerHTML = ""; };
  }, []);

  return (
    <div ref={ref} style={{
      position:"absolute", inset:0, zIndex:12,
      opacity:0, pointerEvents:"none",
      display:"flex", alignItems:"center", justifyContent:"center",
      willChange:"opacity",
    }}>
      {/* Orbes de cristal animados */}
      <div ref={canvasRef} style={{ position:"absolute", inset:0, zIndex:0 }} />

      {/* Panel de texto */}
      <div style={{
        position:"relative", zIndex:1,
        width:"100%", maxWidth:"900px",
        padding:"clamp(3rem,7vw,6rem) clamp(1.5rem,4vw,3rem)",
        boxSizing:"border-box",
      }}>
        <p style={{
          fontFamily:"'Montserrat',sans-serif",
          fontSize:"0.45rem",
          color:"rgba(201,169,110,0.6)",
          letterSpacing:"0.6em",
          textTransform:"uppercase",
          textAlign:"center",
          margin:"0 0 2rem",
        }}>THE EDIT</p>

        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:"clamp(1.5rem,3vw,3rem)",
        }}>
          <p style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(1rem,1.3vw,1.2rem)",
            color:"rgba(255,255,255,0.85)",
            lineHeight:1.75,
            margin:0,
          }}>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.5rem,5vw,4rem)", fontWeight:700, color:"#c9a96e", float:"left", lineHeight:0.8, marginRight:"0.1em", marginTop:"0.05em" }}>
              {(m.paragraph1 || "")[0] || "R"}
            </span>
            {(m.paragraph1 || "Rechazamos lo que casi lo logra. Cada residencia que cruza este umbral ha sido contemplada, medida y comprendida en su totalidad. Lo bueno es enemigo de lo extraordinario.").slice(1)}
          </p>
          <p style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(1rem,1.3vw,1.2rem)",
            color:"rgba(255,255,255,0.85)",
            lineHeight:1.75,
            margin:0,
          }}>
            {m.paragraph2 || "La Costa del Sol guarda tesoros que nunca aparecen en escaparates. Esto es The Edit: el acceso silencioso a lo que la mayoría jamás verá."}
          </p>
        </div>
      </div>
    </div>
  );
});

Manifesto.displayName = "Manifesto";
export default Manifesto;
