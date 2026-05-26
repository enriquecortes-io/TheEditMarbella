"use client";
import { forwardRef } from "react";
import ManifestoFlow from "./ManifestoFlow";

interface Props { locale: string; }

const Manifesto = forwardRef<HTMLDivElement, Props>(({ locale }, ref) => {
  return (
    <div ref={ref} style={{
      position:"absolute", inset:0, zIndex:12,
      opacity:0, pointerEvents:"none",
      willChange:"opacity",
    }}>
      <ManifestoFlow locale={locale} />
    </div>
  );
});

Manifesto.displayName = "Manifesto";
export default Manifesto;
