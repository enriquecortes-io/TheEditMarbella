"use client";
import { useState } from "react";

interface Props {
  locale: string;
  propertyTitle: string;
  propertySlug: string;
}

const COPY = {
  es: {
    label: "ACCESO PRIVADO",
    headline: "Esta propiedad no se anuncia públicamente.",
    sub: "Para conocer condiciones y concertar una visita privada, identifíquese como comprador cualificado.",
    disclaimer: "Nuestro servicio de representación exclusiva tiene honorarios. Trabajamos únicamente con compradores serios.",
    fields: {
      name: "Nombre completo",
      email: "Email",
      phone: "Teléfono",
      horizon: "¿Cuál es su horizonte de inversión?",
      horizonOpts: ["3 meses","6 meses","1 año","Flexible"],
    },
    submit: "Solicitar Acceso Privado",
    success: "Su solicitud ha sido recibida. Nos pondremos en contacto en menos de 24 horas.",
    sending: "Enviando...",
  },
  en: {
    label: "PRIVATE ACCESS",
    headline: "This property is not publicly listed.",
    sub: "To learn about terms and arrange a private viewing, please identify yourself as a qualified buyer.",
    disclaimer: "Our exclusive representation service carries a fee. We work only with serious buyers.",
    fields: {
      name: "Full name",
      email: "Email",
      phone: "Phone",
      horizon: "What is your investment horizon?",
      horizonOpts: ["3 months","6 months","1 year","Flexible"],
    },
    submit: "Request Private Access",
    success: "Your request has been received. We will be in touch within 24 hours.",
    sending: "Sending...",
  },
  fr: {
    label: "ACCÈS PRIVÉ",
    headline: "Cette propriété n'est pas annoncée publiquement.",
    sub: "Pour connaître les conditions et organiser une visite privée, identifiez-vous en tant qu'acheteur qualifié.",
    disclaimer: "Notre service de représentation exclusive est payant. Nous travaillons uniquement avec des acheteurs sérieux.",
    fields: {
      name: "Nom complet",
      email: "Email",
      phone: "Téléphone",
      horizon: "Quel est votre horizon d'investissement?",
      horizonOpts: ["3 mois","6 mois","1 an","Flexible"],
    },
    submit: "Demander l'Accès Privé",
    success: "Votre demande a été reçue. Nous vous contacterons dans les 24 heures.",
    sending: "Envoi en cours...",
  },
  ru: {
    label: "ЧАСТНЫЙ ДОСТУП",
    headline: "Этот объект не размещён в открытом доступе.",
    sub: "Для получения условий и организации частного просмотра идентифицируйте себя как квалифицированного покупателя.",
    disclaimer: "Наша служба эксклюзивного представительства является платной. Мы работаем только с серьёзными покупателями.",
    fields: {
      name: "Полное имя",
      email: "Email",
      phone: "Телефон",
      horizon: "Каков ваш инвестиционный горизонт?",
      horizonOpts: ["3 месяца","6 месяцев","1 год","Гибко"],
    },
    submit: "Запросить Частный Доступ",
    success: "Ваш запрос получен. Мы свяжемся с вами в течение 24 часов.",
    sending: "Отправка...",
  },
} as const;

type Locale = keyof typeof COPY;

