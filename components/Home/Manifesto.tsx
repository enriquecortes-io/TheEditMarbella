"use client";
import { forwardRef } from "react";
import ManifestoEngine from "./ManifestoEngine";
import { ManifestoShader } from "./ManifestoShader";

interface Props { locale: string; }

const Manifesto = forwardRef<HTMLDivElement, Props>(({ locale }, ref) => {
  return (
    <div ref={ref} style={{
      position:"absolute", inset:0, zIndex:12,
      opacity:0, pointerEvents:"none",
      display:"flex", alignItems:"center", justifyContent:"center",
      willChange:"opacity",
    }}>
      {/* Panel de cristal con shader */}
      <div style={{
        position:"relative",
        width:"100%", maxWidth:"920px",
        minHeight:"60vh",
        background:"rgba(4,3,2,0.55)",
        backdropFilter:"blur(24px)",
        WebkitBackdropFilter:"blur(24px)",
        border:"1px solid rgba(201,169,110,0.12)",
        boxShadow:"0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
        overflow:"hidden",
        boxSizing:"border-box",
      }}>
        <ManifestoShader />
        <ManifestoEngine locale={locale} />
      </div>
    </div>
  );
});

Manifesto.displayName = "Manifesto";
export default Manifesto;
