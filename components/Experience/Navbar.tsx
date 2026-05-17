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
        @keyframes neonPulse {
          0%,100% { text-shadow: 0 0 6px rgba(201,169,110,0.8), 0 0 12px rgba(201,169,110,0.5), 0 0 24px rgba(201,169,110,0.3); }
          50%     { text-shadow: 0 0 12px rgba(201,169,110,1), 0 0 24px rgba(201,169,110,0.8), 0 0 48px rgba(201,169,110,0.5), 0 0 80px rgba(201,169,110,0.2); }
        }
        .neon-btn { animation: neonPulse 2s ease-in-out infinite; }
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
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
            <span style={{
              fontFamily:"'Cormorant Garamond','Cormorant',Georgia,serif",
              fontSize:"clamp(1.4rem,2.5vw,2.2rem)",
              fontWeight:600,
              color:"white",
              letterSpacing:"0.05em",
              lineHeight:1,
            whiteSpace:"nowrap",
            }}>The Edit</span>
            <div style={{ display:"flex", alignItems:"center", gap:"0", width:"100%" }}>
              <div style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.4)" }}/>
            </div>
            <span style={{
              fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
              fontSize:"clamp(0.4rem,0.7vw,0.6rem)",
              fontWeight:200,
              color:"rgba(255,255,255,0.65)",
              letterSpacing:"0.35em",
              textTransform:"uppercase",
              lineHeight:1,
            }}>Marbella</span>
          </div>
        </Link>

        {/* Private Access — solo si hay callback */}
        {onPrivateAccess && (
          <button
            onClick={onPrivateAccess}
            style={{
              background:"none",
              border:"none",
              color:"#c9a96e",
              fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
              fontSize:"0.6rem", letterSpacing:"0.3em",
              textTransform:"uppercase", cursor:"pointer",
              transition:"all 0.3s ease",
              padding:"0.5rem 1.2rem",

            }}
            onMouseEnter={e=>{
              e.currentTarget.style.color="#c9a96e";
              e.currentTarget.style.textShadow="0 0 10px rgba(201,169,110,0.9), 0 0 20px rgba(201,169,110,0.5)";
              e.currentTarget.style.background="rgba(201,169,110,0.08)";
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.color="#c9a96e";
              e.currentTarget.style.background="none";
            }}
            className="neon-btn"
          >
            {PRIVATE_VIEWING[locale as keyof typeof PRIVATE_VIEWING] || "Private Viewing"}
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
              fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
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
                    fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
                    fontSize:"0.55rem", fontWeight:300,
                    color: lang.code === locale ? "#c9a96e" : "rgba(255,255,255,0.5)",
                    letterSpacing:"0.3em", textTransform:"uppercase",
                  }}>{lang.label}</span>
                  <span style={{
                    fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
                    fontSize:"0.45rem", fontWeight:200,
                    color: lang.code === locale ? "rgba(201,169,110,0.6)" : "rgba(255,255,255,0.2)",
                    letterSpacing:"0.1em",
                  }}>{lang.name}</span>
                  {lang.code === locale && (
                    <span style={{ color:"#c9a96e",
          textShadow:"0 0 10px rgba(201,169,110,0.9), 0 0 20px rgba(201,169,110,0.5), 0 0 40px rgba(201,169,110,0.3)", fontSize:"0.5rem" }}>✦</span>
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
