"use client";
import { forwardRef } from "react";
import { getT } from "@/lib/i18n";

interface Props { locale: string; }

const Manifesto = forwardRef<HTMLDivElement, Props>(({ locale }, ref) => {
  const t = getT(locale) as any;
  const m = t.manifesto || {};

  return (
    <div ref={ref} style={{
      position:"absolute", inset:0, zIndex:22,
      opacity:0, pointerEvents:"none",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"clamp(2rem,5vw,4rem)",
      willChange:"opacity, transform",
    }}>
      <style>{`
        .manifesto-columns {
          columns: 2;
          column-gap: clamp(2rem, 4vw, 4rem);
          column-rule: 1px solid rgba(201,169,110,0.15);
        }
        .manifesto-columns p { break-inside: avoid; margin: 0 0 1rem; }
        .manifesto-columns p:first-child::first-letter {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: 4.5rem;
          color: #c9a96e;
          float: left;
          line-height: 0.85;
          margin-right: 0.08em;
          margin-top: 0.08em;
        }
        @media (max-width: 768px) {
          .manifesto-columns { columns: 1; }
          .manifesto-columns p:first-child::first-letter { font-size: 3.2rem; }
        }
        @keyframes neonBreathGold {
          0%   { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(201,169,110,0.3); }
          50%  { height: 3.5rem; opacity: 1;   box-shadow: 0 0 12px 3px rgba(201,169,110,0.9), 0 0 24px 6px rgba(201,169,110,0.3); }
          100% { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(201,169,110,0.3); }
        }
        .neon-manifesto { animation: neonBreathGold 2.4s ease-in-out infinite; }
      `}</style>

      <div style={{
        width:"100%", maxWidth:"1100px",
        background:"rgba(6,4,2,0.55)",
        border:"1px solid rgba(201,169,110,0.18)",
        backdropFilter:"blur(40px)",
        boxShadow:"0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.6)",
        padding:"clamp(2rem,5vw,4.5rem)",
        position:"relative",
        boxSizing:"border-box",
      }}>
        {/* Línea dorada superior */}
        <div style={{ position:"absolute", top:0, left:"15%", right:"15%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(201,169,110,0.8),transparent)" }}/>

        <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", color:"rgba(201,169,110,0.9)", letterSpacing:"0.5em", textTransform:"uppercase", textAlign:"center", margin:"0 0 1rem" }}>{m.subtitle}</p>

        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.5rem,5vw,4.5rem)", fontWeight:600, color:"white", textAlign:"center", margin:"0 0 0.5rem", lineHeight:1, fontStyle:"italic" }}>{m.title}</h2>

        <div style={{ width:"3rem", height:"1px", background:"rgba(201,169,110,0.5)", margin:"1.5rem auto 2.5rem" }}/>

        <div className="manifesto-columns" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.1rem,1.4vw,1.35rem)", lineHeight:1.75, color:"rgba(255,255,255,0.82)", fontWeight:300 }}>
          <p>{m.paragraph1}</p>
          <p>{m.paragraph2}</p>
        </div>

        {/* Línea dorada inferior */}
        <div style={{ position:"absolute", bottom:0, left:"15%", right:"15%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(201,169,110,0.4),transparent)" }}/>

        {/* Indicador discover — borde derecho */}
        <div style={{ position:"absolute", top:"50%", right:"-0.5rem", transform:"translateY(-50%)", display:"flex", flexDirection:"column", alignItems:"center", zIndex:10, pointerEvents:"none" }}>
          <div className="neon-manifesto" style={{ width:"1px", background:"#c9a96e", borderRadius:"1px" }}/>
        </div>
      </div>
    </div>
  );
});

Manifesto.displayName = "Manifesto";
export default Manifesto;
