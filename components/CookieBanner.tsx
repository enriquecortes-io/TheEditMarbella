"use client";
import NeonButton from "@/components/ui/NeonButton";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";

  useEffect(() => {
    const consent = localStorage.getItem("mdlm_cookie_consent");
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("mdlm_cookie_consent", "accepted");
    setShow(false);
  };

  const reject = () => {
    localStorage.setItem("mdlm_cookie_consent", "rejected");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0,
      zIndex:9999,
      background:"rgba(8,6,4,0.97)",
      backdropFilter:"blur(20px)",
      borderTop:"1px solid rgba(201,169,110,0.2)",
      padding:"1.5rem clamp(1.5rem,5vw,4rem)",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      flexWrap:"wrap", gap:"1rem",
    }}>
      <p style={{
        fontFamily:"'Montserrat',sans-serif",
        fontSize:"0.75rem", fontWeight:200,
        color:"rgba(255,255,255,0.6)",
        margin:0, lineHeight:1.7,
        flex:1, minWidth:"200px",
      }}>
        Usamos cookies técnicas para el funcionamiento del sitio.{" "}
        <Link href={`/${locale}/cookies`} style={{ color:"#c9a96e", textDecoration:"none" }}>
          Política de cookies
        </Link>
        {" · "}
        <Link href={`/${locale}/privacidad`} style={{ color:"#c9a96e", textDecoration:"none" }}>
          Privacidad
        </Link>
      </p>
      <div style={{ display:"flex", gap:"0.75rem" }}>
        <button onClick={reject} style={{
          background:"none", border:"1px solid rgba(255,255,255,0.15)",
          color:"rgba(255,255,255,0.4)", fontFamily:"'Montserrat',sans-serif",
          fontSize:"0.5rem", letterSpacing:"0.3em", textTransform:"uppercase",
          padding:"0.6rem 1.2rem", cursor:"pointer",
        }}>Rechazar</button>
        <button onClick={accept} style={{
          background:"none", border:"1px solid rgba(201,169,110,0.5)",
          color:"#c9a96e", fontFamily:"'Montserrat',sans-serif",
          fontSize:"0.5rem", letterSpacing:"0.3em", textTransform:"uppercase",
          padding:"0.6rem 1.5rem", cursor:"pointer",
        }}>Aceptar</button>
      </div>
    </div>
  );
}
