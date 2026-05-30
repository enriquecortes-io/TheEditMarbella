"use client";

interface Props {
  total: number;
  active: number;
}

export default function CarouselScrollIndicator({ total, active }: Props) {
  const progress = total > 1 ? active / (total - 1) : 0;

  return (
    <>
      <style>{`
        @keyframes neonBreathH {
          0%   { width: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(201,169,110,0.3); }
          50%  { width: 3.5rem; opacity: 1;   box-shadow: 0 0 12px 3px rgba(201,169,110,0.9), 0 0 24px 6px rgba(201,169,110,0.3); }
          100% { width: 1.5rem; opacity: 0.3; box-shadow: 0 0 4px 1px rgba(201,169,110,0.3); }
        }
        @keyframes textFadeH {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.7; }
        }
        .neon-line-h { animation: neonBreathH 2.4s ease-in-out infinite; }
        .swipe-label  { animation: textFadeH  2.4s ease-in-out infinite; }
      `}</style>

      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        gap:"0.6rem", width:"100%", padding:"0.5rem 1.2rem 0",
        boxSizing:"border-box",
      }}>
        {/* Track + thumb elástico */}
        <div style={{
          position:"relative", width:"100%", height:"2px",
          background:"rgba(250,248,244,0.08)", borderRadius:"1px",
        }}>
          {/* Thumb dorado — posición basada en active/total */}
          <div style={{
            position:"absolute", top:"50%",
            left:`${progress * 80}%`,           // 80% = margen para que no salga del track
            transform:"translateY(-50%)",
            height:"2px", borderRadius:"1px",
            background:"linear-gradient(90deg, rgba(201,169,110,0.4), #c9a96e, rgba(201,169,110,0.4))",
            boxShadow:"0 0 8px 2px rgba(201,169,110,0.5)",
            transition:"left 0.5s cubic-bezier(0.25,0.46,0.45,0.94), width 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
          className="neon-line-h"
          />
        </div>

        {/* Label SWIPE */}
        <span className="swipe-label" style={{
          color:"rgba(201,169,110,0.6)",
          fontSize:"0.35rem",
          letterSpacing:"0.5em",
          fontFamily:"'Montserrat',sans-serif",
          textTransform:"uppercase",
        }}>swipe</span>
      </div>
    </>
  );
}
