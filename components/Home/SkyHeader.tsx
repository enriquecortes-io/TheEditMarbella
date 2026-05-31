"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getT } from "@/lib/i18n";

const SCENE_CONFIG = [
  { align:"left",   locations:true },
  { align:"right",  locations:false },
  { align:"center", locations:false },
  { align:"left",   locations:false },
];

export default function SkyHeader({ locale = "es" }: { locale?: string }) {
  const t = getT(locale);
  const scenes = (t.header as any).scenes as Array<{word:string;phrase:string}> || [];
  const SCENES = SCENE_CONFIG.map((s,i) => ({...s, word:scenes[i]?.word||"", phrase:scenes[i]?.phrase||""}));

  const videoRef    = useRef<HTMLVideoElement>(null);
  const [sceneIdx, setSceneIdx]   = useState(0);
  const [prevIdx,  setPrevIdx]    = useState(-1);
  const wordRef     = useRef<HTMLDivElement>(null);
  const phraseRef   = useRef<HTMLDivElement>(null);
  const locationsRef= useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Video scene sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTime = () => {
      const d = video.duration || 1;
      const pct = video.currentTime / d;
      const idx = Math.min(SCENES.length - 1, Math.floor(pct * SCENES.length));
      setSceneIdx(prev => { if (prev !== idx) setPrevIdx(prev); return idx; });
    };
    video.addEventListener("timeupdate", handleTime);
    return () => video.removeEventListener("timeupdate", handleTime);
  }, []);

  // Entrada inicial — cinematográfica
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease:"expo.out" } });

      // Overlay oscuro que se levanta
      tl.fromTo("body", { backgroundColor:"#000" }, { backgroundColor:"transparent", duration:1.2 }, 0);

      // Locations — caen desde arriba con stagger
      if (locationsRef.current) {
        const spans = locationsRef.current.querySelectorAll("span");
        tl.from(spans, { autoAlpha:0, y:-16, duration:0.7, stagger:0.08, ease:"power3.out" }, 0.4);
      }

      // Word — entrada épica: scale masivo + blur + scaleY
      if (wordRef.current) {
        tl.fromTo(wordRef.current,
          { autoAlpha:0, y:80, scaleY:2.5, scaleX:0.8, filter:"blur(24px)", transformOrigin:"bottom center" },
          { autoAlpha:1, y:0,  scaleY:1,   scaleX:1,   filter:"blur(0px)",  duration:1.1, ease:"expo.out" },
          0.3
        );
      }

      // Phrase — slide desde izquierda con clip
      if (phraseRef.current) {
        tl.fromTo(phraseRef.current,
          { autoAlpha:0, x:-40, letterSpacing:"0.8em" },
          { autoAlpha:1, x:0,   letterSpacing:"0.4em", duration:0.9, ease:"power4.out" },
          0.8
        );
      }

      // Progress + scroll — fade sutil
      if (progressRef.current)
        tl.from(progressRef.current, { autoAlpha:0, y:12, duration:0.6 }, 1.1);
      if (scrollRef.current)
        tl.from(scrollRef.current, { autoAlpha:0, duration:0.5 }, 1.3);
    });
    return () => ctx.revert();
  }, []);

  // Transición entre escenas — dramática
  useEffect(() => {
    if (sceneIdx === 0 && prevIdx === -1) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults:{ ease:"expo.out" } });

      // Salida explosiva — se expande y desvanece
      if (wordRef.current)
        tl.to(wordRef.current, {
          autoAlpha:0, scaleY:0.3, scaleX:1.1, y:-30,
          filter:"blur(16px)", transformOrigin:"top center",
          duration:0.35, ease:"power3.in"
        }, 0);

      if (phraseRef.current)
        tl.to(phraseRef.current, {
          autoAlpha:0, x:30, duration:0.25, ease:"power2.in"
        }, 0);

      // Entrada word — scaleY épico desde abajo
      if (wordRef.current)
        tl.fromTo(wordRef.current,
          { autoAlpha:0, y:60, scaleY:2, scaleX:0.85, filter:"blur(20px)", transformOrigin:"bottom center" },
          { autoAlpha:1, y:0,  scaleY:1, scaleX:1,    filter:"blur(0px)",  duration:0.9 },
          0.3
        );

      // Entrada phrase
      if (phraseRef.current)
        tl.fromTo(phraseRef.current,
          { autoAlpha:0, x:-30, letterSpacing:"0.7em" },
          { autoAlpha:1, x:0,   letterSpacing:"0.4em", duration:0.7 },
          0.7
        );
    });
    return () => ctx.revert();
  }, [sceneIdx]);

  const scene = SCENES[sceneIdx] || SCENES[0];

  const breaks: Record<string,string[]> = {
    "POSEE":["PO","SEE"], "PERTENECE":["PERTE","NECE"], "DESCUBRE":["DES","CUBRE"],
    "BELONGS":["BE","LONGS"], "OWNS":["OW","NS"],
  };

  return (
    <div style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>

      {/* Vídeo */}
      <video ref={videoRef} autoPlay muted loop playsInline preload="metadata"
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}>
        <source src="/videos/HeroHeader.mp4" type="video/mp4"/>
      </video>

      {/* Overlay verde botella sutil */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to bottom, rgba(28,43,36,0.35) 0%, rgba(28,43,36,0.55) 100%)",
      }}/>

      {/* Locations */}
      <div ref={locationsRef} style={{
        position:"absolute", top:"clamp(4rem,8vw,6rem)", left:0, right:0,
        display:"flex", justifyContent:"center", gap:"clamp(1rem,3vw,2.5rem)",
        flexWrap:"wrap", padding:"0 2rem",
      }}>
        {(t.header as any).locations?.map((loc: string, i: number, arr: string[]) => (
          <span key={loc} style={{
            fontFamily:"'Montserrat',sans-serif",
            fontSize:"clamp(0.4rem,0.7vw,0.55rem)",
            fontWeight:300, letterSpacing:"0.4em",
            textTransform:"uppercase", color:"rgba(250,248,244,0.6)",
            display:"flex", alignItems:"center", gap:"clamp(1rem,3vw,2.5rem)",
          }}>
            {loc}
            {i < arr.length - 1 && (
              <span style={{ width:"1px", height:"0.6rem", background:"rgba(250,248,244,0.25)", display:"inline-block" }}/>
            )}
          </span>
        ))}
      </div>

      {/* Word + Phrase */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        justifyContent:"center",
        paddingLeft:  scene.align==="right"  ? 0 : scene.align==="center" ? "clamp(1.5rem,8vw,12vw)" : "clamp(1.5rem,8vw,12vw)",
        paddingRight: scene.align==="left"   ? 0 : scene.align==="center" ? "clamp(1.5rem,8vw,12vw)" : "clamp(1.5rem,8vw,12vw)",
        alignItems:   scene.align==="right"  ? "flex-end" : scene.align==="center" ? "center" : "flex-start",
      }}>
        <div ref={wordRef} style={{ willChange:"transform,opacity,filter" }}>
          <h1 style={{
            fontFamily:"'Cormorant Garamond','Didot',Georgia,serif",
            fontSize:"clamp(5rem,16vw,14rem)",
            fontWeight:700, lineHeight:0.88,
            color:"#FAF8F4", margin:0,
            letterSpacing:"-0.02em",
            textAlign: scene.align === "center" ? "center" : "left",
          }}>
            {(() => {
              const parts = breaks[scene.word];
              if (parts) return <>{parts.map((p,i)=><span key={i} style={{display:"block"}}>{p}</span>)}</>;
              return scene.word;
            })()}
          </h1>
        </div>

        <div ref={phraseRef} style={{ marginTop:"clamp(0.5rem,2vw,1.2rem)", willChange:"transform,opacity" }}>
          <p style={{
            fontFamily:"'Montserrat',sans-serif",
            fontSize:"clamp(0.5rem,1.1vw,0.75rem)",
            fontWeight:300, letterSpacing:"0.4em",
            textTransform:"uppercase",
            color:"rgba(250,248,244,0.75)", margin:0,
            textAlign: scene.align === "center" ? "center" : "left",
          }}>
            {scene.phrase}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div ref={progressRef} style={{
        position:"absolute", bottom:"clamp(3rem,6vw,4rem)", left:"clamp(1.5rem,8vw,12vw)", right:"clamp(1.5rem,8vw,12vw)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
          {SCENES.map((_,i) => (
            <div key={i} style={{
              width: i===sceneIdx ? "2rem" : "0.4rem",
              height:"1px",
              background: i===sceneIdx ? "rgba(250,248,244,0.8)" : "rgba(250,248,244,0.25)",
              transition:"all 0.4s ease",
            }}/>
          ))}
        </div>
        <span ref={scrollRef} style={{
          fontFamily:"'Montserrat',sans-serif",
          fontSize:"clamp(0.35rem,0.6vw,0.5rem)",
          fontWeight:300, letterSpacing:"0.5em",
          textTransform:"uppercase",
          color:"rgba(250,248,244,0.45)",
        }}>
          {(t.header as any).scroll || "SCROLL"}
        </span>
      </div>
    </div>
  );
}
