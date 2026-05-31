"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getT } from "@/lib/i18n";

const SCENE_DURATION = 5000; // 5 segundos por escena

const SCENE_CONFIG = [
  { align:"left" },
  { align:"right" },
  { align:"left" },
  { align:"right" },
  { align:"left" },
  { align:"center" },
];

export default function SkyHeader({ locale = "es" }: { locale?: string }) {
  const t = getT(locale);
  const scenes = (t.header as any).scenes as Array<{word:string;phrase:string}> || [];
  const SCENES = SCENE_CONFIG.map((s,i) => ({...s, word:scenes[i]?.word||"", phrase:scenes[i]?.phrase||""}));

  const videoRef     = useRef<HTMLVideoElement>(null);
  const wordRef      = useRef<HTMLDivElement>(null);
  const phraseRef    = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLSpanElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const timerRef     = useRef<ReturnType<typeof setInterval>|null>(null);

  const [sceneIdx, setSceneIdx] = useState(0);
  const [animKey, setAnimKey]   = useState(0);

  // Timer fijo 5s por escena — arranca después de 5s completos
  useEffect(() => {
    // Esperar 5s antes del primer cambio
    const first = setTimeout(() => {
      setSceneIdx(1);
      setAnimKey(1);
      // Luego interval normal
      timerRef.current = setInterval(() => {
        setSceneIdx(prev => (prev + 1) % SCENES.length);
        setAnimKey(k => k + 1);
      }, SCENE_DURATION);
    }, SCENE_DURATION);
    return () => {
      clearTimeout(first);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Animación entrada inicial
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (locationsRef.current) {
        const spans = locationsRef.current.querySelectorAll("span");
        tl.from(spans, { autoAlpha:0, y:-20, duration:0.8, stagger:0.1, ease:"power3.out" }, 0.5);
      }
      if (wordRef.current) {
        tl.fromTo(wordRef.current,
          { autoAlpha:0, y:120, scaleY:3, scaleX:0.7, filter:"blur(30px)", transformOrigin:"bottom center" },
          { autoAlpha:1, y:0,   scaleY:1, scaleX:1,   filter:"blur(0px)",  duration:1.2, ease:"expo.out" },
          0.2
        );
      }
      if (phraseRef.current) {
        tl.fromTo(phraseRef.current,
          { autoAlpha:0, x:-60, filter:"blur(8px)" },
          { autoAlpha:1, x:0,   filter:"blur(0px)", duration:1.0, ease:"power4.out" },
          0.9
        );
      }
      if (progressRef.current)
        tl.from(progressRef.current, { autoAlpha:0, y:16, duration:0.7 }, 1.3);
      if (scrollRef.current)
        tl.from(scrollRef.current, { autoAlpha:0, duration:0.6 }, 1.5);
    });
    return () => ctx.revert();
  }, []);

  // Animación transición entre escenas
  useEffect(() => {
    if (animKey === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // SALIDA — colapsa hacia arriba con blur
      if (wordRef.current)
        tl.to(wordRef.current, {
          autoAlpha:0, y:-80, scaleY:0.2, scaleX:1.15,
          filter:"blur(24px)", transformOrigin:"top center",
          duration:0.4, ease:"power3.in"
        }, 0);

      if (phraseRef.current)
        tl.to(phraseRef.current, {
          autoAlpha:0, x:50, filter:"blur(6px)",
          duration:0.3, ease:"power2.in"
        }, 0);

      // ENTRADA — épica desde abajo
      if (wordRef.current)
        tl.fromTo(wordRef.current,
          { autoAlpha:0, y:100, scaleY:3, scaleX:0.7, filter:"blur(28px)", transformOrigin:"bottom center" },
          { autoAlpha:1, y:0,   scaleY:1, scaleX:1,   filter:"blur(0px)",  duration:1.0, ease:"expo.out" },
          0.35
        );

      if (phraseRef.current)
        tl.fromTo(phraseRef.current,
          { autoAlpha:0, x:-50, filter:"blur(8px)" },
          { autoAlpha:1, x:0,   filter:"blur(0px)", duration:0.8, ease:"power4.out" },
          0.85
        );
    });
    return () => ctx.revert();
  }, [animKey]);

  const scene = SCENES[sceneIdx] || SCENES[0];

  // Palabras largas — split en 2 líneas
  const splitWord = (word: string) => {
    const splits: Record<string,string[]> = {
      "CONDUCE":   ["CON","DUCE"],
      "CONDUISEZ": ["CON","DUISEZ"],
      "POSSÉDEZ":  ["POS","SÉDEZ"],
      "ВЛАДЕЙТЕ":  ["ВЛА","ДЕЙТЕ"],
      "УЖИНАЙТЕ":  ["УЖИ","НАЙТЕ"],
      "ИГРАЙТЕ":   ["ИГ","РАЙТЕ"],
      "ЖИВИТЕ":    ["ЖИ","ВИТЕ"],
      "МАРБЕЛЬЯ":  ["МАР","БЕЛЬЯ"],
      "MARBELLA":  ["MAR","BELLA"],
      "DESCUBRE":  ["DES","CUBRE"],
      "DÎNEZ":     ["DÎ","NEZ"],
    };
    return splits[word] || null;
  };

  const isLong = scene.word.length > 6;

  return (
    <div style={{ position:"absolute", inset:0, width:"100%", height:"100%", overflow:"hidden" }}>

      {/* Vídeo */}
      <video ref={videoRef} autoPlay muted loop playsInline preload="metadata"
        poster="/videos/hero-poster.jpg"
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}>
        <source src="/videos/HeroHeader.mp4" type="video/mp4"/>
      </video>

      {/* Overlay */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(160deg, rgba(15,25,20,0.5) 0%, rgba(15,25,20,0.25) 50%, rgba(15,25,20,0.6) 100%)",
      }}/>

      {/* Locations */}
      <div ref={locationsRef} style={{
        position:"absolute", top:"clamp(4rem,8vw,6rem)", left:0, right:0,
        display:"flex", justifyContent:"center", gap:"clamp(0.8rem,2vw,2rem)",
        flexWrap:"wrap", padding:"0 2rem",
      }}>
        {(t.header as any).locations?.map((loc: string, i: number, arr: string[]) => (
          <span key={loc} style={{
            fontFamily:"'Montserrat',sans-serif",
            fontSize:"clamp(0.38rem,0.65vw,0.52rem)",
            fontWeight:300, letterSpacing:"0.4em",
            textTransform:"uppercase", color:"rgba(250,248,244,0.55)",
            display:"flex", alignItems:"center", gap:"clamp(0.8rem,2vw,2rem)",
          }}>
            {loc}
            {i < arr.length - 1 && (
              <span style={{ width:"1px", height:"0.5rem", background:"rgba(250,248,244,0.2)", display:"inline-block" }}/>
            )}
          </span>
        ))}
      </div>

      {/* Word + Phrase */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", flexDirection:"column",
        justifyContent:"center",
        paddingLeft:  scene.align==="right"  ? 0 : "clamp(1.5rem,8vw,12vw)",
        paddingRight: scene.align==="left"   ? 0 : "clamp(1.5rem,8vw,12vw)",
        alignItems:   scene.align==="right"  ? "flex-end" : scene.align==="center" ? "center" : "flex-start",
      }}>
        <div ref={wordRef} style={{ willChange:"transform,opacity,filter" }}>
          <h1 style={{
            fontFamily:"'Cormorant Garamond','Didot',Georgia,serif",
            fontSize: isLong ? "clamp(3.5rem,11vw,10rem)" : "clamp(5rem,16vw,14rem)",
            fontWeight:700, lineHeight:0.85,
            color:"#FAF8F4", margin:0,
            letterSpacing:"-0.02em",
            textAlign: scene.align === "center" ? "center" : scene.align === "right" ? "right" : "left",
          }}>
            {(() => {
              const parts = splitWord(scene.word);
              if (parts) return <>{parts.map((p,i)=><span key={i} style={{display:"block"}}>{p}</span>)}</>;
              return scene.word;
            })()}
          </h1>
        </div>

        <div ref={phraseRef} style={{ marginTop:"clamp(0.5rem,2vw,1.2rem)", willChange:"transform,opacity,filter" }}>
          <p style={{
            fontFamily:"'Montserrat',sans-serif",
            fontSize:"clamp(0.5rem,1.1vw,0.75rem)",
            fontWeight:300, letterSpacing:"0.4em",
            textTransform:"uppercase",
            color:"rgba(250,248,244,0.7)", margin:0,
            textAlign: scene.align === "center" ? "center" : scene.align === "right" ? "right" : "left",
          }}>
            {scene.phrase}
          </p>
        </div>
      </div>

      {/* Progress + Scroll */}
      <div ref={progressRef} style={{
        position:"absolute", bottom:"clamp(2rem,5vw,3.5rem)",
        left:"clamp(1.5rem,8vw,12vw)", right:"clamp(1.5rem,8vw,12vw)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", gap:"0.6rem", alignItems:"center" }}>
          {SCENES.map((_,i) => (
            <div key={i} style={{
              width: i===sceneIdx ? "2.5rem" : "0.5rem",
              height:"1px",
              background: i===sceneIdx ? "rgba(250,248,244,0.9)" : "rgba(250,248,244,0.2)",
              transition:"all 0.5s ease",
            }}/>
          ))}
        </div>
        <span ref={scrollRef} style={{
          fontFamily:"'Montserrat',sans-serif",
          fontSize:"clamp(0.35rem,0.6vw,0.5rem)",
          fontWeight:300, letterSpacing:"0.5em",
          textTransform:"uppercase",
          color:"rgba(250,248,244,0.4)",
        }}>
          {(t.header as any).scroll || "SCROLL"}
        </span>
      </div>
    </div>
  );
}
