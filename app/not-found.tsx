"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes neonBreath {
          0%,100%{height:2rem;opacity:0.3;}
          50%{height:4rem;opacity:1;}
        }
        .fade-in { animation: fadeIn 1s cubic-bezier(0.16,1,0.3,1) both; }
        .neon { animation: neonBreath 2.4s ease-in-out infinite; }
      `}</style>

      {/* Fondo */}
      <div style={{
        position:"fixed", inset:0,
        background:"linear-gradient(135deg, #080604 0%, #0d0a08 50%, #080610 100%)",
        zIndex:0,
      }}/>

      {/* Contenido */}
      <div style={{
        position:"fixed", inset:0, zIndex:10,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"2rem",
        opacity: mounted ? 1 : 0,
        transition:"opacity 0.5s ease",
      }}>

        {/* Logo */}
        <div className="fade-in" style={{ marginBottom:"4rem", animationDelay:"0s" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="120px">
            <defs>
              <linearGradient id="brushedChampagne2" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#DCD0C0"/>
                <stop offset="25%" stopColor="#C2AD8A"/>
                <stop offset="50%" stopColor="#D4C1A0"/>
                <stop offset="75%" stopColor="#B8A380"/>
                <stop offset="100%" stopColor="#A59170"/>
              </linearGradient>
            </defs>
            <g transform="translate(0, -30)">
              <path d="M 630 120 L 970 120 L 970 140 L 900 140 L 900 290 L 950 290 L 950 310 L 900 310 L 900 460 L 970 460 L 970 480 L 860 480 L 860 200 A 60 60 0 0 0 740 200 L 740 480 L 700 480 L 700 140 L 630 140 Z" fill="url(#brushedChampagne2)"/>
              <text x="810" y="630" fontFamily="'Didot','Playfair Display',serif" fontSize="42" fill="#F5F5F5" style={{letterSpacing:"0.55em"}} textAnchor="middle">THE EDIT</text>
              <text x="814" y="690" fontFamily="'Montserrat','Helvetica Neue',sans-serif" fontSize="13" fill="#A89F91" style={{letterSpacing:"1.3em"}} fontWeight="300" textAnchor="middle">MARBELLA</text>
            </g>
          </svg>
        </div>

        {/* 404 */}
        <div className="fade-in" style={{ animationDelay:"0.2s", textAlign:"center" }}>
          <p style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(6rem,20vw,16rem)",
            fontWeight:900,
            color:"transparent",
            WebkitTextStroke:"1px rgba(255,255,255,0.15)",
            lineHeight:0.85,
            margin:"0 0 2rem",
            userSelect:"none",
          }}>404</p>

          <p style={{
            fontFamily:"'Montserrat',sans-serif",
            fontSize:"0.6rem",
            fontWeight:300,
            color:"rgba(201,169,110,0.7)",
            letterSpacing:"0.6em",
            textTransform:"uppercase",
            margin:"0 0 1rem",
          }}>PÁGINA NO ENCONTRADA</p>

          <p style={{
            fontFamily:"'Montserrat',sans-serif",
            fontSize:"clamp(0.9rem,1.5vw,1.1rem)",
            fontWeight:200,
            color:"rgba(255,255,255,0.4)",
            margin:"0 0 4rem",
            letterSpacing:"0.02em",
          }}>Esta propiedad no existe en nuestra selección.</p>
        </div>

        {/* Línea neon */}
        <div className="neon fade-in" style={{
          width:"1px",
          background:"rgba(201,169,110,0.8)",
          marginBottom:"3rem",
          animationDelay:"0.4s",
          boxShadow:"0 0 8px rgba(201,169,110,0.6)",
        }}/>

        {/* Botón volver */}
        <div className="fade-in" style={{ animationDelay:"0.6s" }}>
          <Link href="/es" style={{
            fontFamily:"'Montserrat',sans-serif",
            fontSize:"0.55rem",
            fontWeight:300,
            color:"rgba(255,255,255,0.5)",
            letterSpacing:"0.5em",
            textTransform:"uppercase",
            textDecoration:"none",
            border:"1px solid rgba(255,255,255,0.1)",
            padding:"1rem 2.5rem",
            transition:"all 0.3s ease",
            display:"inline-block",
          }}
          onMouseEnter={e=>{
            e.currentTarget.style.color="#c9a96e";
            e.currentTarget.style.borderColor="rgba(201,169,110,0.4)";
          }}
          onMouseLeave={e=>{
            e.currentTarget.style.color="rgba(255,255,255,0.5)";
            e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";
          }}>
            ← Volver a la selección
          </Link>
        </div>

      </div>
    </>
  );
}
