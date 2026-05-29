"use client";
import { useState, useRef } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const headers = {
  "Content-Type":"application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Prefer": "return=minimal",
};

export const FASES_VENTA = ["nuevo","contactado","visita programada","oferta","cerrado","no contesta","durmiente","falso"] as const;
export const FASES_CAPTACION = ["nuevo","contactado","visita programada","oferta","cerrado"] as const;

const FASE_COLORS: Record<string,{bg:string,text:string,border:string}> = {
  "nuevo":            {bg:"#eff6ff",text:"#1d4ed8",border:"#bfdbfe"},
  "contactado":       {bg:"#f0fdf4",text:"#15803d",border:"#bbf7d0"},
  "visita programada":{bg:"#fefce8",text:"#a16207",border:"#fde68a"},
  "oferta":           {bg:"#fdf4ff",text:"#7e22ce",border:"#e9d5ff"},
  "cerrado":          {bg:"#f0fdf4",text:"#166534",border:"#86efac"},
  "no contesta":      {bg:"#fff7ed",text:"#c2410c",border:"#fed7aa"},
  "durmiente":        {bg:"#f9fafb",text:"#6b7280",border:"#e5e7eb"},
  "falso":            {bg:"#fef2f2",text:"#dc2626",border:"#fecaca"},
};

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  property_title?: string;
  property_slug?: string;
  ubicacion?: string;
  precio_estimado?: string;
  horizon?: string;
  fase: string;
  created_at: string;
  notas?: string;
}

interface Props {
  leads: Lead[];
  fases: readonly string[];
  tabla: "leads" | "captacion_leads";
  onUpdate: () => void;
}

export default function KanbanLeads({ leads, fases, tabla, onUpdate }: Props) {
  const [dragging, setDragging] = useState<string|null>(null);
  const [over, setOver] = useState<string|null>(null);
  const [expanded, setExpanded] = useState<string|null>(null);

  const updateFase = async (id: string, fase: string) => {
    await fetch(`${SUPABASE_URL}/rest/v1/${tabla}?id=eq.${id}`, {
      method:"PATCH", headers, body: JSON.stringify({ fase }),
    });
    onUpdate();
  };

  const handleDragStart = (id: string) => setDragging(id);
  const handleDragOver = (e: React.DragEvent, fase: string) => { e.preventDefault(); setOver(fase); };
  const handleDrop = async (e: React.DragEvent, fase: string) => {
    e.preventDefault();
    if (dragging && dragging !== fase) await updateFase(dragging, fase);
    setDragging(null); setOver(null);
  };
  const handleDragEnd = () => { setDragging(null); setOver(null); };
  const handleColumnClick = async (fase: string) => {
    if (dragging) { await updateFase(dragging, fase); setDragging(null); setOver(null); }
  };

  const byFase = (fase: string) => leads.filter(l => (l.fase || "nuevo") === fase);

  return (
    <div style={{ display:"flex", gap:"12px", overflowX:"auto", paddingBottom:"1rem", minHeight:"500px" }}>
      {fases.map(fase => {
        const col = byFase(fase);
        const colors = FASE_COLORS[fase] || {bg:"#f9fafb",text:"#374151",border:"#e5e7eb"};
        return (
          <div
            key={fase}
            onDragOver={e=>handleDragOver(e,fase)}
            onDrop={e=>handleDrop(e,fase)}
            onClick={()=>handleColumnClick(fase)}
            style={{
              minWidth:"220px", width:"220px", flexShrink:0,
              background: over===fase ? "#f0f9ff" : "#f9fafb",
              borderRadius:"8px", border:`2px solid ${over===fase?"#93c5fd":"#e5e7eb"}`,
              padding:"12px", transition:"all 0.15s",
            }}
          >
            {/* Header columna */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
              <span style={{ fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:colors.text }}>
                {fase}
              </span>
              <span style={{ background:colors.bg, color:colors.text, border:`1px solid ${colors.border}`, borderRadius:"12px", padding:"1px 8px", fontSize:"11px", fontWeight:700 }}>
                {col.length}
              </span>
            </div>

            {/* Cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {col.map(lead => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={()=>handleDragStart(lead.id)}
                  onDragEnd={handleDragEnd}
                  onClick={()=>setExpanded(expanded===lead.id?null:lead.id)}
                  style={{
                    background:"white", borderRadius:"6px",
                    border:`1px solid ${dragging===lead.id?"#93c5fd":"#e5e7eb"}`,
                    padding:"10px", cursor:"grab", WebkitUserSelect:"none",
                    opacity: dragging===lead.id ? 0.5 : 1,
                    boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
                    transition:"all 0.15s",
                  }}
                >
                  <p style={{ margin:0, fontSize:"13px", fontWeight:600, color:"#111827" }}>{lead.name}</p>
                  {lead.property_title && <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#6b7280" }}>{lead.property_title}</p>}
                  {lead.ubicacion && <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#6b7280" }}>{lead.ubicacion}</p>}
                  {lead.precio_estimado && <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#6b7280" }}>{lead.precio_estimado}</p>}
                  <p style={{ margin:"4px 0 0", fontSize:"10px", color:"#9ca3af" }}>{new Date(lead.created_at).toLocaleDateString("es-ES")}</p>

                  {/* Expandido */}
                  {expanded===lead.id && (
                    <div style={{ marginTop:"8px", paddingTop:"8px", borderTop:"1px solid #f3f4f6" }}>
                      {lead.email && <p style={{ margin:"2px 0", fontSize:"11px", color:"#374151" }}>✉ {lead.email}</p>}
                      {lead.phone && <p style={{ margin:"2px 0", fontSize:"11px", color:"#374151" }}>📞 {lead.phone}</p>}
                      {lead.horizon && <p style={{ margin:"2px 0", fontSize:"11px", color:"#374151" }}>⏱ {lead.horizon}</p>}
                      {lead.notas && <p style={{ margin:"4px 0 0", fontSize:"11px", color:"#6b7280", fontStyle:"italic" }}>{lead.notas}</p>}
                      <div style={{ marginTop:"8px" }}>
                        <select
                          value={lead.fase||"nuevo"}
                          onChange={e=>{e.stopPropagation();updateFase(lead.id,e.target.value);}}
                          onClick={e=>e.stopPropagation()}
                          style={{ fontSize:"11px", padding:"3px 6px", borderRadius:"4px", border:"1px solid #e5e7eb", width:"100%" }}
                        >
                          {fases.map(f=><option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {col.length === 0 && (
                <div style={{ padding:"20px", textAlign:"center", color:"#d1d5db", fontSize:"12px", border:"2px dashed #e5e7eb", borderRadius:"6px" }}>
                  Sin leads
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
