"use client";
import { useState, useEffect } from "react";
import NewProperty from "./NewProperty";
import Portfolio from "./Portfolio";
import Leads from "./Leads";
import CruceVentas from "./CruceVentas";

type Section = "portfolio" | "new" | "leads" | "cruce";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);
  const [authError, setAuthError] = useState("");
  const [section, setSection] = useState<Section>("portfolio");

  useEffect(() => {
    if (localStorage.getItem("mdlm_admin") === "mdlm2026secure") {
      setAuth(true);
      setPassword("mdlm2026secure");
    }
  }, []);

  const handleAuth = () => {
    if (password === "mdlm2026secure") {
      setAuth(true);
      localStorage.setItem("mdlm_admin", "mdlm2026secure");
    } else setAuthError("Contraseña incorrecta");
  };

  if (!auth) return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"white", padding:"40px", borderRadius:"12px", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", width:"360px" }}>
        <h2 style={{ fontFamily:"system-ui", fontSize:"20px", fontWeight:700, marginBottom:"8px", color:"#111" }}>
          Million Dollars Listing
        </h2>
        <p style={{ fontSize:"13px", color:"#6b7280", marginBottom:"24px", fontFamily:"system-ui" }}>Panel de Administración</p>
        <label style={{ display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"4px", fontFamily:"system-ui" }}>
          Contraseña
        </label>
        <input type="password" name="password" autoComplete="current-password"
          value={password} onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&handleAuth()}
          style={{ width:"100%", padding:"10px 12px", border:"1px solid #d1d5db", borderRadius:"6px", fontSize:"14px", fontFamily:"system-ui", outline:"none", boxSizing:"border-box", marginBottom:"12px" }}
          placeholder="••••••••"
        />
        <button onClick={handleAuth} style={{ width:"100%", padding:"10px", background:"#111", color:"white", border:"none", borderRadius:"6px", fontSize:"14px", fontWeight:600, cursor:"pointer", fontFamily:"system-ui" }}>
          Entrar
        </button>
        {authError && <p style={{ color:"#ef4444", marginTop:"12px", fontSize:"13px", fontFamily:"system-ui" }}>{authError}</p>}
      </div>
    </div>
  );

  const NAV: { id: Section; icon: string; label: string }[] = [
    { id:"new",       icon:"➕", label:"Nueva Propiedad", green:true },
    { id:"portfolio", icon:"🏠", label:"Portfolio" },
    { id:"leads",     icon:"👥", label:"Leads" },
    { id:"cruce",     icon:"🔗", label:"Cruce de Ventas" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f9fafb", fontFamily:"system-ui" }}>

      {/* Sidebar */}
      <div style={{ width:"220px", background:"#111", minHeight:"100vh", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"24px 20px 16px" }}>
          <p style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 4px" }}>MDLM</p>
          <p style={{ fontSize:"14px", color:"white", fontWeight:600, margin:0 }}>Admin Panel</p>
        </div>

        <div style={{ height:"1px", background:"rgba(255,255,255,0.08)", margin:"0 20px 16px" }}/>

        <nav style={{ flex:1, padding:"0 12px" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={()=>setSection(item.id)}
              style={{
                display:"flex", alignItems:"center", gap:"10px",
                width:"100%", padding:"10px 12px",
                background: (item as any).green && section!==item.id
                  ? "rgba(22,163,74,0.2)"
                  : section===item.id ? "rgba(255,255,255,0.1)" : "none",
                border: (item as any).green ? "1px solid rgba(22,163,74,0.4)" : "none",
                borderRadius:"8px",
                color: (item as any).green
                  ? "#4ade80"
                  : section===item.id ? "white" : "rgba(255,255,255,0.5)",
                fontSize:"13px", fontWeight: section===item.id || (item as any).green ? 600 : 400,
                cursor:"pointer", textAlign:"left",
                transition:"all 0.15s",
                marginBottom:"4px",
              }}>
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={()=>{ localStorage.removeItem("mdlm_admin"); setAuth(false); }}
            style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", fontSize:"12px", cursor:"pointer", padding:0 }}>
            Cerrar sesión →
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, overflow:"auto" }}>
        {section === "portfolio" && <Portfolio password={password} onEdit={()=>setSection("new")} />}
        {section === "new" && <NewProperty password={password} />}
        {section === "leads" && <Leads password={password} />}
        {section === "cruce" && <CruceVentas password={password} />}
      </div>
    </div>
  );
}
