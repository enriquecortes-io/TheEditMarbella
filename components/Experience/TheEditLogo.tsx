"use client";

interface Props {
  width?: number;
  height?: number;
}

export default function TheEditLogo({ width = 180, height = 56 }: Props) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"2px" }}>
      <span style={{
        fontFamily:"'Cormorant Garamond', 'Didot', 'Bodoni MT', Georgia, serif",
        fontWeight:700,
        fontSize:"clamp(1.4rem,3vw,2rem)",
        color:"#111111",
        letterSpacing:"-0.02em",
        lineHeight:1,
        whiteSpace:"nowrap",
      }}>The Edit</span>
      <span style={{
        fontFamily:"'Montserrat', 'Helvetica Neue', sans-serif",
        fontWeight:300,
        fontSize:"clamp(0.45rem,0.8vw,0.55rem)",
        color:"#2D4A3E",
        letterSpacing:"0.45em",
        textTransform:"uppercase",
        whiteSpace:"nowrap",
      }}>Marbella</span>
    </div>
  );
}
