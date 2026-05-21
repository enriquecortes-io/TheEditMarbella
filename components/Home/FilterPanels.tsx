"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const FILTERS = [
  {
    id:"zona", index:"01", label:"ZONA", question:"WHERE",
    accent:"#c9a96e", accentRgb:"201,169,110",
    options:[
      { v:"marbella",   l:"Marbella",   sub:"36°30'N · 4°53'W", subKey:"" },
      { v:"estepona",   l:"Estepona",   sub:"36°25'N · 5°08'W", subKey:"" },
      { v:"mijas",      l:"Mijas",      sub:"36°35'N · 4°38'W", subKey:"" },
      { v:"benahavis",  l:"Benahavís",  sub:"36°31'N · 5°02'W", subKey:"" },
      { v:"sotogrande", l:"Sotogrande", sub:"36°17'N · 5°23'W", subKey:"" },
    ],
  },
  {
    id:"tipo", index:"02", label:"TIPO", question:"WHAT",
    accent:"#d4c4a8", accentRgb:"212,196,168",
    options:[
      { v:"villa",     l:"Villa",     sub:"", subKey:"villa" },
      { v:"apartment", l:"Apartment", sub:"", subKey:"apartment" },
      { v:"townhouse", l:"Townhouse", sub:"", subKey:"townhouse" },
      { v:"plot",      l:"Plot",      sub:"", subKey:"plot" },
    ],
  },
  {
    id:"precio", index:"03", label:"PRECIO", question:"HOW",
    accent:"#b8a898", accentRgb:"184,168,152",
    options:[
      { v:"500k-1m", l:"500K – 1M",  sub:"", subKey:"500k-1m" },
      { v:"1m-2m",   l:"1M – 2M",    sub:"", subKey:"1m-2m" },
      { v:"2m-5m",   l:"2M – 5M",    sub:"", subKey:"2m-5m" },
      { v:"5m+",     l:"5M +",       sub:"", subKey:"5m+" },
    ],
  },
];

import { getT } from "@/lib/i18n";

