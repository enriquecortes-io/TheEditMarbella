"use client";
import { forwardRef, useState } from "react";

interface Props { locale: string; }

const TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    eyebrow: "Propietarios",
    title: "Confíanos tu Legado",
    subtitle: "No vendemos propiedades. Editamos su historia para el comprador correcto.",
    s1: "Valoración Estratégica",
    s1d: "Precio óptimo basado en datos de mercado premium y demanda internacional.",
    s2: "Producción Editorial",
    s2d: "Fotografía y video cinematográfico que transforma tu propiedad en obra de arte.",
    s3: "Alcance Global",
    s3d: "Red de compradores HNWI en 40+ países. Venta discreta o exposición máxima.",
    s4: "Acompañamiento Total",
    s4d: "Gestión legal, fiscal y notarial desde la valoración hasta la escritura.",
    formTitle: "Solicita una Valoración Privada",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    ubicacion: "Ubicación de la propiedad",
    precio: "Precio estimado",
    mensaje: "Mensaje (opcional)",
    send: "Solicitar valoración",
    sending: "Enviando...",
    sent: "Solicitud recibida. Le contactaremos en 24h.",
    error: "Error al enviar. Inténtelo de nuevo.",
  },
  en: {
    eyebrow: "Property Owners",
    title: "Entrust Us Your Legacy",
    subtitle: "We don't sell properties. We edit their story for the right buyer.",
    s1: "Strategic Valuation",
    s1d: "Optimal pricing based on premium market data and international demand.",
    s2: "Editorial Production",
    s2d: "Cinematic photography and video that transforms your property into art.",
    s3: "Global Reach",
    s3d: "HNWI buyer network across 40+ countries. Discreet or maximum exposure.",
    s4: "Full Accompaniment",
    s4d: "Legal, tax and notarial management from valuation to completion.",
    formTitle: "Request a Private Valuation",
    name: "Name",
    email: "Email",
    phone: "Phone",
    ubicacion: "Property location",
    precio: "Estimated price",
    mensaje: "Message (optional)",
    send: "Request valuation",
    sending: "Sending...",
    sent: "Request received. We will contact you within 24h.",
    error: "Error sending. Please try again.",
  },
  fr: {
    eyebrow: "Propriétaires",
    title: "Confiez-nous Votre Héritage",
    subtitle: "Nous ne vendons pas des propriétés. Nous éditons leur histoire pour le bon acheteur.",
    s1: "Évaluation Stratégique",
    s1d: "Prix optimal basé sur les données du marché premium et la demande internationale.",
    s2: "Production Éditoriale",
    s2d: "Photographie et vidéo cinématographique qui transforme votre propriété en œuvre d'art.",
    s3: "Portée Mondiale",
    s3d: "Réseau d'acheteurs HNWI dans 40+ pays. Vente discrète ou exposition maximale.",
    s4: "Accompagnement Total",
    s4d: "Gestion juridique, fiscale et notariale de l'évaluation à la signature.",
    formTitle: "Demander une Évaluation Privée",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    ubicacion: "Emplacement du bien",
    precio: "Prix estimé",
    mensaje: "Message (optionnel)",
    send: "Demander l'évaluation",
    sending: "Envoi...",
    sent: "Demande reçue. Nous vous contacterons sous 24h.",
    error: "Erreur d'envoi. Veuillez réessayer.",
  },
  ru: {
    eyebrow: "Владельцам",
    title: "Доверьте нам своё Наследие",
    subtitle: "Мы не продаём недвижимость. Мы редактируем её историю для правильного покупателя.",
    s1: "Стратегическая Оценка",
    s1d: "Оптимальная цена на основе данных премиального рынка и международного спроса.",
    s2: "Редакционное Производство",
    s2d: "Кинематографическая фотография и видео, превращающие вашу недвижимость в произведение искусства.",
    s3: "Глобальный Охват",
    s3d: "Сеть покупателей HNWI в 40+ странах. Дискретная продажа или максимальная экспозиция.",
    s4: "Полное Сопровождение",
    s4d: "Юридическое, налоговое и нотариальное сопровождение от оценки до сделки.",
    formTitle: "Запросить Частную Оценку",
    name: "Имя",
    email: "Email",
    phone: "Телефон",
    ubicacion: "Расположение объекта",
    precio: "Ориентировочная цена",
    mensaje: "Сообщение (необязательно)",
    send: "Запросить оценку",
    sending: "Отправка...",
    sent: "Запрос получен. Свяжемся с вами в течение 24ч.",
    error: "Ошибка отправки. Попробуйте снова.",
  },
};

