"use client";
import { useState, useEffect } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const H = { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` };

const FASES_VENTA = ["nuevo","contactado","visita programada","oferta","cerrado","no contesta","durmiente","falso"];
const FASES_CAP   = ["nuevo","contactado","visita programada","oferta","cerrado"];

const FASE_COLORS: Record<string,string> = {
 "nuevo":"#3b82f6","contactado":"#10b981","visita programada":"#f59e0b",
 "oferta":"#8b5cf6","cerrado":"#059669","no contesta":"#f97316",
 "durmiente":"#4A4540","falso":"#ef4444",
};

interface Props { password: string; }

export default function Dashboard({ password }: Props) {
 const [data, setData] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const hoy = new Date(); hoy.setHours(0,0,0,0);
   const hoyISO = hoy.toISOString();

   Promise.all([
     fetch(`${SUPABASE_URL}/rest/v1/properties?select=id,activa,destacada&activa=eq.true`, {headers:H}).then(r=>r.json()),
     fetch(`${SUPABASE_URL}/rest/v1/leads?select=id,fase,created_at`, {headers:H}).then(r=>r.json()),
     fetch(`${SUPABASE_URL}/rest/v1/captacion_leads?select=id,fase,created_at`, {headers:H}).then(r=>r.json()),
     fetch(`${SUPABASE_URL}/rest/v1/contactos?select=id,categoria,created_at`, {headers:H}).then(r=>r.json()),
   ]).then(([props, leads, captacion, contactos]) => {
     const leadsHoy = (leads||[]).filter((l:any) => l.created_at >= hoyISO).length;
     const captacionHoy = (captacion||[]).filter((l:any) => l.created_at >= hoyISO).length;
     setData({ props: props||[], leads: leads||[], captacion: captacion||[], contactos: contactos||[], leadsHoy, captacionHoy });
     setLoading(false);
   });
 }, []);

 if (loading) return <div style={{ padding:"32px", color:"#4A4540" }}>Cargando dashboard...</div>;

 const { props, leads, captacion, contactos, leadsHoy, captacionHoy } = data;

 const kpis = [
   { label:"Propiedades activas", value:props.length, sub:`${props.filter((p:any)=>p.destacada).length} destacadas`, color:"#059669", bg:"#f0fdf4" },
   { label:"Leads venta hoy", value:leadsHoy, sub:`${leads.length} total`, color:"#2563eb", bg:"#eff6ff" },
   { label:"Leads captación hoy", value:captacionHoy, sub:`${captacion.length} total`, color:"#7c3aed", bg:"#fdf4ff" },
   { label:"Contactos", value:contactos.length, sub:`${contactos.filter((c:any)=>c.created_at>=new Date(Date.now()-7*86400000).toISOString()).length} esta semana`, color:"#d97706", bg:"#fffbeb" },
 ];

 const faseCountVenta = FASES_VENTA.map(f => ({
   fase: f, count: leads.filter((l:any) => (l.fase||"nuevo") === f).length
 }));
 const faseCountCap = FASES_CAP.map(f => ({
   fase: f, count: captacion.filter((l:any) => (l.fase||"nuevo") === f).length
 }));

 return (
   <div style={{ padding:"32px", maxWidth:"1200px" }}>
     <div style={{ marginBottom:"2rem" }}>
       <p style={{ fontSize:"12px", color:"#4A4540", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Panel de Administración</p>
       <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111", margin:0 }}>Dashboard</h1>
       <p style={{ fontSize:"13px", color:"#8A847C", margin:"4px 0 0" }}>{new Date().toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
     </div>

     {/* KPIs */}
     <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
       {kpis.map(k => (
         <div key={k.label} style={{ background:k.bg, border:`1px solid ${k.color}22`, borderRadius:"12px", padding:"1.25rem" }}>
           <p style={{ fontSize:"11px", fontWeight:600, color:"#4A4540", textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 0.5rem" }}>{k.label}</p>
           <p style={{ fontSize:"2.5rem", fontWeight:800, color:k.color, margin:"0 0 0.25rem", lineHeight:1 }}>{k.value}</p>
           <p style={{ fontSize:"12px", color:"#8A847C", margin:0 }}>{k.sub}</p>
         </div>
       ))}
     </div>

     {/* Fases */}
     <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem", marginBottom:"2rem" }}>
       {/* Leads Venta por fase */}
       <div style={{ background:"white", border:"1px solid #DDD8D0", borderRadius:"12px", padding:"1.25rem" }}>
         <h2 style={{ fontSize:"14px", fontWeight:700, color:"#111", margin:"0 0 1rem" }}>Leads Venta por fase</h2>
         <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
           {faseCountVenta.filter(f=>f.count>0).map(f => (
             <div key={f.fase} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
               <div style={{ width:"80px", fontSize:"11px", color:"#1A1714", textTransform:"capitalize", flexShrink:0 }}>{f.fase}</div>
               <div style={{ flex:1, background:"#F2EDE4", borderRadius:"4px", overflow:"hidden", height:"16px" }}>
                 <div style={{ width:`${Math.min(100,(f.count/leads.length)*100)}%`, height:"100%", background:FASE_COLORS[f.fase]||"#4A4540", borderRadius:"4px", transition:"width 0.5s" }}/>
               </div>
               <span style={{ fontSize:"12px", fontWeight:700, color:FASE_COLORS[f.fase]||"#4A4540", width:"24px", textAlign:"right" }}>{f.count}</span>
             </div>
           ))}
           {leads.length === 0 && <p style={{ color:"#8A847C", fontSize:"13px" }}>Sin leads</p>}
         </div>
       </div>

       {/* Leads Captación por fase */}
       <div style={{ background:"white", border:"1px solid #DDD8D0", borderRadius:"12px", padding:"1.25rem" }}>
         <h2 style={{ fontSize:"14px", fontWeight:700, color:"#111", margin:"0 0 1rem" }}>Leads Captación por fase</h2>
         <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
           {faseCountCap.filter(f=>f.count>0).map(f => (
             <div key={f.fase} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
               <div style={{ width:"80px", fontSize:"11px", color:"#1A1714", textTransform:"capitalize", flexShrink:0 }}>{f.fase}</div>
               <div style={{ flex:1, background:"#F2EDE4", borderRadius:"4px", overflow:"hidden", height:"16px" }}>
                 <div style={{ width:`${Math.min(100,(f.count/captacion.length)*100)}%`, height:"100%", background:FASE_COLORS[f.fase]||"#4A4540", borderRadius:"4px", transition:"width 0.5s" }}/>
               </div>
               <span style={{ fontSize:"12px", fontWeight:700, color:FASE_COLORS[f.fase]||"#4A4540", width:"24px", textAlign:"right" }}>{f.count}</span>
             </div>
           ))}
           {captacion.length === 0 && <p style={{ color:"#8A847C", fontSize:"13px" }}>Sin leads</p>}
         </div>
       </div>
     </div>

     {/* Últimos leads */}
     <div style={{ background:"white", border:"1px solid #DDD8D0", borderRadius:"12px", padding:"1.25rem" }}>
       <h2 style={{ fontSize:"14px", fontWeight:700, color:"#111", margin:"0 0 1rem" }}>Últimos leads recibidos</h2>
       <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
         {[...leads, ...captacion.map((l:any)=>({...l,_tipo:"captacion"}))]
           .sort((a:any,b:any)=>b.created_at.localeCompare(a.created_at))
           .slice(0,8)
           .map((l:any) => (
             <div key={l.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background:"#FAF8F4", borderRadius:"6px" }}>
               <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                 <span style={{ fontSize:"10px", fontWeight:700, padding:"2px 8px", borderRadius:"12px", background:l._tipo==="captacion"?"#fdf4ff":"#eff6ff", color:l._tipo==="captacion"?"#7c3aed":"#2563eb" }}>
                   {l._tipo==="captacion"?"Captación":"Venta"}
                 </span>
                 <span style={{ fontSize:"13px", fontWeight:600, color:"#111" }}>{l.name}</span>
                 {l.property_title && <span style={{ fontSize:"12px", color:"#4A4540" }}>{l.property_title}</span>}
                 {l.ubicacion && <span style={{ fontSize:"12px", color:"#4A4540" }}>{l.ubicacion}</span>}
               </div>
               <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                 <span style={{ fontSize:"11px", fontWeight:600, color:FASE_COLORS[l.fase||"nuevo"], background:`${FASE_COLORS[l.fase||"nuevo"]}15`, padding:"2px 8px", borderRadius:"12px" }}>{l.fase||"nuevo"}</span>
                 <span style={{ fontSize:"11px", color:"#8A847C" }}>{new Date(l.created_at).toLocaleDateString("es-ES")}</span>
               </div>
             </div>
           ))}
       </div>
     </div>
   </div>
 );
}
