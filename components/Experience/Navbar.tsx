"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const PRIVATE_VIEWING = {
  es: "Visita Privada",
  en: "Private Viewing",
  fr: "Visite Privée",
  ru: "Частный Просмотр",
} as const;

const LANGS = [
  { code: "es", label: "ES", name: "Español" },
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "ru", label: "RU", name: "Русский" },
];

interface Props { locale?: string; onPrivateAccess?: () => void; }

export default function Navbar({ locale = "es", onPrivateAccess }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    setOpen(false);
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    router.refresh();
  };

  const current = LANGS.find(l => l.code === locale) || LANGS[0];

  return (
    <>
      <style>{`
        @keyframes dropIn {
          0%  { opacity:0; transform:translateY(-8px); }
          100%{ opacity:1; transform:translateY(0); }
        }
        .lang-dropdown { animation: dropIn 0.25s cubic-bezier(0.16,1,0.3,1) both; }
        .lang-opt { transition: all 0.2s ease; }
        .lang-opt:hover { background: rgba(201,169,110,0.1) !important; color: #c9a96e !important; }
      `}</style>

      <nav style={{
        position:"fixed", top:0, left:0, right:0,
        height:"4rem",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 2rem",
        zIndex:1000,
        background:"rgba(0,0,0,0.3)",
        backdropFilter:"blur(12px)",
        WebkitBackdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(255,255,255,0.05)",
      }}>

        {/* Logo THE EDIT MARBELLA */}
        <Link href={`/${locale}`} style={{ textDecoration:"none" }}>
          <div style={{ width:"clamp(60px,8vw,100px)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="100%" height="100%">
              <defs>
                <linearGradient id="brushedChampagne" x1="0%" y1="0%" x2="100%" y2="80%">
                  <stop offset="0%" stopColor="#DCD0C0"/>
                  <stop offset="25%" stopColor="#C2AD8A"/>
                  <stop offset="50%" stopColor="#D4C1A0"/>
                  <stop offset="75%" stopColor="#B8A380"/>
                  <stop offset="100%" stopColor="#A59170"/>
                </linearGradient>
              </defs>
              <g transform="translate(0, -30)">
                <path d="M 630 120 L 970 120 L 970 140 L 900 140 L 900 290 L 950 290 L 950 310 L 900 310 L 900 460 L 970 460 L 970 480 L 860 480 L 860 200 A 60 60 0 0 0 740 200 L 740 480 L 700 480 L 700 140 L 630 140 Z" fill="url(#brushedChampagne)"/>
                <text x="810" y="630"
                  fontFamily="'Didot','Playfair Display','Bodoni MT',serif"
                  fontSize="42" fill="#F5F5F5"
                  style={{letterSpacing:"0.55em"}}
                  textAnchor="middle">THE EDIT</text>
                <text x="814" y="690"
                  fontFamily="'Montserrat','Helvetica Neue','Arial',sans-serif"
                  fontSize="13" fill="#A89F91"
                  style={{letterSpacing:"1.3em"}}
                  fontWeight="300"
                  textAnchor="middle">MARBELLA</text>
              </g>
            </svg>
          </div>
        </Link>

        {/* Private Access — solo si hay callback */}
        {onPrivateAccess && (
          <button
            onClick={onPrivateAccess}
            style={{
              background:"none",
              border:"1px solid rgba(201,169,110,0.35)",
              color:"rgba(201,169,110,0.7)",
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.6rem", letterSpacing:"0.3em",
              textTransform:"uppercase", cursor:"pointer",
              transition:"all 0.3s ease",
              padding:"0.5rem 1.2rem",
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.color="#c9a96e";
              e.currentTarget.style.borderColor="rgba(201,169,110,0.7)";
              e.currentTarget.style.background="rgba(201,169,110,0.08)";
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.color="rgba(201,169,110,0.7)";
              e.currentTarget.style.borderColor="rgba(201,169,110,0.35)";
              e.currentTarget.style.background="none";
            }}
          >
            ✦ {PRIVATE_VIEWING[locale as keyof typeof PRIVATE_VIEWING] || "Private Viewing"}
          </button>
        )}

        {/* Selector de idioma desplegable */}
        <div style={{ position:"relative" }}>
          <button
            onClick={() => setOpen(p => !p)}
            style={{
              background:"none",
              border:`1px solid rgba(255,255,255,${open?0.2:0.1})`,
              color:"rgba(255,255,255,0.7)",
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.55rem",
              fontWeight:300,
              letterSpacing:"0.35em",
              textTransform:"uppercase",
              padding:"0.5rem 1.2rem",
              cursor:"pointer",
              display:"flex", alignItems:"center", gap:"0.6rem",
              transition:"all 0.2s ease",
            }}
          >
            {current.label}
            <span style={{
              fontSize:"0.4rem",
              opacity:0.5,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition:"transform 0.25s ease",
              display:"inline-block",
            }}>▼</span>
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="lang-dropdown"
              style={{
                position:"absolute", top:"calc(100% + 0.5rem)", right:0,
                background:"rgba(8,6,4,0.95)",
                backdropFilter:"blur(20px)",
                WebkitBackdropFilter:"blur(20px)",
                border:"1px solid rgba(255,255,255,0.08)",
                minWidth:"10rem",
                overflow:"hidden",
              }}
            >
              {LANGS.map((lang, i) => (
                <button
                  key={lang.code}
                  className="lang-opt"
                  onClick={() => switchLocale(lang.code)}
                  style={{
                    width:"100%", textAlign:"left",
                    background: lang.code === locale ? "rgba(201,169,110,0.08)" : "transparent",
                    border:"none",
                    borderBottom: i < LANGS.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    padding:"0.9rem 1.4rem",
                    cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    gap:"1rem",
                  }}
                >
                  <span style={{
                    fontFamily:"'Helvetica Neue',sans-serif",
                    fontSize:"0.55rem", fontWeight:300,
                    color: lang.code === locale ? "#c9a96e" : "rgba(255,255,255,0.5)",
                    letterSpacing:"0.3em", textTransform:"uppercase",
                  }}>{lang.label}</span>
                  <span style={{
                    fontFamily:"'Helvetica Neue',sans-serif",
                    fontSize:"0.45rem", fontWeight:200,
                    color: lang.code === locale ? "rgba(201,169,110,0.6)" : "rgba(255,255,255,0.2)",
                    letterSpacing:"0.1em",
                  }}>{lang.name}</span>
                  {lang.code === locale && (
                    <span style={{ color:"#c9a96e", fontSize:"0.5rem" }}>✦</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Cerrar dropdown al click fuera */}
      {open && (
        <div
          style={{ position:"fixed", inset:0, zIndex:999 }}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