const PRICES = ["< 1M €", "1M – 3M €", "3M – 7M €", "7M – 15M €", "+ 15M €"];

const SERVICES = (t: Record<string, string>) => [
  { icon:"◆", title:t.s1, desc:t.s1d },
  { icon:"◈", title:t.s2, desc:t.s2d },
  { icon:"◉", title:t.s3, desc:t.s3d },
  { icon:"◎", title:t.s4, desc:t.s4d },
];

const INP: React.CSSProperties = {
  width:"100%", background:"rgba(255,255,255,0.04)",
  border:"1px solid rgba(201,169,110,0.2)",
  color:"white", padding:"0.9rem 1rem",
  fontFamily:"'Montserrat',sans-serif", fontSize:"0.7rem",
  letterSpacing:"0.05em", outline:"none", boxSizing:"border-box",
  transition:"border-color 0.3s",
};

const Captacion = forwardRef<HTMLDivElement, Props>(({ locale }, ref) => {
  const t = TRANSLATIONS[locale] || TRANSLATIONS["es"];
  const [form, setForm] = useState({ name:"", email:"", phone:"", ubicacion:"", precio_estimado:"", mensaje:"" });
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/captacion", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      setStatus(data.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div ref={ref} style={{
      position:"absolute", inset:0, zIndex:23,
      opacity:0, pointerEvents:"none",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"clamp(1rem,3vw,3rem)",
      overflowY:"auto",
      willChange:"opacity",
    }}>
      <div style={{
        width:"100%", maxWidth:"1200px",
        display:"grid", gridTemplateColumns:"1fr 1fr",
        gap:"clamp(2rem,4vw,4rem)",
        background:"rgba(6,4,2,0.6)",
        border:"1px solid rgba(201,169,110,0.25)",
        backdropFilter:"blur(30px)",
        padding:"clamp(2rem,4vw,4rem)",
        boxSizing:"border-box",
        position:"relative",
      }}>
        {/* Línea dorada superior */}
        <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(201,169,110,0.8),transparent)" }}/>

        {/* Columna izquierda — Propuesta de valor */}
        <div style={{ display:"flex", flexDirection:"column", gap:"2rem" }}>
          <div>
            <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.5rem", color:"rgba(201,169,110,0.7)", letterSpacing:"0.5em", textTransform:"uppercase", margin:"0 0 1rem" }}>{t.eyebrow}</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2.2rem,3.5vw,3.5rem)", fontWeight:600, color:"white", lineHeight:1.1, margin:"0 0 1rem", fontStyle:"italic" }}>{t.title}</h2>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.9rem,1.2vw,1.1rem)", color:"rgba(255,255,255,0.85)", lineHeight:1.7, margin:0, fontStyle:"italic" }}>{t.subtitle}</p>
          </div>

          <div style={{ width:"2rem", height:"1px", background:"rgba(201,169,110,0.4)" }}/>

          {/* Servicios */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>
            {SERVICES(t).map((s, i) => (
              <div key={i} style={{ display:"flex", gap:"1rem", alignItems:"flex-start" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"rgba(201,169,110,0.6)", flexShrink:0, marginTop:"0.1rem" }}>{s.icon}</span>
                <div>
                  <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", color:"rgba(201,169,110,1)", letterSpacing:"0.3em", textTransform:"uppercase", margin:"0 0 0.3rem" }}>{s.title}</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(0.9rem,1.1vw,1.05rem)", color:"rgba(255,255,255,0.8)", lineHeight:1.6, margin:0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha — Formulario */}
        <div style={{ display:"flex", flexDirection:"column", gap:"1rem", borderLeft:"1px solid rgba(201,169,110,0.1)", paddingLeft:"clamp(1.5rem,3vw,3rem)" }}>
          <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem", color:"rgba(201,169,110,0.9)", letterSpacing:"0.4em", textTransform:"uppercase", margin:"0 0 0.5rem" }}>{t.formTitle}</p>

          {status === "sent" ? (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", color:"#c9a96e", textAlign:"center", fontStyle:"italic", lineHeight:1.6 }}>{t.sent}</p>
            </div>
          ) : (
            <>
              {[
                { key:"name",      label:t.name,      type:"text" },
                { key:"email",     label:t.email,     type:"email" },
                { key:"phone",     label:t.phone,     type:"tel" },
                { key:"ubicacion", label:t.ubicacion, type:"text" },
              ].map(f => (
                <div key={f.key}>
                  <input
                    type={f.type}
                    placeholder={f.label}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                    style={INP}
                    onFocus={e => e.target.style.borderColor = "rgba(201,169,110,0.6)"}
                    onBlur={e => e.target.style.borderColor = "rgba(201,169,110,0.2)"}
                  />
                </div>
              ))}

              {/* Precio estimado — selector visual */}
              <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap" }}>
                {PRICES.map((p: string) => (
                  <button key={p} onClick={() => setForm(f => ({...f, precio_estimado: p}))}
                    style={{
                      fontFamily:"'Montserrat',sans-serif", fontSize:"0.38rem",
                      letterSpacing:"0.2em", padding:"0.4rem 0.7rem",
                      border:`1px solid rgba(201,169,110,${form.precio_estimado === p ? 0.8 : 0.2})`,
                      background: form.precio_estimado === p ? "rgba(201,169,110,0.12)" : "transparent",
                      color: form.precio_estimado === p ? "#c9a96e" : "rgba(255,255,255,0.4)",
                      cursor:"pointer", transition:"all 0.2s",
                    }}>
                    {p}
                  </button>
                ))}
              </div>

              <textarea
                placeholder={t.mensaje}
                value={form.mensaje}
                onChange={e => setForm(p => ({...p, mensaje: e.target.value}))}
                rows={3}
                style={{...INP, resize:"none"}}
                onFocus={e => e.target.style.borderColor = "rgba(201,169,110,0.6)"}
                onBlur={e => e.target.style.borderColor = "rgba(201,169,110,0.2)"}
              />

              {status === "error" && (
                <p style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"0.4rem", color:"rgba(255,100,100,0.8)", letterSpacing:"0.2em" }}>{t.error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={status === "sending"}
                style={{
                  fontFamily:"'Montserrat',sans-serif", fontSize:"0.6rem",
                  letterSpacing:"0.45em", textTransform:"uppercase",
                  color:"rgba(201,169,110,0.9)", background:"transparent",
                  border:"1px solid rgba(201,169,110,0.4)",
                  padding:"1rem", cursor:"pointer",
                  transition:"all 0.3s", marginTop:"0.5rem",
                  opacity: status === "sending" ? 0.6 : 1,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(201,169,110,0.08)";
                  e.currentTarget.style.borderColor = "rgba(201,169,110,0.8)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(201,169,110,0.4)";
                }}
              >
                {status === "sending" ? t.sending : t.send}
              </button>
            </>
          )}
        </div>

        {/* Línea dorada inferior */}
        <div style={{ position:"absolute", bottom:0, left:"10%", right:"10%", height:"1px", background:"linear-gradient(90deg,transparent,rgba(201,169,110,0.4),transparent)", gridColumn:"1/-1" }}/>
      </div>
    </div>
  );
});

Captacion.displayName = "Captacion";
export default Captacion;
