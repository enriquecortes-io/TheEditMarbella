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
                fontFamily:"'Helvetica Neue',sans-serif",
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
            <div style={{ position:"absolute", bottom:"-2rem", left:"50%", transform:"translateX(-50%)", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.4em" }}>
              {String(images.indexOf(lightbox)+1).padStart(2,"0")} / {String(images.length).padStart(2,"0")}
            </div>
          </div>
        </div>
      )}
      {/* Sección descripción — aparece entre video y galería */}
      <div ref={descRef} style={{
        position:"fixed",
        inset:0,
        zIndex:8,
        display:"flex",
        alignItems:"flex-start",
        justifyContent:"center",
        padding:"0",
        background:"rgba(4,3,2,0.95)",
        opacity:0,
        pointerEvents:"none",
        transition:"opacity 0.3s ease",
        overflowY:"auto",
      }}>
        <div style={{ maxWidth:"860px", width:"100%", padding:"5rem clamp(2rem,8vw,8rem)", margin:"0 auto" }}>
          <p style={{ fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.5rem", color:"rgba(201,169,110,0.7)", letterSpacing:"0.6em", textTransform:"uppercase", margin:"0 0 2rem" }}>
            {property.ubicacion}
          </p>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(3rem,8vw,8rem)", fontWeight:900, color:"white", lineHeight:0.9, margin:"0 0 3rem", letterSpacing:"-0.02em" }}>
            {property.titulo[lang]}
          </h1>
          <div style={{ width:"4rem", height:"1px", background:"rgba(201,169,110,0.5)", margin:"0 0 3rem" }}/>
          <p style={{ fontFamily:"'Cormorant Garamond','Georgia',serif", fontSize:"clamp(1.1rem,2vw,1.6rem)", fontWeight:300, fontStyle:"italic", color:"rgba(255,255,255,0.75)", lineHeight:1.8, margin:0, whiteSpace:"pre-line" }}>
            {typeof property.descripcion === "object"
              ? (property.descripcion as any)[lang] || (property.descripcion as any)["en"] || ""
              : property.descripcion || ""}
          </p>
        </div>
      </div>

      {/* Modal formulario */}
      {showForm && (
        <div style={{
          position:"fixed", inset:0, zIndex:200,
          background:"rgba(0,0,0,0.85)",
          backdropFilter:"blur(20px)",
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
                fontFamily:"'Helvetica Neue',sans-serif",
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
