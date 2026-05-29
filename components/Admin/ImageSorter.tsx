"use client";
import { useState } from "react";
import { convertGDriveUrl } from "@/lib/gdrive";

interface Props {
  urls: string[];
  onChange: (urls: string[]) => void;
  onSave: () => void;
}

export default function ImageSorter({ urls, onChange, onSave }: Props) {
  const [selected, setSelected] = useState<number|null>(null);
  const [saving, setSaving] = useState(false);

  const images = urls.filter(Boolean);

  const autoSave = (newUrls: string[]) => {
    onChange(newUrls);
    setSaving(true);
    setTimeout(() => {
      onSave();
      setSaving(false);
    }, 600);
  };

  const handleCardClick = (i: number) => {
    if (selected === null) {
      setSelected(i);
    } else if (selected === i) {
      setSelected(null);
    } else {
      // Mover selected a posición i
      const newUrls = [...images];
      const [moved] = newUrls.splice(selected, 1);
      newUrls.splice(i, 0, moved!);
      setSelected(null);
      autoSave(newUrls);
    }
  };

  const handleDelete = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    const newUrls = images.filter((_, idx) => idx !== i);
    if (selected === i) setSelected(null);
    autoSave(newUrls);
  };

  if (images.length === 0) return null;

  return (
    <div style={{ marginTop:"1rem" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.75rem" }}>
        <p style={{ fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em", margin:0 }}>
          Previsualización · {images.length} imágenes
        </p>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          {selected !== null && (
            <span style={{ fontSize:"11px", color:"#2563eb", fontWeight:600 }}>
              #{selected+1} seleccionada — click en posición destino
            </span>
          )}
          {saving && <span style={{ fontSize:"11px", color:"#c9a96e", fontStyle:"italic" }}>Guardando...</span>}
          {selected === null && !saving && <span style={{ fontSize:"11px", color:"#9ca3af" }}>Click para seleccionar y reordenar</span>}
        </div>
      </div>
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",
        gap:"0.6rem",
      }}>
        {images.map((src, i) => {
          const imgUrl = convertGDriveUrl(src);
          const isSelected = selected === i;
          const isTarget = selected !== null && selected !== i;
          return (
            <div
              key={i}
              onClick={() => handleCardClick(i)}
              style={{
                position:"relative",
                borderRadius:"4px",
                overflow:"hidden",
                border: isSelected ? "3px solid #2563eb" : isTarget ? "2px dashed #93c5fd" : "2px solid transparent",
                cursor:"pointer",
                transition:"all 0.15s",
                background:"#f3f4f6",
                aspectRatio:"4/3",
                boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.2)" : "none",
              }}
            >
              {/* Número orden */}
              <div style={{
                position:"absolute", top:"4px", left:"4px", zIndex:2,
                background: isSelected ? "#2563eb" : "rgba(0,0,0,0.6)",
                color:"#fff", fontSize:"10px", fontWeight:700,
                width:"20px", height:"20px", borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {i + 1}
              </div>

              {/* Indicador destino */}
              {isTarget && (
                <div style={{
                  position:"absolute", inset:0, zIndex:2,
                  background:"rgba(59,130,246,0.15)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"18px",
                }}>→</div>
              )}

              {/* Botón eliminar */}
              <button
                onClick={e => handleDelete(e, i)}
                style={{
                  position:"absolute", top:"4px", right:"4px", zIndex:3,
                  background:"rgba(220,38,38,0.85)", color:"#fff",
                  border:"none", borderRadius:"50%",
                  width:"20px", height:"20px",
                  cursor:"pointer", fontSize:"10px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}
              >✕</button>

              <img
                src={imgUrl}
                alt={`img-${i}`}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", opacity: isSelected ? 0.7 : 1 }}
                onError={e => { (e.target as HTMLImageElement).style.opacity = "0.2"; }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
