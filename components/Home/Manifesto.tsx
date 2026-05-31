'use client';
import FirmaEnrique from '@/components/ui/FirmaEnrique';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const GOLD = '#2D4A3E';
const GOLD_DIM = 'rgba(45,74,62,0.6)';
const WHITE = '#1A1714';
const WHITE_DIM = '#4A4540';

const CONTENT: Record<string, any> = {
  es: {
    s1: { tag:'01 — El Criterio', h:['Rechazamos','lo que casi','lo logra.'], body:'Cada residencia que cruza este umbral ha sido contemplada, medida y comprendida en su totalidad. Lo bueno es enemigo de lo extraordinario.' },
    s2: { tag:'02 — El Acceso', h:['La Costa','del Sol','oculta.'], body:'Tesoros que nunca aparecen en escaparates. Esto es The Edit: el acceso silencioso a lo que la mayoría jamás verá.', cols:[{t:'Discreción Total',d:'Operaciones off-market sin comprometer la privacidad que una transacción de este nivel exige.'},{t:'Red Privada',d:'Compradores HNWI en 40+ países.'},{t:'Acompañamiento',d:'Desde la valoración hasta la escritura.'}] },
    s3: { tag:'03 — La Selección', h:['Solo lo','extraordinario','entra.'], body:'', carta:"Cada propiedad que aparece en The Edit ha pasado por un proceso de revisión personal. No trabajamos con volumen, trabajamos con criterio. Antes de presentarte una residencia, la he visitado, analizado y comprendido en su totalidad. Su arquitectura, su entorno, su potencial. Mi compromiso es darte acceso exclusivo a lo que realmente merece tu atención, con un servicio completamente personalizado desde el primer contacto hasta el día de la firma." },
  },
  en: {
    s1: { tag:'01 — The Standard', h:['We reject','what nearly','succeeds.'], body:'Every residence that crosses this threshold has been studied, measured and fully understood. Good is the enemy of extraordinary.' },
    s2: { tag:'02 — The Access', h:['The Costa','del Sol','conceals.'], body:'Treasures that never reach the window. This is The Edit: silent access to what most will never see.', cols:[{t:'Total Discretion',d:'Off-market operations without compromising privacy.'},{t:'Private Network',d:'HNWI buyers across 40+ countries.'},{t:'Full Accompaniment',d:'From valuation to completion.'}] },
    s3: { tag:'03 — The Selection', h:['Only the','extraordinary','enters.'], body:'', carta:"Every property in The Edit has gone through a personal review process. We do not work with volume, we work with discernment. Before presenting a residence to you, I have visited, analysed and fully understood it. Its architecture, its surroundings, its potential. My commitment is to give you exclusive access to what truly deserves your attention, with a fully personalised service from the first contact to the day of signing." },
  },
  fr: {
    s1: { tag:"01 — Le Critère", h:['Nous rejetons','ce qui frôle',"l'excellence."], body:"Chaque résidence qui franchit ce seuil a été contemplée, mesurée et pleinement comprise." },
    s2: { tag:"02 — L'Accès", h:['La Costa','del Sol','dissimule.'], body:"Des trésors qui n'apparaissent jamais en vitrine. Voici The Edit.", cols:[{t:'Discrétion Totale',d:'Opérations off-market.'},{t:'Réseau Privé',d:'Acheteurs HNWI dans 40+ pays.'},{t:'Accompagnement',d:"De l'évaluation à la signature."}] },
    s3: { tag:'03 — La Sélection', h:["Seul l'extra-",'ordinaire','entre.'], body:'', carta:"Chaque propriété de The Edit a fait l'objet d'un processus de révision personnel. Nous travaillons avec discernement. Avant de vous présenter une résidence, je l'ai visitée, analysée et comprise. Son architecture, son environnement, son potentiel. Mon engagement est de vous donner un accès exclusif à ce qui mérite votre attention, avec un service entièrement personnalisé." },
  },
  ru: {
    s1: { tag:'01 — Критерий', h:['Мы отвергаем','то, что лишь','приближается.'], body:'Каждая резиденция была изучена, измерена и полностью понята.' },
    s2: { tag:'02 — Доступ', h:['Коста-дель-Соль','хранит','тайны.'], body:'Это The Edit: безмолвный доступ к тому, что большинство никогда не увидит.', cols:[{t:'Конфиденциальность',d:'Закрытые сделки.'},{t:'Частная сеть',d:'Покупатели HNWI в 40+ странах.'},{t:'Сопровождение',d:'От оценки до подписания.'}] },
    s3: { tag:'03 — Отбор', h:['Только','исключительное','входит.'], body:'', carta:"Каждый объект в The Edit прошёл через личный процесс проверки. Мы работаем не с объёмом, мы работаем с критерием. Прежде чем представить вам резиденцию я лично посетил её, проанализировал и полностью понял. Её архитектуру, окружение, потенциал. Моё обязательство предоставить вам эксклюзивный доступ к тому, что заслуживает вашего внимания, с полностью персонализированным сервисом." },
  },
};

