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
     color: variant === 'solid' ? '#FAFAF7' : '#2D4A3E',
     backgroundColor: variant === 'solid' ? '#2D4A3E' : 'transparent',
     borderWidth: '1px',
     borderStyle: 'solid',
     borderColor: variant === 'ghost' ? 'transparent' : 'rgba(45,74,62,0.4)',
     transition: 'all 0.3s ease',
     overflow: 'hidden',
     ...style,
   };

   return (
     <button ref={ref} style={base} className={`neon-btn-edit ${className || ''}`} {...props}>
       <style>{`
         .neon-btn-edit:hover { border-color:rgba(45,74,62,0.8)!important; color:${variant==='solid'?'#FAFAF7':'#1C2B24'}!important; background-color:${variant==='solid'?'#3D6B58':'rgba(45,74,62,0.08)'}!important; }
         .neon-btn-edit .nb-top,.neon-btn-edit .nb-bot { position:absolute;left:12.5%;width:75%;height:1px;background:linear-gradient(90deg,transparent,#2D4A3E,transparent);opacity:0;transition:opacity 0.5s ease;pointer-events:none; }
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