export default function PrivateAccessForm({ locale, propertyTitle, propertySlug }: Props) {
  const lang = (["es","en","fr","ru"].includes(locale) ? locale : "en") as Locale;
  const c = COPY[lang];

  const [form, setForm] = useState({ name:"", email:"", phone:"", horizon:"" });
  const [status, setStatus] = useState<"idle"|"sending"|"done"|"error">("idle");
  const [focused, setFocused] = useState<string|null>(null);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.horizon) return;
    setStatus("sending");
    try {
      await fetch("/api/contact", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ ...form, propertyTitle, propertySlug, locale }),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle = (field: string) => ({
    width:"100%",
    background:"transparent",
    border:"none",
    borderBottom:`1px solid rgba(255,255,255,${focused===field?0.4:0.12})`,
    color:"white",
    fontFamily:"'Helvetica Neue',sans-serif",
    fontSize:"clamp(0.8rem,1.4vw,1.1rem)",
    fontWeight:200,
    padding:"0.8rem 0",
    outline:"none",
    letterSpacing:"0.02em",
    transition:"border-color 0.3s ease",
  } as React.CSSProperties);

  return (
<div style={{ width:"100%" }}>
      <div style={{ maxWidth:"680px", width:"100%" }}>

        {/* Label */}
        <p style={{
          fontFamily:"'Helvetica Neue',sans-serif",
          fontSize:"0.5rem", fontWeight:300,
          color:"rgba(201,169,110,0.7)",
          letterSpacing:"0.6em", textTransform:"uppercase",
          marginBottom:"3rem",
        }}>{c.label}</p>

        {/* Headline */}
        <h2 style={{
          fontFamily:"'Helvetica Neue',sans-serif",
          fontSize:"clamp(1.6rem,3vw,2.8rem)",
          fontWeight:100,
          color:"rgba(255,255,255,0.92)",
          letterSpacing:"-0.02em",
          lineHeight:1.2,
          margin:"0 0 1.5rem",
        }}>{c.headline}</h2>

        <p style={{
          fontFamily:"'Helvetica Neue',sans-serif",
          fontSize:"clamp(0.7rem,1.2vw,0.95rem)",
          fontWeight:200,
          color:"rgba(255,255,255,0.45)",
          lineHeight:1.8,
          margin:"0 0 4rem",
          letterSpacing:"0.01em",
        }}>{c.sub}</p>

        {status === "done" ? (
          <div style={{
            padding:"3rem",
            border:"1px solid rgba(201,169,110,0.3)",
            textAlign:"center",
          }}>
            <div style={{ color:"#c9a96e", fontSize:"1.5rem", marginBottom:"1rem" }}>✦</div>
            <p style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"clamp(0.8rem,1.2vw,1rem)",
              fontWeight:200, color:"rgba(255,255,255,0.7)",
              letterSpacing:"0.02em", lineHeight:1.8,
            }}>{c.success}</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"2.5rem" }}>

            {/* Nombre */}
            <div>
              <label style={{ display:"block", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.5em", textTransform:"uppercase", marginBottom:"0.5rem" }}>
                {c.fields.name}
              </label>
              <input
                type="text" value={form.name}
                onChange={e => setForm(p=>({...p,name:e.target.value}))}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                style={inputStyle("name")}
              />
            </div>

            {/* Email + Telefono en fila */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem" }}>
              <div>
                <label style={{ display:"block", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.5em", textTransform:"uppercase", marginBottom:"0.5rem" }}>
                  {c.fields.email}
                </label>
                <input
                  type="email" value={form.email}
                  onChange={e => setForm(p=>({...p,email:e.target.value}))}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  style={inputStyle("email")}
                />
              </div>
              <div>
                <label style={{ display:"block", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.5em", textTransform:"uppercase", marginBottom:"0.5rem" }}>
                  {c.fields.phone}
                </label>
                <input
                  type="tel" value={form.phone}
                  onChange={e => setForm(p=>({...p,phone:e.target.value}))}
                  onFocus={() => setFocused("phone")}
                  onBlur={() => setFocused(null)}
                  style={inputStyle("phone")}
                />
              </div>
            </div>

            {/* Horizonte */}
            <div>
              <label style={{ display:"block", fontFamily:"'Helvetica Neue',sans-serif", fontSize:"0.4rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.5em", textTransform:"uppercase", marginBottom:"0.8rem" }}>
                {c.fields.horizon}
              </label>
              <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
                {c.fields.horizonOpts.map(opt => (
                  <button key={opt}
                    onClick={() => setForm(p=>({...p,horizon:opt}))}
                    style={{
                      background: form.horizon===opt ? "rgba(201,169,110,0.08)" : "none",
                      border:`1px solid rgba(255,255,255,${form.horizon===opt?0.4:0.1})`,
                      color: form.horizon===opt ? "#c9a96e" : "rgba(255,255,255,0.35)",
                      fontFamily:"'Helvetica Neue',sans-serif",
                      fontSize:"0.5rem", letterSpacing:"0.2em",
                      padding:"0.7rem 1.5rem", cursor:"pointer",
                      transition:"all 0.3s ease",
                    } as React.CSSProperties}
                  >{opt}</button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p style={{
              fontFamily:"'Helvetica Neue',sans-serif",
              fontSize:"0.45rem", fontWeight:200,
              color:"rgba(255,255,255,0.2)",
              letterSpacing:"0.02em", lineHeight:1.8,
              borderLeft:"1px solid rgba(201,169,110,0.2)",
              paddingLeft:"1rem",
            }}>{c.disclaimer}</p>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={status==="sending" || !form.name || !form.email || !form.phone || !form.horizon}
              style={{
                background:"none",
                border:`1px solid rgba(201,169,110,${!form.name||!form.email||!form.phone||!form.horizon?0.2:0.5})`,
                color: !form.name||!form.email||!form.phone||!form.horizon ? "rgba(201,169,110,0.3)" : "#c9a96e",
                fontFamily:"'Helvetica Neue',sans-serif",
                fontSize:"0.5rem", letterSpacing:"0.6em",
                textTransform:"uppercase", padding:"1.2rem 3rem",
                cursor: !form.name||!form.email||!form.phone||!form.horizon ? "default" : "pointer",
                transition:"all 0.4s ease",
                alignSelf:"flex-start",
              }}
              onMouseEnter={e => {
                if (form.name&&form.email&&form.phone&&form.horizon)
                  e.currentTarget.style.background="rgba(201,169,110,0.1)";
              }}
              onMouseLeave={e => { e.currentTarget.style.background="none"; }}
            >
              {status==="sending" ? c.sending : c.submit}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
