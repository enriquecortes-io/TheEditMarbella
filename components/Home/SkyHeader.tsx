"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getT } from "@/lib/i18n";

interface Props { locale: string; }

// Scenes con posición — word y phrase vienen de las traducciones
const SCENE_CONFIG = [
  { start:0,  end:5,  align:"left",   pos:"65% top" },
  { start:5,  end:10, align:"right",  pos:"center top" },
  { start:10, end:15, align:"center", pos:"center top" },
  { start:15, end:20, align:"left",   pos:"center top" },
  { start:20, end:25, align:"right",  pos:"center top" },
  { start:25, end:30, align:"center", pos:"center center" },
];

export default function SkyHeader({ locale }: Props) {
  const pathname = usePathname();
  const urlLocale = pathname.split("/")[1] || locale;
  const t = getT(urlLocale);
  const scenes = (t.header as any).scenes as Array<{word:string;phrase:string}> || [];
  const SCENES = SCENE_CONFIG.map((s,i) => ({...s, word:scenes[i]?.word||"", phrase:scenes[i]?.phrase||""}));
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
    video.addEventListener("canplay", () => setVideoReady(true));

    const handleTime = () => {
      const ct = video.currentTime;
      const idx = SCENES.findIndex(s => ct >= s.start && ct < s.end);
      if (idx !== -1 && idx !== sceneIdx) {
        setSceneIdx(idx);
        setAnimKey(p => p + 1);
      }
    };

    video.addEventListener("timeupdate", handleTime);
    return () => video.removeEventListener("timeupdate", handleTime);
  }, [sceneIdx]);

  const scene = SCENES[sceneIdx];
  const alignMap = { left:"flex-start", right:"flex-end", center:"center" };

  return (
    <>
      <style>{`

        @keyframes wordIn {
          0%   { opacity:0; transform:translateY(40px) scaleY(0.8); filter:blur(10px); }
          100% { opacity:1; transform:translateY(0) scaleY(1.5); filter:blur(0); }
        }
        @keyframes phraseIn {
          0%   { opacity:0; transform:translateX(-20px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes uiFadeIn {
          0%   { opacity:0; transform:translateY(10px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes neonBreath {
          0%,100% { height:2rem; opacity:0.3; box-shadow:0 0 4px rgba(201,169,110,0.4); }
          50%     { height:4rem; opacity:1;   box-shadow:0 0 12px rgba(201,169,110,0.9); }
        }
        @keyframes progressBar {
          0%   { width:0%; }
          100% { width:100%; }
        }
        .word-anim   { animation: wordIn   0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .phrase-anim { animation: phraseIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both; }
        .ui-anim     { animation: uiFadeIn 1s  cubic-bezier(0.16,1,0.3,1) 0.6s both; }
        .neon-line   { animation: neonBreath 2.4s ease-in-out infinite; }
        .progress-bar { animation: progressBar 5s linear both; }
      `}</style>

      {/* Fondo fallback — visible hasta que carga el video */}
      <div style={{
        position:"absolute", inset:0, zIndex:0,
        background:"linear-gradient(135deg, #0a0a0f 0%, #0f0a08 50%, #080a0f 100%)",
        opacity: videoReady ? 0 : 1,
        transition:"opacity 0.4s ease",
        pointerEvents:"none",
      }}/>

      {/* Video único */}
      <video
        ref={videoRef}
        src="/videos/HeroHeader.mp4"
        poster="/videos/hero-poster.jpg"
        muted playsInline loop autoPlay
        preload="metadata"
        onCanPlay={()=>setVideoReady(true)}
        style={{
          position:"absolute", inset:0,
          width:"100%", height:"100%",
          objectFit:"cover",
          objectPosition:scene.pos,
          zIndex:0,
        }}
      />

      {/* Overlay */}
      <div style={{
        position:"absolute", inset:0, zIndex:1,
        background:"linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.88) 100%)",
      }}/>

      {/* Tipografía */}
      <div style={{
        position:"relative", zIndex:10,
        width:"100%", height:"100%",
        display:"flex", flexDirection:"column",
        justifyContent:"center",
        paddingLeft: scene.word.length > 7 ? "5vw" : scene.align === "left" ? "clamp(1.5rem,8vw,12vw)" : scene.align === "center" ? "clamp(1.5rem,8vw,12vw)" : "0",
        paddingRight: scene.word.length > 7 ? "5vw" : scene.align === "right" ? "clamp(1.5rem,8vw,12vw)" : scene.align === "center" ? "clamp(1.5rem,8vw,12vw)" : "0",
        alignItems: alignMap[scene.align as keyof typeof alignMap] as any,
      }}>
        <div key={animKey} style={{
          display:"flex", flexDirection:"column",
          alignItems: scene.word.length > 7 ? "center" : scene.align === "right" ? "flex-end" : scene.align === "center" ? "center" : "flex-start",
          maxWidth:"90vw",
        }}>
          {/* Partir en 2 líneas si la palabra es larga en mobile */}
          <div className="word-anim" style={{
            fontFamily:"'Cormorant Garamond','Cormorant',serif",
            fontSize:"clamp(6rem,16vw,16rem)",
            fontWeight:900,
            color:"#ffffff",
            letterSpacing:"-0.02em",
            lineHeight:0.75,
            userSelect:"none",
            display:"inline-block",
            textShadow:"0 4px 60px rgba(0,0,0,0.7)",

          }}>
            {(()=>{
              const breaks: Record<string,string[]> = {
                "CONDUCE":  ["CON","DUCE"],
                "MARBELLA": ["MAR","BELLA"],
                "POSSÉDER": ["POS","SÉDER"],
                "CONDUIRE": ["CON","DUIRE"],
                "УЖИНАЙ":   ["УЖИ","НАЙ"],
                "ВЛАДЕЙ":   ["ВЛА","ДЕЙ"],
              };
              const parts = breaks[scene.word];
              if (parts) return <>{parts.map((p,i)=><span key={i} style={{display:"block"}}>{p}</span>)}</>;
              return <>{scene.word}</>;
            })()}
          </div>

          <div className="phrase-anim" style={{
            fontFamily:"'Montserrat', sans-serif",
            fontStyle:"normal",
            fontSize:"clamp(0.65rem,1.8vw,2rem)",
            fontWeight:200,
            color:"rgba(255,255,255,0.75)",
            letterSpacing:"0.25em",
            lineHeight:1.2,
            textTransform:"uppercase",
            userSelect:"none",
            textShadow:"0 2px 20px rgba(0,0,0,0.6)",
            marginTop:"3.5rem",
            textAlign: scene.align === "center" ? "center" : scene.align === "right" ? "right" : "left",
          }}>
            {scene.phrase}
          </div>
        </div>
      </div>

      {/* Localidades — arriba pegadas al navbar */}
      <div style={{
        position:"absolute", top:"4.5rem", left:0, right:0,
        zIndex:20,
        display:"flex", alignItems:"center", justifyContent:"center",
        gap:"2rem",
        flexWrap:"wrap",
        color:"rgba(255,255,255,0.35)",
        fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
        fontSize:"clamp(0.4rem,0.6vw,0.55rem)",
        fontWeight:300, letterSpacing:"0.35em",
        textTransform:"uppercase",
        padding:"0.4rem 0",
        background:"transparent",
      }}>
        {t.header.locations.map((loc: string, i: number, arr: string[]) => (
          <span key={loc} style={{display:"flex",alignItems:"center",gap:"2rem"}}>
            {loc}{i<arr.length-1&&<span style={{color:"rgba(201,169,110,0.4)"}}>·</span>}
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
          letterSpacing:"0.6em", fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
          textTransform:"uppercase",
        }}>{t.header.scroll}</span>
        <div className="neon-line" style={{ width:"1px", background:"rgba(201,169,110,0.8)" }}/>
      </div>

      {/* Barras de progreso */}
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
              <div key={animKey} className="progress-bar" style={{
                position:"absolute", top:0, left:0, height:"100%",
                background:"rgba(201,169,110,0.8)",
              }}/>
            )}
            {i < sceneIdx && (
              <div style={{
                position:"absolute", inset:0,
                background:"rgba(201,169,110,0.5)",
              }}/>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
