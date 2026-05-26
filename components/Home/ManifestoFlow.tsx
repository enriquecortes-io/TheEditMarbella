'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

const FlowSection: React.FC<FlowSectionProps> = ({
  className, style = {}, children, 'aria-label': ariaLabel,
}) => (
  <section
    data-flow-section
    aria-label={ariaLabel}
    style={{ position:'relative', minHeight:'100vh', width:'100%', overflow:'hidden' }}
    className={className}
  >
    <div
      data-flow-inner
      className="flow-art-container"
      style={{
        position:'relative',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        gap:'clamp(1rem,4vw,2rem)',
        minHeight:'100vh',
        width:'100%',
        padding:'clamp(2rem,8vw,4rem) clamp(2rem,6vw,5rem)',
        transformOrigin:'bottom left',
        willChange:'transform',
        boxSizing:'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  </section>
);

interface ManifestoFlowProps { locale: string; }

const CONTENT: Record<string, {
  s1: { tag: string; h: string[]; body: string };
  s2: { tag: string; h: string[]; body: string; cols: { t: string; d: string }[] };
  s3: { tag: string; h: string[]; body: string };
}> = {
  es: {
    s1: {
      tag: '01 — El Criterio',
      h: ['Rechazamos', 'lo que casi', 'lo logra.'],
      body: 'Cada residencia que cruza este umbral ha sido contemplada, medida y comprendida en su totalidad. Lo bueno es enemigo de lo extraordinario.',
    },
    s2: {
      tag: '02 — El Acceso',
      h: ['La Costa', 'del Sol', 'oculta.'],
      body: 'Tesoros que nunca aparecen en escaparates. Esto es The Edit: el acceso silencioso a lo que la mayoría jamás verá.',
      cols: [
        { t: 'Discreción Total', d: 'Operaciones off-market sin comprometer la privacidad que una transacción de este nivel exige.' },
        { t: 'Red Privada', d: 'Compradores HNWI en 40+ países. Cada visita es una conversación real, no un reconocimiento.' },
        { t: 'Acompañamiento', d: 'Desde la valoración hasta la escritura. Tu única decisión es cuándo firmar.' },
      ],
    },
    s3: {
      tag: '03 — La Selección',
      h: ['Solo lo', 'extraordinario', 'entra.'],
      body: 'The Edit no es un catálogo. Es una curaduría. Menos propiedades, más criterio. Si está aquí, es porque merece estar aquí.',
    },
  },
  en: {
    s1: {
      tag: '01 — The Standard',
      h: ['We reject', 'what nearly', 'succeeds.'],
      body: 'Every residence that crosses this threshold has been studied, measured and fully understood. Good is the enemy of extraordinary.',
    },
    s2: {
      tag: '02 — The Access',
      h: ['The Costa', 'del Sol', 'conceals.'],
      body: 'Treasures that never reach the window. This is The Edit: silent access to what most will never see.',
      cols: [
        { t: 'Total Discretion', d: 'Off-market operations without compromising the privacy a transaction of this level demands.' },
        { t: 'Private Network', d: 'HNWI buyers across 40+ countries. Every visit is a real conversation, not reconnaissance.' },
        { t: 'Full Accompaniment', d: 'From valuation to completion. Your only decision is when to sign.' },
      ],
    },
    s3: {
      tag: '03 — The Selection',
      h: ['Only the', 'extraordinary', 'enters.'],
      body: 'The Edit is not a catalogue. It is a curation. Fewer properties, more discernment. If it is here, it deserves to be here.',
    },
  },
  fr: {
    s1: {
      tag: '01 — Le Critère',
      h: ['Nous rejetons', 'ce qui frôle', "l'excellence."],
      body: "Chaque résidence qui franchit ce seuil a été contemplée, mesurée et pleinement comprise. Le bon est l'ennemi de l'extraordinaire.",
    },
    s2: {
      tag: '02 — L\'Accès',
      h: ['La Costa', 'del Sol', 'dissimule.'],
      body: "Des trésors qui n'apparaissent jamais en vitrine. Voici The Edit: l'accès silencieux à ce que la plupart ne verra jamais.",
      cols: [
        { t: 'Discrétion Totale', d: 'Opérations off-market sans compromettre la confidentialité.' },
        { t: 'Réseau Privé', d: 'Acheteurs HNWI dans 40+ pays. Chaque visite est une vraie conversation.' },
        { t: 'Accompagnement', d: "De l'évaluation à la signature. Votre seule décision est quand signer." },
      ],
    },
    s3: {
      tag: '03 — La Sélection',
      h: ["Seul l'extra-", 'ordinaire', 'entre.'],
      body: "The Edit n'est pas un catalogue. C'est une curation. Moins de biens, plus de discernement.",
    },
  },
  ru: {
    s1: {
      tag: '01 — Критерий',
      h: ['Мы отвергаем', 'то, что лишь', 'приближается.'],
      body: 'Каждая резиденция была изучена, измерена и полностью понята. Хорошее — враг исключительного.',
    },
    s2: {
      tag: '02 — Доступ',
      h: ['Коста-дель-Соль', 'хранит', 'тайны.'],
      body: 'Сокровища, которые никогда не появляются в витринах. Это The Edit: безмолвный доступ к тому, что большинство никогда не увидит.',
      cols: [
        { t: 'Абсолютная конфиденциальность', d: 'Закрытые сделки без ущерба для приватности.' },
        { t: 'Частная сеть', d: 'Покупатели HNWI в 40+ странах.' },
        { t: 'Полное сопровождение', d: 'От оценки до подписания. Ваше решение — когда подписывать.' },
      ],
    },
    s3: {
      tag: '03 — Отбор',
      h: ['Только', 'исключительное', 'входит.'],
      body: 'The Edit — не каталог. Это кураторство. Меньше объектов, больше критериев.',
    },
  },
};

const GOLD = '#c9a96e';
const GOLD_DIM = 'rgba(201,169,110,0.6)';
const WHITE = 'rgba(255,255,255,0.9)';
const WHITE_DIM = 'rgba(255,255,255,0.6)';

const TAG_STYLE: React.CSSProperties = {
  fontFamily: "'Montserrat',sans-serif",
  fontSize: '0.55rem',
  fontWeight: 600,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: GOLD_DIM,
  margin: 0,
};

const HR_GOLD: React.CSSProperties = {
  border: 'none',
  borderTop: `1px solid rgba(201,169,110,0.2)`,
  margin: 'clamp(0.5rem,2vw,1rem) 0',
};

const H_STYLE: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond',serif",
  fontSize: 'clamp(3rem,9vw,10rem)',
  fontWeight: 600,
  lineHeight: 0.88,
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
  color: WHITE,
  margin: 0,
};

const BODY_STYLE: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond',serif",
  fontSize: 'clamp(1rem,1.8vw,1.4rem)',
  fontWeight: 300,
  lineHeight: 1.7,
  color: WHITE_DIM,
  maxWidth: '52ch',
  margin: 0,
};