interface Props {
  locale: string;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

export default function FilterPanels({ locale, panelRefs }: Props) {
  const pathname = usePathname();
  const urlLocale = pathname.split("/")[1] || locale;
  const t = getT(urlLocale);
  const tf = t.filters;
  const [activePanel, setActivePanel] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSub = (filterId: string, opt: Record<string,any>) => {
    if (filterId === "tipo" && opt.subKey) return (tf as any).tipo_subs?.[opt.subKey] || opt.subKey;
    if (filterId === "precio" && opt.subKey) return (tf as any).precio_subs?.[opt.subKey] || opt.subKey;
    return opt.sub || "";
  };

  const filterLabels: Record<string,string> = {
    zona: tf.zona.label,
    tipo: tf.tipo.label,
    precio: tf.precio.label,
  };
  const filterQuestions: Record<string,string> = {
    zona: tf.zona.question,
    tipo: tf.tipo.question,
    precio: tf.precio.question,
  };
  const [selected, setSelected] = useState<Record<string,string>>({});
  const [hoveredOpt, setHoveredOpt] = useState<string|null>(null);
  const router = useRouter();

  const handleSelect = (filterId: string, value: string, idx: number) => {
    setSelected(prev => ({ ...prev, [filterId]: value }));
    if (idx < FILTERS.length - 1) {
      const next = idx + 1;
      setTimeout(() => {
        setActivePanel(next);
        (window as any).__advancePanel?.(next);
      }, 400);
    }
  };

  const handleBack = (idx: number) => {
    if (idx > 0) {
      const prev = idx - 1;
      setActivePanel(prev);
      setSelected(prev2 => {
        const copy = { ...prev2 };
        delete copy[FILTERS[idx].id];
        return copy;
      });
      (window as any).__advancePanel?.(prev);
    }
  };

  const allSelected = Object.keys(selected).length === FILTERS.length;

  return (
    <>
      <style>{`
        @keyframes questionReveal {
          0%   { opacity:0; transform:translateY(22px); filter:blur(8px); }
          100% { opacity:1; transform:translateY(0);    filter:blur(0); }
        }
        .q-anim { animation: questionReveal 0.8s cubic-bezier(0.16,1,0.3,1) both; }

        .fopt {
          cursor: pointer;
          transition: background 0.35s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .fopt:hover { background: rgba(255,255,255,0.05) !important; }
        .back-btn { transition: all 0.3s ease; cursor:pointer; }
        .back-btn:hover { color: rgba(255,255,255,0.7) !important; }

        /* RESPONSIVE */
        .filter-panel {
          position: absolute;
          top: 50%; left: 50%;
          /* Desktop */
          width: 58vw;
          height: 80vh;
          margin-left: -29vw;
          margin-top: -40vh;
        }
        .filter-options {
          grid-template-columns: repeat(var(--cols), 1fr);
        }
        .filter-question {
          font-size: clamp(1.4rem, 2.8vw, 2.8rem);
        }
        .filter-label {
          font-size: clamp(0.85rem, 1.5vw, 1.4rem);
        }
        .filter-sub {
          font-size: clamp(0.55rem, 1vw, 0.75rem);
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .filter-panel {
            width: 88vw !important;
            margin-left: -44vw !important;
          }
          .filter-question { font-size: clamp(1.3rem, 3.5vw, 2.2rem) !important; }
          .filter-label    { font-size: clamp(0.8rem, 2vw, 1.2rem) !important; }
          .filter-sub      { font-size: clamp(0.5rem, 1.2vw, 0.7rem) !important; }
        }

        /* Mobile — opciones en 2 columnas o 1 */
        @media (max-width: 640px) {
          .filter-panel {
            width: 94vw !important;
            height: 90vh !important;
            margin-left: -47vw !important;
            margin-top: -45vh !important;
          }
          .filter-options-zona   { grid-template-columns: repeat(2, 1fr) !important; }
          .filter-options-tipo   { grid-template-columns: repeat(2, 1fr) !important; }
          .filter-options-precio { grid-template-columns: repeat(2, 1fr) !important; }
          .filter-question { font-size: clamp(1.2rem, 5vw, 1.8rem) !important; }
          .filter-label    { font-size: clamp(0.8rem, 3.5vw, 1.1rem) !important; }
          .filter-sub      { font-size: clamp(0.5rem, 2.5vw, 0.65rem) !important; }
        }
      `}</style>

      {FILTERS.map((filter, i) => (
        <div
          key={filter.id}
          ref={el => { panelRefs.current[i] = el; }}
          className="filter-panel"
          style={{
            willChange:"transform,opacity,filter",
            background:"rgba(6,4,2,0.55)",
            backdropFilter:"blur(50px) saturate(150%)",
            WebkitBackdropFilter:"blur(50px) saturate(150%)",
            border:`1px solid rgba(${filter.accentRgb},0.18)`,
            boxShadow:`0 0 0 1px rgba(255,255,255,0.04),0 20px 60px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.08)`,
            overflow:"hidden",
            display:"flex",
            flexDirection:"column",
          }}
        >
          {/* Barra acento superior */}
          <div style={{position:"absolute",top:0,left:"10%",right:"10%",height:"1px",background:`linear-gradient(90deg,transparent,rgba(${filter.accentRgb},0.8),transparent)`}}/>

          {/* Header */}
          <div style={{padding:"2.5rem 3rem 0",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
              {i > 0 && (
                <button className="back-btn" onClick={()=>handleBack(i)}
                  style={{background:"none",border:"none",padding:0,color:"rgba(255,255,255,0.25)",fontFamily:"'Montserrat',sans-serif",fontSize:"0.6rem",letterSpacing:"0.3em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:"0.4rem",cursor:"pointer"}}>
                  {tf.back}
                </button>
              )}
              <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:"0.6rem",fontWeight:300,color:`rgba(${filter.accentRgb},0.8)`,letterSpacing:"0.65em",textTransform:"uppercase"}}>
                {filterLabels[filter.id] || filter.label}
              </span>
            </div>
            <span style={{fontFamily:"'Montserrat',sans-serif",fontSize:"0.6rem",fontWeight:200,color:"rgba(255,255,255,0.1)",letterSpacing:"0.3em"}}>
              {filter.index} / 03
            </span>
          </div>

          {/* Pregunta */}
          <div style={{padding:"2rem 3rem 0",flexShrink:0}} key={`q-${i}`}>
            <h2 className="q-anim filter-question" style={{
              fontFamily:"'Montserrat',sans-serif",
              fontWeight:100,
              color:"rgba(255,255,255,0.92)",
              letterSpacing:"-0.025em",
              lineHeight:1.15,
              margin:0,
            }}>{filterQuestions[filter.id] || filter.question}</h2>
            <div style={{height:"1px",width:"2.5rem",background:`rgba(${filter.accentRgb},0.55)`,marginTop:"1.5rem"}}/>
          </div>

          {/* Opciones */}
          <div
            className={`filter-options filter-options-${filter.id}`}
            style={{
              flex:1,
              display:"grid",
              gridTemplateColumns:`repeat(${filter.options.length},1fr)`,
              borderTop:`1px solid rgba(255,255,255,0.06)`,
              marginTop:"auto",
              alignItems:"stretch",
            }}
          >
            {filter.options.map((opt, oi) => {
              const isSel = selected[filter.id] === opt.v;
              const isHov = hoveredOpt === `${i}-${oi}`;
              const showSub = isSel || isHov;
              return (
                <div key={opt.v} className="fopt"
                  onClick={()=>handleSelect(filter.id,opt.v,i)}
                  onMouseEnter={()=>setHoveredOpt(`${i}-${oi}`)}
                  onMouseLeave={()=>setHoveredOpt(null)}
                  style={{
                    padding:"1.8rem 1rem",
                    borderRight:`1px solid rgba(255,255,255,0.04)`,
                    background: isSel ? `rgba(${filter.accentRgb},0.09)` : "transparent",
                    borderTop: isSel ? `1px solid rgba(${filter.accentRgb},0.5)` : "1px solid transparent",
                    position:"relative",
                    justifyContent:"center",
                    gap:"0.8rem",
                  }}
                >
                  <div className="filter-label fname" style={{
                    fontFamily:"'Montserrat',sans-serif",
                    fontWeight:200,
                    textTransform:"uppercase",
                    color: isSel ? "#fff" : "rgba(255,255,255,0.65)",
                    letterSpacing:"0.05em",
                    transition:"all 0.5s cubic-bezier(0.16,1,0.3,1)",
                    textAlign:"center",
                  }}>{(tf.options as any)[opt.v] || opt.l}</div>

                  <div style={{
                    height:"1px",
                    width: isSel ? "70%" : "20%",
                    background: isSel ? `rgba(${filter.accentRgb},0.7)` : "rgba(255,255,255,0.07)",
                    transition:"all 0.6s cubic-bezier(0.16,1,0.3,1)",
                    alignSelf:"center",
                  }}/>

                  <span className="filter-sub" style={{
                    fontFamily:"'Montserrat',sans-serif",
                    fontWeight:200,
                    color: isSel
                      ? `rgba(${filter.accentRgb},0.9)`
                      : isHov
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(255,255,255,0.25)",
                    letterSpacing:"0.2em",
                    textTransform:"uppercase",
                    transition:"all 0.4s ease",
                    textAlign:"center",
                    opacity: showSub ? 1 : 0.4,
                  }}>{(tf.subs as any)[opt.v] || opt.sub}</span>

                  {isSel && (
                    <div style={{position:"absolute",bottom:0,left:0,right:0,height:"1px",background:`linear-gradient(90deg,transparent,rgba(${filter.accentRgb},0.6),transparent)`}}/>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          {i===FILTERS.length-1&&allSelected&&(
            <div style={{padding:"1.5rem 3rem",flexShrink:0,display:"flex",justifyContent:"flex-end",borderTop:`1px solid rgba(${filter.accentRgb},0.08)`}}>
              <button
                onClick={()=>router.push(`/${locale}/propiedades?${new URLSearchParams(selected).toString()}`)}
                style={{background:"none",border:`1px solid rgba(${filter.accentRgb},0.45)`,color:filter.accent,fontFamily:"'Montserrat',sans-serif",fontSize:"0.6rem",letterSpacing:"0.6em",textTransform:"uppercase",padding:"1rem 2.5rem",cursor:"pointer",transition:"all 0.4s"}}
                onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${filter.accentRgb},0.12)`;}}
                onMouseLeave={e=>{e.currentTarget.style.background="none";}}
              >
                {tf.discover}
              </button>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
