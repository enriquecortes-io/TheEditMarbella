"use client";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  password: string;
  role: string;
  created_at: string;
}

interface Props { password: string; }

const ROLES = [
  { value:"superadmin", label:"Super Admin 🔴", desc:"Acceso total" },
  { value:"agente",     label:"Agente 🟡",      desc:"Propiedades + leads propios" },
  { value:"viewer",     label:"Viewer 🟢",       desc:"Ver + crear propiedades" },
];

const INP: React.CSSProperties = {
  width:"100%", padding:"10px 12px", border:"1px solid #d1d5db",
  borderRadius:"6px", fontSize:"14px", fontFamily:"system-ui",
  outline:"none", boxSizing:"border-box", marginBottom:"12px",
};
const L: React.CSSProperties = {
  display:"block", fontSize:"11px", fontWeight:600, color:"#6b7280",
  textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"4px",
};

export default function Users({ password }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User|null>(null);
  const [form, setForm] = useState({ name:"", password:"", role:"viewer" });

  const call = async (action: string, user?: any) => {
    const res = await fetch("/api/admin/users", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ password, action, user }),
    });
    return res.json();
  };

  const fetchUsers = async () => {
    setLoading(true);
    const data = await call("list");
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.password || !form.role) {
      setStatus("❌ Todos los campos son obligatorios"); return;
    }
    setStatus("Guardando...");
    const data = editing
      ? await call("update", { ...form, id: editing.id })
      : await call("create", form);

    if (data.ok) {
      setStatus("✅ Guardado");
      setShowForm(false);
      setEditing(null);
      setForm({ name:"", password:"", role:"viewer" });
      fetchUsers();
    } else {
      setStatus(`❌ ${data.error}`);
    }
  };

  const handleEdit = (u: User) => {
    setEditing(u);
    setForm({ name:u.name, password:u.password, role:u.role });
    setShowForm(true);
  };

  const handleDelete = async (u: User) => {
    if (u.role === "superadmin") { setStatus("❌ No puedes eliminar al Super Admin"); return; }
    if (!confirm(`¿Eliminar usuario ${u.name}?`)) return;
    await call("delete", { id: u.id });
    setStatus("✅ Eliminado");
    fetchUsers();
  };

  const roleColor = (role: string) => {
    if (role==="superadmin") return { bg:"#fef2f2", color:"#991b1b" };
    if (role==="agente") return { bg:"#fef3c7", color:"#92400e" };
    return { bg:"#f0fdf4", color:"#166534" };
  };

  const roleLabel = (role: string) => {
    if (role==="superadmin") return "Super Admin 🔴";
    if (role==="agente") return "Agente 🟡";
    return "Viewer 🟢";
  };

  return (
    <div style={{ padding:"32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"24px" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 4px" }}>Panel de Administración</p>
          <h1 style={{ fontSize:"24px", fontWeight:700, color:"#111", margin:0 }}>Usuarios</h1>
        </div>
        <button onClick={()=>{ setShowForm(true); setEditing(null); setForm({name:"",password:"",role:"viewer"}); }}
          style={{ padding:"10px 20px", background:"#16a34a", color:"white", border:"none", borderRadius:"8px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
          ➕ Nuevo Usuario
        </button>
      </div>

      {status && (
        <div style={{ padding:"10px 16px", borderRadius:"6px", marginBottom:"16px",
          background:status.startsWith("✅")?"#f0fdf4":"#fef2f2",
          border:`1px solid ${status.startsWith("✅")?"#86efac":"#fca5a5"}`,
          color:status.startsWith("✅")?"#166534":"#991b1b", fontSize:"13px" }}>
          {status}
        </div>
      )}

      {/* Tabla usuarios */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"60px", color:"#6b7280" }}>Cargando...</div>
      ) : (
        <div style={{ background:"white", borderRadius:"12px", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", overflow:"hidden", marginBottom:"32px" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"2px solid #f3f4f6" }}>
                {["Nombre","Contraseña","Rol","Fecha alta","Acciones"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u,i)=>(
                <tr key={u.id} style={{ borderBottom:"1px solid #f3f4f6", background:i%2===0?"white":"#fafafa" }}>
                  <td style={{ padding:"14px 16px", fontWeight:600, fontSize:"14px", color:"#111" }}>{u.name}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <code style={{ fontSize:"13px", color:"#6b7280", background:"#f3f4f6", padding:"3px 8px", borderRadius:"4px" }}>
                      {u.password}
                    </code>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ padding:"4px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:600, ...roleColor(u.role) }}>
                      {roleLabel(u.role)}
                    </span>
                  </td>
                  <td style={{ padding:"14px 16px", fontSize:"12px", color:"#6b7280" }}>
                    {new Date(u.created_at).toLocaleDateString("es-ES")}
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", gap:"8px" }}>
                      <button onClick={()=>handleEdit(u)}
                        style={{ padding:"6px 12px", background:"#eff6ff", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#1d4ed8" }}>
                        Editar
                      </button>
                      {u.role !== "superadmin" && (
                        <button onClick={()=>handleDelete(u)}
                          style={{ padding:"6px 12px", background:"#fef2f2", border:"none", borderRadius:"6px", fontSize:"12px", cursor:"pointer", color:"#991b1b" }}>
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Permisos por rol */}
      <div style={{ background:"white", borderRadius:"12px", boxShadow:"0 1px 8px rgba(0,0,0,0.06)", padding:"24px" }}>
        <h2 style={{ fontSize:"16px", fontWeight:700, color:"#111", margin:"0 0 20px" }}>Permisos por Rol</h2>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              <th style={{ padding:"10px 16px", textAlign:"left", color:"#6b7280", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Función</th>
              <th style={{ padding:"10px 16px", textAlign:"center", color:"#991b1b", fontSize:"11px" }}>Super Admin 🔴</th>
              <th style={{ padding:"10px 16px", textAlign:"center", color:"#92400e", fontSize:"11px" }}>Agente 🟡</th>
              <th style={{ padding:"10px 16px", textAlign:"center", color:"#166534", fontSize:"11px" }}>Viewer 🟢</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Ver propiedades",        true, true,  true],
              ["Crear propiedades",      true, true,  true],
              ["Editar propiedades",     true, true,  false],
              ["Eliminar propiedades",   true, false, false],
              ["Ver todos los leads",    true, false, false],
              ["Ver leads propios",      true, true,  false],
              ["Cruce de ventas",        true, true,  false],
              ["Portales / Feeds",       true, false, false],
              ["Gestionar usuarios",     true, false, false],
            ].map(([fn, sa, ag, vi])=>(
              <tr key={fn as string} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 16px", color:"#374151" }}>{fn as string}</td>
                {[sa,ag,vi].map((v,i)=>(
                  <td key={i} style={{ padding:"10px 16px", textAlign:"center" }}>
                    {v ? "✅" : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal nuevo/editar usuario */}
      {showForm && (
        <div onClick={()=>setShowForm(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"white", borderRadius:"12px", padding:"32px", width:"100%", maxWidth:"440px" }}>
            <h2 style={{ fontSize:"18px", fontWeight:700, marginBottom:"24px", color:"#111" }}>
              {editing ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <label style={L}>Nombre</label>
            <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
              placeholder="Ej: María García" style={INP}/>

            <label style={L}>Contraseña</label>
            <input value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
              placeholder="Contraseña de acceso" style={INP}/>

            <label style={L}>Rol</label>
            <select value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} style={INP}>
              {ROLES.map(r=>(
                <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
              ))}
            </select>

            {status && (
              <div style={{ padding:"10px", borderRadius:"6px", marginBottom:"16px",
                background:status.startsWith("✅")?"#f0fdf4":"#fef2f2",
                color:status.startsWith("✅")?"#166534":"#991b1b", fontSize:"13px" }}>
                {status}
              </div>
            )}

            <div style={{ display:"flex", gap:"12px" }}>
              <button onClick={()=>setShowForm(false)} style={{ flex:1, padding:"10px", background:"#f3f4f6", border:"none", borderRadius:"6px", fontSize:"13px", cursor:"pointer" }}>
                Cancelar
              </button>
              <button onClick={handleSave} style={{ flex:2, padding:"10px", background:"#16a34a", color:"white", border:"none", borderRadius:"6px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
                {editing ? "Guardar Cambios" : "Crear Usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
