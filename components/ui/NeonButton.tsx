"use client";
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 neon?: boolean;
 variant?: 'default' | 'ghost' | 'solid';
 size?: 'sm' | 'default' | 'lg';
}

const NeonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ neon = true, variant = 'default', size = 'default', children, style, className, ...props }, ref) => {

   const base: React.CSSProperties = {
     position: 'relative',
     display: 'inline-block',
     fontFamily: "'Montserrat', sans-serif",
     fontSize: size === 'sm' ? '0.45rem' : size === 'lg' ? '0.65rem' : '0.55rem',
     fontWeight: 600,
     letterSpacing: '0.3em',
     textTransform: 'uppercase',
     cursor: 'pointer',
     border: 'none',
     background: 'none',
     padding: size === 'sm' ? '0.5rem 1rem' : size === 'lg' ? '1rem 2.5rem' : '0.7rem 1.8rem',
     color: variant === 'solid' ? '#0a0805' : '#c9a96e',
     backgroundColor: variant === 'solid' ? '#c9a96e' : 'transparent',
     borderWidth: '1px',
     borderStyle: 'solid',
     borderColor: variant === 'ghost' ? 'transparent' : 'rgba(201,169,110,0.35)',
     transition: 'all 0.3s ease',
     overflow: 'hidden',
     ...style,
   };

   return (
     <button ref={ref} style={base} className={`neon-btn-edit ${className || ''}`} {...props}>
       <style>{`
         .neon-btn-edit:hover { border-color:rgba(201,169,110,0.7)!important; color:${variant==='solid'?'#0a0805':'#e8c97e'}!important; background-color:${variant==='solid'?'#e8c97e':'rgba(201,169,110,0.05)'}!important; }
         .neon-btn-edit .nb-top,.neon-btn-edit .nb-bot { position:absolute;left:12.5%;width:75%;height:1px;background:linear-gradient(90deg,transparent,#c9a96e,transparent);opacity:0;transition:opacity 0.5s ease;pointer-events:none; }
         .neon-btn-edit .nb-top{top:0;} .neon-btn-edit .nb-bot{bottom:0;}
         .neon-btn-edit:hover .nb-top,.neon-btn-edit:hover .nb-bot{opacity:1;}
       `}</style>
       {neon && <span className="nb-top" />}
       {children}
       {neon && <span className="nb-bot" />}
     </button>
   );
 }
);

NeonButton.displayName = 'NeonButton';
export default NeonButton;
