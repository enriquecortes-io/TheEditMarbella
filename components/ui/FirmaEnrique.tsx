"use client";

interface Props {
  width?: string;
  opacity?: number;
}

// La firma se renderiza con mix-blend-mode:multiply sobre fondo claro
// El fondo negro de la imagen desaparece al multiplicarse con el blanco del fondo
export default function FirmaEnrique({ width = "clamp(160px,18vw,240px)", opacity = 0.9 }: Props) {
  return (
    <div style={{ width, position:"relative", display:"inline-block" }}>
      <img
        src="/firma-enrique.jpg"
        alt="Firma Enrique Cortés"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
