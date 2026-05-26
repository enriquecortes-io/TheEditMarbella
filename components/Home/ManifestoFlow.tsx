'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const GOLD = '#c9a96e';
const GOLD_DIM = 'rgba(201,169,110,0.55)';
const WHITE = 'rgba(255,255,255,0.92)';
const WHITE_DIM = 'rgba(255,255,255,0.6)';

const CONTENT: Record<string, {
  s1: { tag: string; h: string[]; body: string };
  s2: { tag: string; h: string[]; body: string; cols: { t: string; d: string }[] };
  s3: { tag: string; h: string[]; body: string };
}> = {
  es: {
    s1: { tag: '01 — El Criterio', h: ['Rechazamos', 'lo que casi', 'lo logra.'], body: 'Cada residencia que cruza este umbral ha sido contemplada, medida y comprendida en su totalidad. Lo bueno es enemigo de lo extraordinario.' },
    s2: { tag: '02 — El Acceso', h: ['La Costa', 'del Sol', 'oculta.'], body: 'Tesoros que nunca aparecen en escaparates. Esto es The Edit: el acceso silencioso a lo que la mayoría jamás verá.', cols: [{ t: 'Discreción Total', d: 'Operaciones off-market sin comprometer la privacidad que una transacción de este nivel exige.' }, { t: 'Red Privada', d: 'Compradores HNWI en 40+ países. Cada visita es una conversación real, no un reconocimiento.' }, { t: 'Acompañamiento', d: 'Desde la valoración hasta la escritura. Tu única decisión es cuándo firmar.' }] },
    s3: { tag: '03 — La Selección', h: ['Solo lo', 'extraordinario', 'entra.'], body: 'The Edit no es un catálogo. Es una curaduría. Menos propiedades, más criterio. Si está aquí, es porque merece estar aquí.' },
  },
  en: {
    s1: { tag: '01 — The Standard', h: ['We reject', 'what nearly', 'succeeds.'], body: 'Every residence that crosses this threshold has been studied, measured and fully understood. Good is the enemy of extraordinary.' },
    s2: { tag: '02 — The Access', h: ['The Costa', 'del Sol', 'conceals.'], body: 'Treasures that never reach the window. This is The Edit: silent access to what most will never see.', cols: [{ t: 'Total Discretion', d: 'Off-market operations without compromising the privacy a transaction of this level demands.' }, { t: 'Private Network', d: 'HNWI buyers across 40+ countries. Every visit is a real conversation, not reconnaissance.' }, { t: 'Full Accompaniment', d: 'From valuation to completion. Your only decision is when to sign.' }] },
    s3: { tag: '03 — The Selection', h: ['Only the', 'extraordinary', 'enters.'], body: 'The Edit is not a catalogue. It is a curation. Fewer properties, more discernment. If it is here, it deserves to be here.' },
  },
  fr: {
    s1: { tag: '01 — Le Critère', h: ['Nous rejetons', 'ce qui frôle', "l'excellence."], body: "Chaque résidence qui franchit ce seuil a été contemplée, mesurée et pleinement comprise. Le bon est l'ennemi de l'extraordinaire." },
    s2: { tag: "02 — L'Accès", h: ['La Costa', 'del Sol', 'dissimule.'], body: "Des trésors qui n'apparaissent jamais en vitrine. Voici The Edit: l'accès silencieux à ce que la plupart ne verra jamais.", cols: [{ t: 'Discrétion Totale', d: 'Opérations off-market sans compromettre la confidentialité.' }, { t: 'Réseau Privé', d: 'Acheteurs HNWI dans 40+ pays. Chaque visite est une vraie conversation.' }, { t: 'Accompagnement', d: "De l'évaluation à la signature." }] },
    s3: { tag: '03 — La Sélection', h: ["Seul l'extra-", 'ordinaire', 'entre.'], body: "The Edit n'est pas un catalogue. C'est une curation. Moins de biens, plus de discernement." },
  },
  ru: {
    s1: { tag: '01 — Критерий', h: ['Мы отвергаем', 'то, что лишь', 'приближается.'], body: 'Каждая резиденция была изучена, измерена и полностью понята. Хорошее — враг исключительного.' },
    s2: { tag: '02 — Доступ', h: ['Коста-дель-Соль', 'хранит', 'тайны.'], body: 'Сокровища, которые никогда не появляются в витринах. Это The Edit: безмолвный доступ к тому, что большинство никогда не увидит.', cols: [{ t: 'Конфиденциальность', d: 'Закрытые сделки без ущерба для приватности.' }, { t: 'Частная сеть', d: 'Покупатели HNWI в 40+ странах.' }, { t: 'Сопровождение', d: 'От оценки до подписания.' }] },
    s3: { tag: '03 — Отбор', h: ['Только', 'исключительное', 'входит.'], body: 'The Edit — не каталог. Это кураторство. Меньше объектов, больше критериев.' },
  },
};

