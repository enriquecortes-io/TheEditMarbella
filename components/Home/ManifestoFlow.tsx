'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const GOLD = '#c9a96e';
const GOLD_DIM = 'rgba(201,169,110,0.8)';
const WHITE = '#ffffff';
const WHITE_DIM = 'rgba(255,255,255,0.85)';

const CONTENT: Record<string, any> = {
  es: {
    s1: { tag:'01 — El Criterio', h:['Rechazamos','lo que casi','lo logra.'], body:'Cada residencia que cruza este umbral ha sido contemplada, medida y comprendida en su totalidad. Lo bueno es enemigo de lo extraordinario.' },
    s2: { tag:'02 — El Acceso', h:['La Costa','del Sol','oculta.'], body:'Tesoros que nunca aparecen en escaparates. Esto es The Edit: el acceso silencioso a lo que la mayoría jamás verá.', cols:[{t:'Discreción Total',d:'Operaciones off-market sin comprometer la privacidad que una transacción de este nivel exige.'},{t:'Red Privada',d:'Compradores HNWI en 40+ países. Cada visita es una conversación real, no un reconocimiento.'},{t:'Acompañamiento',d:'Desde la valoración hasta la escritura. Tu única decisión es cuándo firmar.'}] },
    s3: { tag:'03 — La Selección', h:['Solo lo','extraordinario','entra.'], body:'The Edit no es un catálogo. Es una curaduría. Menos propiedades, más criterio. Si está aquí, es porque merece estar aquí.' },
  },
  en: {
    s1: { tag:'01 — The Standard', h:['We reject','what nearly','succeeds.'], body:'Every residence that crosses this threshold has been studied, measured and fully understood. Good is the enemy of extraordinary.' },
    s2: { tag:'02 — The Access', h:['The Costa','del Sol','conceals.'], body:'Treasures that never reach the window. This is The Edit: silent access to what most will never see.', cols:[{t:'Total Discretion',d:'Off-market operations without compromising the privacy a transaction of this level demands.'},{t:'Private Network',d:'HNWI buyers across 40+ countries. Every visit is a real conversation, not reconnaissance.'},{t:'Full Accompaniment',d:'From valuation to completion. Your only decision is when to sign.'}] },
    s3: { tag:'03 — The Selection', h:['Only the','extraordinary','enters.'], body:'The Edit is not a catalogue. It is a curation. Fewer properties, more discernment. If it is here, it deserves to be here.' },
  },
  fr: {
    s1: { tag:"01 — Le Critère", h:['Nous rejetons','ce qui frôle',"l'excellence."], body:"Chaque résidence qui franchit ce seuil a été contemplée, mesurée et pleinement comprise. Le bon est l'ennemi de l'extraordinaire." },
    s2: { tag:"02 — L'Accès", h:['La Costa','del Sol','dissimule.'], body:"Des trésors qui n'apparaissent jamais en vitrine. Voici The Edit: l'accès silencieux à ce que la plupart ne verra jamais.", cols:[{t:'Discrétion Totale',d:'Opérations off-market sans compromettre la confidentialité.'},{t:'Réseau Privé',d:'Acheteurs HNWI dans 40+ pays.'},{t:'Accompagnement',d:"De l'évaluation à la signature."}] },
    s3: { tag:'03 — La Sélection', h:["Seul l'extra-",'ordinaire','entre.'], body:"The Edit n'est pas un catalogue. C'est une curation." },
  },
  ru: {
    s1: { tag:'01 — Критерий', h:['Мы отвергаем','то, что лишь','приближается.'], body:'Каждая резиденция была изучена, измерена и полностью понята. Хорошее — враг исключительного.' },
    s2: { tag:'02 — Доступ', h:['Коста-дель-Соль','хранит','тайны.'], body:'Это The Edit: безмолвный доступ к тому, что большинство никогда не увидит.', cols:[{t:'Конфиденциальность',d:'Закрытые сделки.'},{t:'Частная сеть',d:'Покупатели HNWI в 40+ странах.'},{t:'Сопровождение',d:'От оценки до подписания.'}] },
    s3: { tag:'03 — Отбор', h:['Только','исключительное','входит.'], body:'The Edit — не каталог. Это кураторство.' },
  },
};

