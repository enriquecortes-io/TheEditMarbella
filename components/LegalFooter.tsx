"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LegalFooter() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";

  // No mostrar en admin
  if (pathname.includes("/admin")) return null;

  return (
    <div style={{
      position:"fixed", bottom:"0.8rem", left:"50%",
      transform:"translateX(-50%)",
      zIndex:30,
      display:"flex", gap:"1.5rem", alignItems:"center",
    }}>
      {[
        { href:`/${locale}/legal`, label:"Aviso Legal" },
        { href:`/${locale}/privacidad`, label:"Privacidad" },
        { href:`/${locale}/cookies`, label:"Cookies" },
      ].map(({ href, label }) => (
        <Link key={href} href={href} style={{
          fontFamily:"'Montserrat',sans-serif",
          fontSize:"0.4rem", fontWeight:300,
          color:"rgba(255,255,255,0.25)",
          letterSpacing:"0.3em", textTransform:"uppercase",
          textDecoration:"none",
          transition:"color 0.3s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.color="rgba(201,169,110,0.6)";}}
        onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.25)";}}>
          {label}
        </Link>
      ))}
    </div>
  );
}
