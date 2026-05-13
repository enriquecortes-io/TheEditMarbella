"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getT } from "@/lib/i18n";

interface Props { locale: string; }

const SCENES = [
  {
    video: "/videos/12084811-hd_1920_1080_60fps.mp4",
    word: "LIVE",
    phrase: "beyond the horizon",
    align: "left",
  },
  {
    video: "/videos/14209280_1920_1080_24fps.mp4",
    word: "SPEED",
    phrase: "is a state of mind",
    align: "right",
  },
  {
    video: "/videos/6474953-hd_1080_2048_25fps.mp4",
    word: "TASTE",
    phrase: "the extraordinary",
    align: "center",
  },
  {
    video: "/videos/19892911-hd_1920_1080_60fps.mp4",
    word: "MASTER",
    phrase: "every detail",
    align: "left",
  },
];

const SCENE_DURATION = 5000; // ms por escena

export default function SkyHeader({ locale }: Props) {
  const pathname = usePathname();
  const urlLocale = pathname.split("/")[1] || locale;
  const t = getT(urlLocale);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setSceneIdx(p => (p + 1) % SCENES.length);
        setAnimKey(p => p + 1);
        setTransitioning(false);
      }, 600);
    }, SCENE_DURATION);
    return () => clearInterval(timer);
  }, []);

  // Preload todos los videos
  useEffect(() => {
    videoRefs.current.forEach(v => {
      if (v) { v.muted = true; v.load(); }
    });
  }, []);

  const scene = SCENES[sceneIdx];
  const alignMap = { left:"flex-start", right:"flex-end", center:"center" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,300&family=Cormorant+Garamond:ital,wght@1,300&display=swap');

        @keyframes fadeInScene { 0%{opacity:0;} 100%{opacity:1;} }
        @keyframes fadeOutScene { 0%{opacity:1;} 100%{opacity:0;} }
        @keyframes wordIn {
          0%   { opacity:0; transform:translateY(40px) scaleY(0.8); filter:blur(10px); }
          100% { opacity:1; transform:translateY(0) scaleY(1.5);  filter:blur(0); }
        }
        @keyframes phraseIn {
          0%   { opacity:0; transform:translateX(-30px); filter:blur(6px); }
          100% { opacity:1; transform:translateX(0);     filter:blur(0); }
        }
        @keyframes lineIn {
          0%   { width:0; opacity:0; }
          100% { width:4rem; opacity:1; }
        }
        @keyframes uiFadeIn {
          0%   { opacity:0; transform:translateY(10px); }
          100% { opacity:1; transform:translateY(0); }
        }
        .scene-video {
          transition: opacity 0.6s ease;
        }
        .word-anim  { animation: wordIn  0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .phrase-anim{ animation: phraseIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .line-anim  { animation: lineIn  0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
        .ui-anim    { animation: uiFadeIn 1s cubic-bezier(0.16,1,0.3,1) 0.6s both; }

        @keyframes neonBreath {
          0%,100% { height:2rem; opacity:0.3; box-shadow:0 0 4px rgba(201,169,110,0.4); }
          50%     { height:4rem; opacity:1;   box-shadow:0 0 12px rgba(201,169,110,0.9); }
        }
        .neon-line { animation: neonBreath 2.4s ease-in-out infinite; }

        /* Barra de progreso escenas */
        @keyframes progressBar {
          0%   { width:0%; }
          100% { width:100%; }
        }
        .progress-bar {
          animation: progressBar ${SCENE_DURATION}ms linear both;
        }
      `}</style>

      {/* Videos en stack — solo el activo visible */}
      {SCENES.map((s, i) => (
        <video
          key={i}
          ref={el => { videoRefs.current[i] = el; }}
          src={s.video}
          muted playsInline autoPlay loop
          style={{
            position:"absolute", inset:0,
            width:"100%", height:"100%",
            objectFit:"cover",
            opacity: i === sceneIdx ? (transitioning ? 0 : 1) : 0,
            transition:"opacity 0.6s ease",
            zIndex:0,
          }}
        />
      ))}

      {/* Overlay oscuro para legibilidad */}
      <div style={{
        position:"absolute", inset:0, zIndex:1,
        background:"linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.85) 100%)",
      }}/>

      {/* Contenido tipográfico */}
      <div style={{
        position:"relative", zIndex:10,
        width:"100%", height:"100%",
        display:"flex", flexDirection:"column",
        justifyContent:"center",
        padding:"0 8vw",
        alignItems: alignMap[scene.align as keyof typeof alignMap] as any,
      }}>
        <div key={animKey} style={{
          display:"flex", flexDirection:"column",
          alignItems: scene.align === "right" ? "flex-end" : scene.align === "center" ? "center" : "flex-start",
        }}>

          {/* Palabra impacto — Bebas Neue */}
          <div className="word-anim" style={{
            fontFamily:"'Fraunces', serif",
            fontSize:"clamp(6rem,16vw,16rem)",
            fontWeight:900,
            fontStyle:"normal",
            color:"#ffffff",
            letterSpacing:"-0.02em",
            lineHeight:0.75,
            userSelect:"none",
            fontVariationSettings:"'opsz' 144, 'SOFT' 0, 'WONK' 0",
            transform:"scaleY(1.5)",
            display:"inline-block",
            textShadow:"0 4px 60px rgba(0,0,0,0.7)",
          }}>
            {scene.word}
          </div>

          {/* Línea dorada */}
          <div className="line-anim" style={{
            height:"1px",
            background:"linear-gradient(90deg,#c9a96e,transparent)",
            marginTop:"1rem", marginBottom:"1rem",
          }}/>

          {/* Frase — Cormorant Garamond italic */}
          <div className="phrase-anim" style={{
            fontFamily:"'Cormorant Garamond', serif",
            fontStyle:"italic",
            fontSize:"clamp(2rem,5vw,5rem)",
            fontWeight:300,
            color:"rgba(255,255,255,0.88)",
            letterSpacing:"0.04em",
            lineHeight:1.1,
            userSelect:"none",
            textShadow:"0 2px 30px rgba(0,0,0,0.7)",
          }}>
            {scene.phrase}
          </div>

        </div>
      </div>

      {/* Navbar inferior — localidades */}
      <div className="ui-anim" style={{
        position:"absolute", bottom:"5rem", left:"50%",
        transform:"translateX(-50%)", zIndex:20,
        display:"flex", alignItems:"center", gap:"1.5rem",
        flexWrap:"wrap", justifyContent:"center",
        color:"rgba(255,255,255,0.35)",
        fontFamily:"'Helvetica Neue',sans-serif",
        fontSize:"clamp(0.45rem,0.65vw,0.6rem)",
        fontWeight:400, letterSpacing:"0.35em",
        textTransform:"uppercase",
      }}>
        {t.header.locations.map((loc: string, i: number, arr: string[]) => (
          <span key={loc} style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
            {loc}{i<arr.length-1&&<span style={{color:"rgba(201,169,110,0.5)"}}>✦</span>}
          </span>
        ))}
      </div>

      {/* Scroll indicator */}
      <div style={{
        position:"absolute", bottom:"1.5rem", left:"50%",
        transform:"translateX(-50%)", zIndex:20,
        display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem",
      }}>
        <span style={{
          color:"rgba(255,255,255,0.3)", fontSize:"0.4rem",
          letterSpacing:"0.6em", fontFamily:"'Helvetica Neue',sans-serif",
          textTransform:"uppercase",
        }}>{t.header.scroll}</span>
        <div className="neon-line" style={{
          width:"1px", background:"rgba(201,169,110,0.8)",
        }}/>
      </div>

      {/* Barras de progreso escenas */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0,
        zIndex:20, display:"flex", gap:"2px", height:"2px",
      }}>
        {SCENES.map((_, i) => (
          <div key={i} style={{
            flex:1, background:"rgba(255,255,255,0.1)",
            position:"relative", overflow:"hidden",
          }}>
            {i === sceneIdx && (
              <div className="progress-bar" style={{
                position:"absolute", top:0, left:0, height:"100%",
                background:"rgba(201,169,110,0.8)",
              }}/>
            )}
            {i < sceneIdx && (
              <div style={{
                position:"absolute", top:0, left:0, right:0, height:"100%",
                background:"rgba(201,169,110,0.5)",
              }}/>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