const TAG_S: React.CSSProperties = { fontFamily:"'Montserrat',sans-serif", fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.3em', textTransform:'uppercase', color:GOLD_DIM, margin:0 };
const HR_S: React.CSSProperties = { border:'none', borderTop:'1px solid rgba(201,169,110,0.15)', margin:'clamp(0.5rem,1.2vw,0.8rem) 0' };
const H_S: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,7vw,8rem)', fontWeight:600, lineHeight:0.88, textTransform:'uppercase', color:WHITE, margin:0 };
const BODY_S: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.1rem,2vw,1.4rem)', fontWeight:300, lineHeight:1.8, color:WHITE_DIM, maxWidth:'52ch', margin:0 };

type SubPhase = 'manifesto1'|'manifesto2'|'manifesto3';
const ORDER: SubPhase[] = ['manifesto1','manifesto2','manifesto3'];

export default function ManifestoFlow({ locale }: { locale: string }) {
  const c = CONTENT[locale] || CONTENT.es;
  const [active, setActive] = useState<SubPhase>('manifesto1');
  const refs = { manifesto1: useRef<HTMLDivElement>(null), manifesto2: useRef<HTMLDivElement>(null), manifesto3: useRef<HTMLDivElement>(null) };

  useEffect(() => {
    const handler = (e: Event) => setActive((e as CustomEvent).detail as SubPhase);
    window.addEventListener('manifestophase', handler);
    return () => window.removeEventListener('manifestophase', handler);
  }, []);

  useEffect(() => {
    ORDER.forEach((phase) => {
      const el = refs[phase].current;
      if (!el) return;
      if (phase === active) {
        gsap.to(el, { opacity:1, rotation:0, y:0, duration:0.7, ease:'power3.out' });
      } else {
        const isPrev = ORDER.indexOf(phase) < ORDER.indexOf(active);
        gsap.to(el, { opacity:0, rotation: isPrev ? -5 : 10, y: isPrev ? -50 : 70, duration:0.5, ease:'power2.in' });
      }
    });
  }, [active]);

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden', background:'#070503' }}>

      {/* S1 */}
      <div ref={refs.manifesto1} style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:'clamp(0.6rem,1.5vw,1rem)', padding:'clamp(4rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(1.5rem,3vw,2rem)', boxSizing:'border-box', transformOrigin:'bottom left' }}>
        <p style={TAG_S}>{c.s1.tag}</p>
        <hr style={HR_S}/>
        <div>{c.s1.h.map((l:string,i:number)=><h2 key={i} style={{...H_S,color:i===2?GOLD:WHITE}}>{l}</h2>)}</div>
        <hr style={HR_S}/>
        <p style={BODY_S}>{c.s1.body}</p>
      </div>

      {/* S2 — grid: título izquierda / contenido derecha */}
     <div ref={refs.manifesto2} style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 clamp(2rem,4vw,4rem)', padding:'clamp(4rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(1.5rem,3vw,2rem)', boxSizing:'border-box', transformOrigin:'bottom left', opacity:0, alignContent:'start' }}>
       <div style={{display:'flex',flexDirection:'column',gap:'clamp(0.4rem,1vw,0.6rem)'}}>
         <p style={TAG_S}>{c.s2.tag}</p>
         <hr style={HR_S}/>
         <div>{c.s2.h.map((l:string,i:number)=><h2 key={i} style={{...H_S,color:i===2?GOLD:WHITE}}>{l}</h2>)}</div>
       </div>
       <div style={{display:'flex',flexDirection:'column',gap:'clamp(0.6rem,1.2vw,1rem)',justifyContent:'space-between'}}>
         <p style={BODY_S}>{c.s2.body}</p>
         <hr style={HR_S}/>
         {c.s2.cols.map((col:any,i:number)=>(
           <div key={i}>
             <p style={{...TAG_S,color:GOLD,marginBottom:'0.3rem'}}>{col.t}</p>
             <p style={{...BODY_S,fontSize:'clamp(0.9rem,1.3vw,1.1rem)',maxWidth:'none'}}>{col.d}</p>
           </div>
         ))}
       </div>
     </div>

      {/* S3 */}
      <div ref={refs.manifesto3} style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:'clamp(0.6rem,1.5vw,1rem)', padding:'clamp(4rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(1.5rem,3vw,2rem)', boxSizing:'border-box', transformOrigin:'bottom left', opacity:0 }}>
        <p style={TAG_S}>{c.s3.tag}</p>
        <hr style={HR_S}/>
        <div>{c.s3.h.map((l:string,i:number)=><h2 key={i} style={{...H_S,color:i===2?GOLD:WHITE}}>{l}</h2>)}</div>
        <hr style={HR_S}/>
        <p style={BODY_S}>{c.s3.body}</p>
      </div>

    </div>
  );
}
