"use client";

export default function ScrollIndicator() {
  return (
    <>
      <style>{`
        @keyframes neonBreath {
          0%   { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(255,255,255,0.3); }
          50%  { height: 3.5rem; opacity: 1;   box-shadow: 0 0 12px 3px rgba(255,255,255,0.9), 0 0 24px 6px rgba(255,255,255,0.3); }
          100% { height: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(255,255,255,0.3); }
        }
        @keyframes textFade {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.7; }
        }
        .neon-line { animation: neonBreath 2.4s ease-in-out infinite; }
        .scroll-label { animation: textFade 2.4s ease-in-out infinite; }
      `}</style>
      <div style={{
        position: "fixed", bottom: "2rem", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "0.7rem", zIndex: 200, pointerEvents: "none",
      }}>
        <span className="scroll-label" style={{
          color: "white", fontSize: "0.4rem",
          letterSpacing: "0.5em", fontFamily: "Georgia, serif",
          textTransform: "uppercase",
        }}>DISCOVER</span>
        <div className="neon-line" style={{ width: "1px", background: "white", borderRadius: "1px" }} />
      </div>
    </>
  );
}
