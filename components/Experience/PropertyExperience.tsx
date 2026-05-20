"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Property } from "@/types/property";
import { useScrollEngine } from "./useScrollEngine";
import Navbar from "./Navbar";
import ScrollIndicator from "./ScrollIndicator";
import VideoSection from "./VideoSection";
import GallerySection from "./GallerySection";
import PrivateAccessForm from "./PrivateAccessForm";

interface Props {
  property: Property;
  locale: string;
}

export default function PropertyExperience({ property, locale }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const images = property.galeria_urls || [];
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const infographic1Ref = useRef<HTMLDivElement>(null);
  const infographic2Ref = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const urlLocale = pathname.split("/")[1] || locale;
  const lang = urlLocale as "es" | "en" | "fr" | "ru";
  const inf1 = property.infografias?.[0] || null;

  // Extraer primera frase de la descripción traducida
  const getFirstSentence = (text: string) => {
    const match = text?.match(/^[^.!?\n]+[.!?]?/);
    return match ? match[0].trim() : text;
  };

  const desc = property.descripcion;
  const descText = typeof desc === "object"
    ? (desc as any)[lang] || (desc as any)["es"] || (desc as any)["en"] || ""
    : desc || "";

  const inf2 = {
    label: { es:"Perspectiva", en:"Perspective", fr:"Perspective", ru:"Перспектива" },
    titulo: {
      es: getFirstSentence(typeof desc === "object" ? (desc as any)["es"] || "" : descText),
      en: getFirstSentence(typeof desc === "object" ? (desc as any)["en"] || "" : descText),
      fr: getFirstSentence(typeof desc === "object" ? (desc as any)["fr"] || "" : descText),
      ru: getFirstSentence(typeof desc === "object" ? (desc as any)["ru"] || "" : descText),
    },
    subtitulo: { es:"", en:"", fr:"", ru:"" },
    texto: { es:"", en:"", fr:"", ru:"" },
  };

  useScrollEngine({
    videoRef,
    stageRef,
    galleryTrackRef,
    infographic1Ref,
    infographic2Ref,
    descRef,
  });

  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
      <Navbar locale={locale} onPrivateAccess={() => setShowForm(true)} />
      <ScrollIndicator />
      <div ref={stageRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100vh", willChange: "height, transform" }}>
        <VideoSection
          videoRef={videoRef}
          infographic1Ref={infographic1Ref}
          infographic2Ref={infographic2Ref}
          videoUrl={property.video_url}
          m2Construidos={property.m2_construidos}
          m2Parcela={property.m2_parcela}
          habitaciones={property.habitaciones}
          banos={property.banos}
          precio={property.precio}
          inf2={inf2}
          locale={urlLocale}
        />
        {/* Descripción enmarcada — sección física en el scroll */}
        <div ref={descRef} style={{
          position:"absolute",
          top:"100vh",
          left:0, right:0,
          height:"100vh",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          padding:"clamp(2rem,5vw,5rem)",
          opacity:0,
          pointerEvents:"none",
          transition:"opacity 0.5s ease",
        }}>
          {/* Marco revista */}
          <div style={{
            maxWidth:"1100px",
            width:"100%",
            border:"1px solid rgba(201,169,110,0.2)",
            padding:"clamp(2rem,4vw,4rem)",
            display:"grid",
            gridTemplateColumns:"1fr 2fr",
            gap:"clamp(2rem,4vw,4rem)",
            background:"rgba(8,6,4,0.85)",
            backdropFilter:"blur(20px)",
            boxShadow:"0 0 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.03)",
          }}>

            {/* Columna izquierda — datos */}
            <div style={{ borderRight:"1px solid rgba(201,169,110,0.15)", paddingRight:"clamp(1.5rem,3vw,3rem)" }}>
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.45rem", color:"#c9a96e", letterSpacing:"0.5em", textTransform:"uppercase", margin:"0 0 1rem" }}>
                {property.ubicacion}
              </p>
              <div style={{ width:"2rem", height:"1px", background:"rgba(201,169,110,0.5)", margin:"0 0 1.5rem" }}/>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.8rem,3vw,3rem)", fontWeight:600, color:"white", lineHeight:1.0, margin:"0 0 2rem", letterSpacing:"-0.01em" }}>
                {typeof property.titulo === "object" ? (property.titulo as any)[lang] || (property.titulo as any)["en"] || "" : property.titulo}
              </h2>
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                {[
                  { label:"Construido", value: property.m2_construidos ? `${property.m2_construidos} m²` : null },
                  { label:"Parcela", value: property.m2_parcela ? `${property.m2_parcela} m²` : null },
                  { label:"Hab.", value: property.habitaciones || null },
                  { label:"Baños", value: property.banos || null },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", borderBottom:"1px solid rgba(255,255,255,0.05)", paddingBottom:"0.5rem" }}>
                    <span style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.3em", textTransform:"uppercase" }}>{d.label}</span>
                    <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"white", fontWeight:300 }}>{String(d.value)}</span>
                  </div>
                ))}
              </div>
              {property.precio && (
                <div style={{ marginTop:"1.5rem", paddingTop:"1.5rem", borderTop:"1px solid rgba(201,169,110,0.2)" }}>
                  <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", color:"rgba(201,169,110,0.5)", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.3rem" }}>Precio</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", color:"#c9a96e", margin:0, fontWeight:300 }}>€{(property.precio/1000000).toFixed(1)}M</p>
                </div>
              )}
            </div>

            {/* Columna derecha — descripción */}
            <div style={{ overflowY:"auto", maxHeight:"60vh" }}>
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(0.8rem,1vw,0.9rem)", fontWeight:400, color:"rgba(255,255,255,0.65)", lineHeight:2, margin:"0 0 2rem", letterSpacing:"0.02em", whiteSpace:"pre-line" }}>
                {typeof property.descripcion === "object"
                  ? (property.descripcion as any)[lang] || (property.descripcion as any)["en"] || ""
                  : property.descripcion || ""}
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                <div style={{ width:"1.5rem", height:"1px", background:"rgba(201,169,110,0.4)" }}/>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", color:"rgba(201,169,110,0.4)", letterSpacing:"0.4em", textTransform:"uppercase", margin:0 }}>The Edit · Marbella</p>
              </div>
            </div>

          </div>
        </div>

        <GallerySection
          galleryTrackRef={galleryTrackRef}
          images={images}
          onImageClick={setLightbox}
          titulo={property.titulo[lang]}
          ubicacion={property.ubicacion}
          locale={urlLocale}
        />
      </div>
      {/* LIGHTBOX — fuera del stageRef */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position:"fixed", inset:0, zIndex:1000,
            background:"rgba(0,0,0,0.92)",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"zoom-out",
            backdropFilter:"blur(8px)",
            animation:"fadeInLB 0.3s ease both",
          }}
        >
          <style>{`
            @keyframes fadeInLB{0%{opacity:0;}100%{opacity:1;}}
            @keyframes scaleInLB{0%{opacity:0;transform:scale(0.92);}100%{opacity:1;transform:scale(1);}}
          `}</style>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width:"80vw", height:"80vh",
              position:"relative",
              animation:"scaleInLB 0.35s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <img
              src={lightbox}
              alt=""
              style={{ width:"100%", height:"100%", objectFit:"contain" }}
            />
            <button
              onClick={() => setLightbox(null)}
              style={{
                position:"absolute", top:"-2.5rem", right:0,
                background:"none", border:"none",
                color:"rgba(255,255,255,0.5)",
                fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
                fontSize:"0.5rem", letterSpacing:"0.4em",
                textTransform:"uppercase", cursor:"pointer",
              }}
            >CLOSE ✕</button>
            {images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); const i = images.indexOf(lightbox); setLightbox(images[(i-1+images.length)%images.length]); }}
                  style={{ position:"absolute", left:"-3rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.5)", width:"2.2rem", height:"2.2rem", cursor:"pointer", fontSize:"0.9rem", display:"flex", alignItems:"center", justifyContent:"center" }}
                >←</button>
                <button
                  onClick={e => { e.stopPropagation(); const i = images.indexOf(lightbox); setLightbox(images[(i+1)%images.length]); }}
                  style={{ position:"absolute", right:"-3rem", top:"50%", transform:"translateY(-50%)", background:"none", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.5)", width:"2.2rem", height:"2.2rem", cursor:"pointer", fontSize:"0.9rem", display:"flex", alignItems:"center", justifyContent:"center" }}
                >→</button>
              </>
            )}
            <div style={{ position:"absolute", bottom:"-2rem", left:"50%", transform:"translateX(-50%)", fontFamily:"'Montserrat','Helvetica Neue',sans-serif", fontSize:"0.4rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.4em" }}>
              {String(images.indexOf(lightbox)+1).padStart(2,"0")} / {String(images.length).padStart(2,"0")}
            </div>
          </div>
        </div>
      )}
      
            {property.precio && (
              <div style={{ marginTop:"1.5rem", paddingTop:"1.5rem", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", color:"rgba(201,169,110,0.6)", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.4rem" }}>Precio</p>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.2rem", fontWeight:300, color:"#c9a96e", margin:0 }}>€{(property.precio/1000000).toFixed(1)}M</p>
              </div>
            )}
          </div>
          {/* Columna derecha */}
          <div style={{ padding:"clamp(3rem,8vh,6rem) 0", borderLeft:"1px solid rgba(255,255,255,0.06)", paddingLeft:"clamp(2rem,4vw,4rem)" }}>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(0.8rem,1vw,0.95rem)", fontWeight:400, color:"rgba(255,255,255,0.7)", lineHeight:2, margin:0, letterSpacing:"0.02em", whiteSpace:"pre-line" }}>
              {typeof property.descripcion === "object"
                ? (property.descripcion as any)[lang] || (property.descripcion as any)["en"] || ""
                : property.descripcion || ""}
            </p>
            <div style={{ marginTop:"2.5rem", display:"flex", alignItems:"center", gap:"1rem" }}>
              <div style={{ width:"2rem", height:"1px", background:"rgba(201,169,110,0.4)" }}/>
              <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.45rem", color:"rgba(201,169,110,0.5)", letterSpacing:"0.4em", textTransform:"uppercase", margin:0 }}>The Edit · Marbella</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal formulario */}
      {showForm && (
        <div style={{
          position:"fixed", inset:0, zIndex:200,
          background:"linear-gradient(135deg, #0d0a08 0%, #1a1008 40%, #0a0d1a 100%)",
          backdropFilter:"blur(4px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"2rem",
          overflowY:"auto",
        }}
          onClick={e => { if(e.target===e.currentTarget) setShowForm(false); }}
        >
          <div style={{
            width:"100%", maxWidth:"680px",
            background:"rgba(8,6,4,0.95)",
            border:"1px solid rgba(201,169,110,0.2)",
            padding:"clamp(2rem,5vw,4rem)",
            position:"relative",
            maxHeight:"90vh", overflowY:"auto",
          }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                position:"absolute", top:"1.5rem", right:"1.5rem",
                background:"none", border:"none",
                color:"rgba(255,255,255,0.3)",
                fontFamily:"'Montserrat','Helvetica Neue',sans-serif",
                fontSize:"0.45rem", letterSpacing:"0.4em",
                cursor:"pointer", textTransform:"uppercase",
              }}
            >CLOSE ✕</button>
            <PrivateAccessForm
              locale={urlLocale}
              propertyTitle={property.titulo[lang]}
              propertySlug={property.slug}
            />
          </div>
        </div>
      )}
    </div>
  );
}
