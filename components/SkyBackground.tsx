"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SkyBackground() {
  const skyRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  if (pathname.includes("/admin") || pathname.includes("/legal") || pathname.includes("/privacidad") || pathname.includes("/cookies")) return null;

  // Intensidad según la página
  const isProperty = pathname.includes("/propiedades/");
  const isResults = pathname.includes("/propiedades") && !isProperty;
  const opacity = isProperty ? 0.25 : isResults ? 0.5 : 1;

  useEffect(() => {
    let rafId: number;
    let cycleTime = 0;
    const lc = (a: number[], b: number[], k: number) =>
      `rgb(${Math.round(a[0]+(b[0]-a[0])*k)},${Math.round(a[1]+(b[1]-a[1])*k)},${Math.round(a[2]+(b[2]-a[2])*k)})`;
    const palettes = [
      [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
      [[255,245,184],[255,213,79],[79,195,247],[25,118,210],[6,26,58]],
      [[255,167,38],[216,67,21],[106,27,154],[26,18,69],[6,8,24]],
      [[80,40,120],[40,30,80],[26,18,69],[10,10,42],[0,0,0]],
      [[10,10,58],[5,5,36],[2,2,26],[0,0,0],[0,0,0]],
      [[255,107,26],[255,61,0],[194,24,91],[26,35,126],[6,8,24]],
    ];
    const tick = () => {
      cycleTime = (cycleTime + 1/60/90) % 1;
      const t = cycleTime;
      const angle = t * 360 - 90;
      const lx = 50 + Math.cos(angle * Math.PI / 180) * 60;
      const ly = 50 + Math.sin(angle * Math.PI / 180) * 80;
      const pi = Math.floor(t * 5) % 5;
      const k = (t * 5) - Math.floor(t * 5);
      const pA = palettes[pi], pB = palettes[pi + 1];
      if (skyRef.current) {
        skyRef.current.style.background = `radial-gradient(ellipse 130% 90% at ${lx}% ${ly}%,
          ${lc(pA[0],pB[0],k)} 0%,${lc(pA[1],pB[1],k)} 12%,
          ${lc(pA[2],pB[2],k)} 30%,${lc(pA[3],pB[3],k)} 60%,
          ${lc(pA[4],pB[4],k)} 100%)`;
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <style>{`
        .sky-bg{transition:opacity 1.5s ease;}
      `}</style>
      <div
        ref={skyRef}
        className="sky-bg"
        style={{
          position:"fixed", inset:0, zIndex:0,
          opacity,
          pointerEvents:"none",
          transition:"background 0.1s linear, opacity 1.5s ease",
        }}
      />
    </>
  );
}