// Estilos
const TAG_S: React.CSSProperties = { fontFamily:"'Montserrat',sans-serif", fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.3em', textTransform:'uppercase', color:GOLD_DIM, margin:0 };
const HR_S: React.CSSProperties = { border:'none', borderTop:'1px solid #DDD8D0', margin:'clamp(0.3rem,0.8vw,0.5rem) 0' };
const H_S: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,7vw,8rem)', fontWeight:600, lineHeight:0.88, textTransform:'uppercase', color:WHITE, margin:0 };
const BODY_S: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.1rem,2vw,1.4rem)', fontWeight:300, lineHeight:1.8, color:WHITE_DIM, maxWidth:'52ch', margin:0 };

// Wrapper con overflow hidden para el reveal de cada línea
const LineReveal = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ overflow: 'hidden', paddingBottom: '0.15em', marginBottom: '-0.15em', ...style }}>
    {children}
  </div>
);

type SubPhase = 'manifesto1' | 'manifesto2' | 'manifesto3';
const ORDER: SubPhase[] = ['manifesto1', 'manifesto2', 'manifesto3'];

// Anima la entrada de un slide: tag, hr, líneas h2, hr, body, cols
function animateSlideIn(container: HTMLDivElement) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  const tag    = container.querySelector<HTMLElement>('[data-anim="tag"]');
  const hr1    = container.querySelector<HTMLElement>('[data-anim="hr1"]');
  const lines  = container.querySelectorAll<HTMLElement>('[data-anim="line"]');
  const hr2    = container.querySelector<HTMLElement>('[data-anim="hr2"]');
  const body   = container.querySelector<HTMLElement>('[data-anim="body"]');
  const cols   = container.querySelectorAll<HTMLElement>('[data-anim="col"]');

  // Resetear estado inicial
  gsap.set([tag, hr1, hr2, body].filter(Boolean), { autoAlpha: 0, y: 12 });
  gsap.set(lines, { yPercent: 110 });
  gsap.set(cols, { autoAlpha: 0, y: 16 });

  tl
    .to(tag,  { autoAlpha: 1, y: 0, duration: 0.5 })
    .to(hr1,  { autoAlpha: 1, y: 0, duration: 0.4, scaleX: 1 }, '-=0.2')
    .to(lines, { yPercent: 0, duration: 0.9, stagger: 0.1 }, '-=0.1')
    .to(hr2,  { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.3')
    .to(body, { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.2')
    .to(cols, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');

  return tl;
}

// Anima la salida de un slide
function animateSlideOut(container: HTMLDivElement, direction: 'prev' | 'next') {
  const sign = direction === 'prev' ? -1 : 1;
  return gsap.to(container, {
    autoAlpha: 0,
    rotationZ: sign * 3,
    y: sign * -40,
    duration: 0.45,
    ease: 'power2.in',
    transformOrigin: 'bottom left',
  });
}

const ManifestoFlow = React.forwardRef<HTMLDivElement, { locale: string }>(({ locale }, ref) => {
  const c = CONTENT[locale] || CONTENT.es;
  const [active, setActive] = useState<SubPhase>('manifesto1');

  const refs = {
    manifesto1: useRef<HTMLDivElement>(null),
    manifesto2: useRef<HTMLDivElement>(null),
    manifesto3: useRef<HTMLDivElement>(null),
  };

  // Escucha el evento de cambio de fase
  useEffect(() => {
    const handler = (e: Event) => setActive((e as CustomEvent).detail as SubPhase);
    window.addEventListener('manifestophase', handler);
    return () => window.removeEventListener('manifestophase', handler);
  }, []);

  // Anima entrada/salida al cambiar de fase
  useEffect(() => {
    ORDER.forEach((phase) => {
      const el = refs[phase].current;
      if (!el) return;

      if (phase === active) {
        // Asegurar visible antes de animar
        gsap.set(el, { autoAlpha: 1, rotationZ: 0, y: 0 });
        animateSlideIn(el);
      } else {
        const isPrev = ORDER.indexOf(phase) < ORDER.indexOf(active);
        animateSlideOut(el, isPrev ? 'prev' : 'next');
      }
    });
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  // Animación inicial del primer slide al montar
  useEffect(() => {
    const el = refs.manifesto1.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 1 });
    // Pequeño delay para que el componente padre haya hecho su fade-in
    const id = setTimeout(() => animateSlideIn(el), 200);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const PAD: React.CSSProperties = {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 'clamp(0.3rem,0.8vw,0.6rem)',
    padding: 'clamp(4rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(1.5rem,3vw,2rem)',
    boxSizing: 'border-box',
    transformOrigin: 'bottom left',
  };

  return (
    <div ref={ref} style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden' }}>

      {/* ── S1 ── */}
      <div ref={refs.manifesto1} style={{ ...PAD, opacity: 0 }}>
        <hr data-anim="hr1" style={HR_S} />
        <div>
          {c.s1.h.map((l: string, i: number) => (
            <LineReveal key={i}>
              <h2 data-anim="line" style={{ ...H_S, color: i === 2 ? GOLD : WHITE }}>{l}</h2>
            </LineReveal>
          ))}
        </div>
        <hr data-anim="hr2" style={HR_S} />
        <p data-anim="body" style={BODY_S}>{c.s1.body}</p>
      </div>

      {/* ── S2 ── */}
      <div ref={refs.manifesto2} style={{
        ...PAD,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0 clamp(2rem,4vw,4rem)',
        alignItems: 'center',
        opacity: 0,
      }}>
        {/* Columna izquierda: tag + hr + headline */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(0.4rem,1vw,0.6rem)' }}>
            <hr data-anim="hr1" style={HR_S} />
          <div>
            {c.s2.h.map((l: string, i: number) => (
              <LineReveal key={i}>
                <h2 data-anim="line" style={{ ...H_S, color: i === 2 ? GOLD : WHITE }}>{l}</h2>
              </LineReveal>
            ))}
          </div>
        </div>

        {/* Columna derecha: body + hr + cols */}
        <div style={{ display:'flex', flexDirection:'column', gap:'clamp(0.6rem,1.2vw,1rem)', justifyContent:'center' }}>
          <p data-anim="body" style={BODY_S}>{c.s2.body}</p>
          <hr data-anim="hr2" style={HR_S} />
          {c.s2.cols.map((col: any, i: number) => (
            <div key={i} data-anim="col">
              <p style={{ ...TAG_S, color: GOLD, marginBottom: '0.3rem' }}>{col.t}</p>
              <p style={{ ...BODY_S, fontSize: 'clamp(0.9rem,1.3vw,1.1rem)', maxWidth: 'none' }}>{col.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── S3 ── */}
      <div ref={refs.manifesto3} style={{ ...PAD, opacity:0, padding:"clamp(3rem,6vw,5rem) clamp(2rem,5vw,4rem) clamp(0.5rem,1vw,1rem)" }}>

        <style>{`
          @media (max-width:640px) {
            .s3-wrap { display:flex !important; flex-direction:column !important; padding-top:2rem !important; }
            .s3-foto { order: 1 !important; overflow:hidden; display:flex !important; justify-content:center !important; align-items:center !important; }
            .s3-foto img { width:160px !important; height:200px !important; object-fit:cover !important; object-position:center top !important; display:block !important; }
            .s3-left { order:2 !important; }
          }
        `}</style>
        <div className="s3-wrap" style={{ display:"grid", gridTemplateColumns:"1fr clamp(180px,28%,320px)", gap:"clamp(1.5rem,4vw,4rem)", alignItems:"start" }}>

          {/* Columna izquierda */}
          <div className="s3-left" style={{ display:"flex", flexDirection:"column", gap:"clamp(0.4rem,0.8vw,0.6rem)" }}>
            <hr data-anim="hr1" style={HR_S} />
            <div>
              {c.s3.h.map((l: string, i: number) => (
                <LineReveal key={i}>
                  <h2 data-anim="line" style={{ ...H_S, color: i === 2 ? GOLD : WHITE }}>{l}</h2>
                </LineReveal>
              ))}
            </div>
            <hr data-anim="hr2" style={HR_S} />
            <p data-anim="body" style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(0.85rem,1.1vw,1.05rem)",
              color:WHITE_DIM, lineHeight:1.8,
              margin:"0 0 clamp(0.8rem,1.5vw,1.2rem)",
              fontStyle:"italic",
            }}>
              {c.s3.carta}
            </p>
            <div data-anim="col"><FirmaEnrique width="clamp(160px,20vw,280px)" /></div>
            <p data-anim="col" style={{ fontFamily:"'Montserrat',sans-serif", fontSize:"clamp(0.38rem,0.5vw,0.48rem)", letterSpacing:"0.3em", textTransform:"uppercase", color:WHITE_DIM, margin:0, opacity:0.5 }}>
              Enrique Cortés · Fundador, The Edit Marbella
            </p>
          </div>

          {/* Columna derecha — foto */}
          <div data-anim="col" className="s3-foto" style={{ position:"relative", overflow:"hidden", padding:"clamp(1rem,3vw,2rem) clamp(0.5rem,2vw,1.5rem) 0 0" }}>
            <img
              src="/enrique-cortes.jpg"
              alt="Enrique Cortés"
              style={{
                width:"clamp(200px,70%,320px)",
                aspectRatio:"3/4",
                objectFit:"cover",
                objectPosition:"center top",
                filter:"grayscale(100%)",
                display:"block",
                marginLeft:"auto",
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
});

ManifestoFlow.displayName = "ManifestoFlow";
export default ManifestoFlow;
