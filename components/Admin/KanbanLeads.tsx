"use client";
import { useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SB_HEADERS = {
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
  "cerrado":          {bg:"#dcfce7",text:"#166534",border:"#86efac"},
  "no contesta":      {bg:"#fff7ed",text:"#c2410c",border:"#fed7aa"},
  "durmiente":        {bg:"#FAF8F4",text:"#4A4540",border:"#DDD8D0"},
  "falso":            {bg:"#fef2f2",text:"#dc2626",border:"#fecaca"},
};

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  property_title?: string;
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
  const [selected, setSelected] = useState<string|null>(null);
  const [expanded, setExpanded] = useState<string|null>(null);
  const [moving, setMoving] = useState(false);

  const updateFase = async (id: string, fase: string) => {
    setMoving(true);
    await fetch(`${SUPABASE_URL}/rest/v1/${tabla}?id=eq.${id}`, {
      method:"PATCH", headers: SB_HEADERS, body: JSON.stringify({ fase }),
    });
    setSelected(null);
    setMoving(false);
    onUpdate();
  };

  const handleCardClick = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    if (selected === lead.id) {
      setSelected(null);
    } else {
      setSelected(lead.id);
      setExpanded(lead.id);
    }
  };

  const handleColumnClick = async (fase: string) => {
    if (selected && !moving) {
      const lead = leads.find(l => l.id === selected);
      if (lead && lead.fase !== fase) {
        await updateFase(selected, fase);
      } else {
        setSelected(null);
      }
    }
  };

  const byFase = (fase: string) => leads.filter(l => (l.fase || "nuevo") === fase);
  const selectedLead = leads.find(l => l.id === selected);

  return (
    <div>
      {/* Instrucción */}
      <div style={{ marginBottom:"12px", padding:"10px 14px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:"8px", fontSize:"12px", color:"#92400e" }}>
        {selected
          ? `✓ "${selectedLead?.name}" seleccionado — toca una columna para moverlo`
          : "Toca una tarjeta para seleccionarla, luego toca la columna destino"}
      </div>

      <div style={{ display:"flex", gap:"12px", overflowX:"auto", paddingBottom:"1rem", minHeight:"500px" }}>
        {fases.map(fase => {
          const col = byFase(fase);
          const colors = FASE_COLORS[fase] || {bg:"#FAF8F4",text:"#1A1714",border:"#DDD8D0"};
          const isTarget = selected && selectedLead?.fase !== fase;
          return (
            <div
              key={fase}
              onClick={() => handleColumnClick(fase)}
              style={{
                minWidth:"200px", width:"200px", flexShrink:0,
                background: isTarget ? "#f0f9ff" : "#FAF8F4",
                borderRadius:"8px",
                border: isTarget ? "2px dashed #3b82f6" : "2px solid #e5e7eb",
                padding:"12px",
                transition:"all 0.2s",
                cursor: isTarget ? "pointer" : "default",
              }}
            >
              {/* Header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
                <span style={{ fontSize:"10px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:colors.text }}>
                  {fase}
                </span>
                <span style={{ background:colors.bg, color:colors.text, border:`1px solid ${colors.border}`, borderRadius:"12px", padding:"1px 8px", fontSize:"11px", fontWeight:700 }}>
                  {col.length}
                </span>
              </div>

              {/* Drop zone indicator */}
              {isTarget && (
                <div style={{ marginBottom:"8px", padding:"8px", background:"#dbeafe", borderRadius:"6px", textAlign:"center", fontSize:"11px", color:"#1d4ed8", fontWeight:600 }}>
                  Mover aquí →
                </div>
              )}

              {/* Cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                {col.map(lead => {
                  const isSelected = selected === lead.id;
                  return (
                    <div
                      key={lead.id}
                      onClick={e => handleCardClick(e, lead)}
                      style={{
                        background: isSelected ? "#eff6ff" : "white",
                        borderRadius:"6px",
                        border: isSelected ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                        padding:"10px",
                        cursor:"pointer",
                        boxShadow: isSelected ? "0 0 0 3px rgba(59,130,246,0.15)" : "0 1px 3px rgba(26,23,20,0.06)",
                        transition:"all 0.15s",
                      }}
                    >
                      <p style={{ margin:0, fontSize:"13px", fontWeight:600, color:"#111827" }}>{lead.name}</p>
                      {lead.property_title && <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#4A4540" }}>{lead.property_title}</p>}
                      {lead.ubicacion && <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#4A4540" }}>{lead.ubicacion}</p>}
                      {lead.precio_estimado && <p style={{ margin:"2px 0 0", fontSize:"11px", color:"#059669", fontWeight:600 }}>{lead.precio_estimado}</p>}
                      <p style={{ margin:"4px 0 0", fontSize:"10px", color:"#8A847C" }}>{new Date(lead.created_at).toLocaleDateString("es-ES")}</p>

                      {/* Expandido */}
                      {expanded === lead.id && (
                        <div style={{ marginTop:"8px", paddingTop:"8px", borderTop:"1px solid #f3f4f6" }}>
                          {lead.email && <p style={{ margin:"2px 0", fontSize:"11px", color:"#1A1714" }}>✉ {lead.email}</p>}
                          {lead.phone && <p style={{ margin:"2px 0", fontSize:"11px", color:"#1A1714" }}>📞 {lead.phone}</p>}
                          {lead.horizon && <p style={{ margin:"2px 0", fontSize:"11px", color:"#1A1714" }}>⏱ {lead.horizon}</p>}
                          {lead.notas && <p style={{ margin:"4px 0 0", fontSize:"11px", color:"#4A4540", fontStyle:"italic" }}>{lead.notas}</p>}
                          {/* Selector rápido de fase */}
                          <select
                            value={lead.fase||"nuevo"}
                            onChange={e=>{e.stopPropagation();updateFase(lead.id,e.target.value);}}
                            onClick={e=>e.stopPropagation()}
                            style={{ marginTop:"8px", fontSize:"11px", padding:"4px 6px", borderRadius:"4px", border:"1px solid #DDD8D0", width:"100%", background:"white" }}
                          >
                            {fases.map(f=><option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}

                {col.length === 0 && (
                  <div style={{ padding:"20px", textAlign:"center", color:isTarget?"#3b82f6":"#C8C0B4", fontSize:"12px", border:`2px dashed ${isTarget?"#93c5fd":"#DDD8D0"}`, borderRadius:"6px" }}>
                    {isTarget ? "Soltar aquí" : "Sin leads"}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