export default function ManifestoFlow({ locale }: ManifestoFlowProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const c = CONTENT[locale] || CONTENT.es;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useGSAP(() => {
    if (!containerRef.current || reducedMotion) return;

    const sections = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
    );
    if (!sections.length) return;

    const triggers: ScrollTrigger[] = [];

    sections.forEach((section, i) => {
      gsap.set(section, { zIndex: i + 1 });
      const inner = section.querySelector<HTMLElement>('.flow-art-container');
      if (!inner) return;

      if (i > 0) {
        gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
        const tween = gsap.to(inner, {
          rotation: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 25%',
            scrub: true,
          },
        });
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
      }

      if (i < sections.length - 1) {
        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: 'bottom bottom',
            end: 'bottom top',
            pin: true,
            pinSpacing: false,
          }),
        );
      }
    });

    ScrollTrigger.refresh();
    return () => { triggers.forEach(t => t.kill()); };
  }, { scope: containerRef, dependencies: [locale, reducedMotion] });

  return (
    <main ref={containerRef} style={{ width:'100%', overflowX:'hidden' }}>

      {/* Sección 1 — El Criterio */}
      <FlowSection
        aria-label={c.s1.tag}
        style={{ background:'#080604' }}
      >
        <p style={TAG_STYLE}>{c.s1.tag}</p>
        <hr style={HR_GOLD} />
        <div>
          {c.s1.h.map((line, i) => (
            <h2 key={i} style={{ ...H_STYLE, color: i === 2 ? GOLD : WHITE }}>{line}</h2>
          ))}
        </div>
        <hr style={HR_GOLD} />
        <p style={BODY_STYLE}>{c.s1.body}</p>
      </FlowSection>

      {/* Sección 2 — El Acceso */}
      <FlowSection
        aria-label={c.s2.tag}
        style={{ background:'#0d0a08' }}
      >
        <p style={TAG_STYLE}>{c.s2.tag}</p>
        <hr style={HR_GOLD} />
        <div>
          {c.s2.h.map((line, i) => (
            <h2 key={i} style={{ ...H_STYLE, color: i === 2 ? GOLD : WHITE }}>{line}</h2>
          ))}
        </div>
        <hr style={HR_GOLD} />
        <p style={BODY_STYLE}>{c.s2.body}</p>
        <hr style={HR_GOLD} />
        <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(1rem,3vw,2rem)' }}>
          {c.s2.cols.map((col, i) => (
            <div key={i} style={{ flex:'1 1 180px' }}>
              <p style={{ ...TAG_STYLE, color: GOLD, marginBottom:'0.5rem' }}>{col.t}</p>
              <p style={{ ...BODY_STYLE, fontSize:'clamp(0.85rem,1.2vw,1rem)', maxWidth:'none' }}>{col.d}</p>
            </div>
          ))}
        </div>
      </FlowSection>

      {/* Sección 3 — La Selección */}
      <FlowSection
        aria-label={c.s3.tag}
        style={{ background:'#060402' }}
      >
        <p style={TAG_STYLE}>{c.s3.tag}</p>
        <hr style={HR_GOLD} />
        <div>
          {c.s3.h.map((line, i) => (
            <h2 key={i} style={{ ...H_STYLE, color: i === 2 ? GOLD : WHITE }}>{line}</h2>
          ))}
        </div>
        <hr style={HR_GOLD} />
        <p style={{ ...BODY_STYLE, marginTop:'auto' }}>{c.s3.body}</p>
      </FlowSection>

    </main>
  );
}