const TAG: React.CSSProperties = { fontFamily:"'Montserrat',sans-serif", fontSize:'0.5rem', fontWeight:600, letterSpacing:'0.35em', textTransform:'uppercase', color:GOLD_DIM, margin:0 };
const HR: React.CSSProperties = { border:'none', borderTop:`1px solid rgba(201,169,110,0.15)`, margin:'clamp(0.8rem,2vw,1.2rem) 0' };
const H: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2.8rem,8vw,9rem)', fontWeight:600, lineHeight:0.88, textTransform:'uppercase', color:WHITE, margin:0 };
const BODY: React.CSSProperties = { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1rem,1.6vw,1.3rem)', fontWeight:300, lineHeight:1.75, color:WHITE_DIM, maxWidth:'52ch', margin:0 };

type SubPhase = 'manifesto1' | 'manifesto2' | 'manifesto3';

export default function ManifestoFlow({ locale }: { locale: string }) {
  const c = CONTENT[locale] || CONTENT.es;
  const [activePhase, setActivePhase] = useState<SubPhase>('manifesto1');
  const s1Ref = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);
  const s3Ref = useRef<HTMLDivElement>(null);

  const refs: Record<SubPhase, React.RefObject<HTMLDivElement | null>> = {
    manifesto1: s1Ref,
    manifesto2: s2Ref,
    manifesto3: s3Ref,
  };

  // Escuchar sub-fase del scroll engine
  useEffect(() => {
    const handler = (e: Event) => {
      const phase = (e as CustomEvent).detail as SubPhase;
      setActivePhase(phase);
    };
    window.addEventListener('manifestophase', handler);
    return () => window.removeEventListener('manifestophase', handler);
  }, []);

  // Animación GSAP al cambiar de sub-fase
  useEffect(() => {
    const order: SubPhase[] = ['manifesto1', 'manifesto2', 'manifesto3'];
    order.forEach((phase) => {
      const el = refs[phase].current;
      if (!el) return;
      if (phase === activePhase) {
        gsap.to(el, { opacity: 1, rotation: 0, y: 0, duration: 0.6, ease: 'power3.out' });
      } else {
        const idx = order.indexOf(phase);
        const activeIdx = order.indexOf(activePhase);
        const isPrev = idx < activeIdx;
        gsap.to(el, { opacity: 0, rotation: isPrev ? -4 : 8, y: isPrev ? -40 : 60, duration: 0.5, ease: 'power2.in' });
      }
    });
  }, [activePhase]);

  const Section = ({ phaseKey, children }: { phaseKey: SubPhase; children: React.ReactNode }) => {
    const ref = refs[phaseKey];
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: 'clamp(2rem,6vw,5rem) clamp(2rem,5vw,4rem)',
          opacity: phaseKey === 'manifesto1' ? 1 : 0,
          transformOrigin: 'bottom left',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#070503' }}>
      {/* Sección 1 */}
      <Section phaseKey="manifesto1">
        <p style={TAG}>{c.s1.tag}</p>
        <hr style={HR} />
        <div>
          {c.s1.h.map((line, i) => (
            <h2 key={i} style={{ ...H, color: i === 2 ? GOLD : WHITE }}>{line}</h2>
          ))}
        </div>
        <hr style={HR} />
        <p style={BODY}>{c.s1.body}</p>
      </Section>

      {/* Sección 2 */}
      <Section phaseKey="manifesto2">
        <p style={TAG}>{c.s2.tag}</p>
        <hr style={HR} />
        <div>
          {c.s2.h.map((line, i) => (
            <h2 key={i} style={{ ...H, color: i === 2 ? GOLD : WHITE }}>{line}</h2>
          ))}
        </div>
        <hr style={HR} />
        <p style={BODY}>{c.s2.body}</p>
        <hr style={HR} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1rem,3vw,2rem)' }}>
          {c.s2.cols.map((col, i) => (
            <div key={i} style={{ flex: '1 1 160px' }}>
              <p style={{ ...TAG, color: GOLD, marginBottom: '0.4rem' }}>{col.t}</p>
              <p style={{ ...BODY, fontSize: 'clamp(0.8rem,1.1vw,0.95rem)', maxWidth: 'none' }}>{col.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Sección 3 */}
      <Section phaseKey="manifesto3">
        <p style={TAG}>{c.s3.tag}</p>
        <hr style={HR} />
        <div>
          {c.s3.h.map((line, i) => (
            <h2 key={i} style={{ ...H, color: i === 2 ? GOLD : WHITE }}>{line}</h2>
          ))}
        </div>
        <hr style={HR} />
        <p style={{ ...BODY, marginTop: 'auto' }}>{c.s3.body}</p>
      </Section>
    </div>
  );
}
