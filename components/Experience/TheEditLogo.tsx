"use client";

interface Props {
  width?: number;
  height?: number;
  className?: string;
}

export default function TheEditLogo({ width = 120, height = 68 }: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width={width} height={height}>
      <defs>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;1,6..96,700&family=Montserrat:wght@300;400&display=swap');
          .te-main {
            font-family: 'Bodoni Moda', 'Didot', 'Bodoni MT', serif;
            font-weight: 700;
            font-size: 82px;
            fill: #FFFFFF;
            letter-spacing: -1px;
          }
          .te-sub {
            font-family: 'Montserrat', 'Helvetica Neue', sans-serif;
            font-weight: 300;
            font-size: 16px;
            fill: #C5A880;
            letter-spacing: 18px;
            text-transform: uppercase;
          }
        `}</style>
      </defs>
      <g transform="translate(400, 225)">
        <text textAnchor="middle" y="-15" className="te-main">The Edit</text>
        <text textAnchor="middle" y="65" dx="9" className="te-sub">Marbella</text>
      </g>
    </svg>
  );
}
