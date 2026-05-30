// The Edit Marbella — Design Tokens
// Paleta: Blanco Cálido + Verde Botella
// Grises: HSL ~35° saturación 8-12% (familia cromática cálida)

export const PALETTE = {
  // Fondos — grises cálidos
  bg:           "#FAF8F4",   // hsl(40,25%,97%) — blanco marfil principal
  bgSoft:       "#F2EDE4",   // hsl(35,20%,92%) — fondo suave secundario
  bgMid:        "#E8E2D9",   // hsl(35,15%,88%) — hover states, separadores fuertes
  bgDark:       "#1C2B24",   // Verde botella oscuro — secciones invertidas

  // Textos
  textPrimary:  "#1A1714",   // hsl(30,10%,9%) — casi negro cálido
  textSecond:   "#4A4540",   // hsl(30,8%,28%) — gris medio cálido
  textMuted:    "#8A847C",   // hsl(35,6%,52%) — gris suave cálido
  textInverse:  "#FAF8F4",   // Blanco cálido sobre fondo oscuro

  // Acento principal — Verde botella
  accent:       "#2D4A3E",   // Verde botella profundo
  accentLight:  "#3D6B58",   // Verde botella medio
  accentPale:   "#E4EDE8",   // hsl(150,15%,91%) — verde muy suave

  // Detalle — Oro arena discreto
  gold:         "#C5A880",   // Oro arena
  goldPale:     "#F0E8D8",   // hsl(35,40%,90%) — oro muy tenue

  // Bordes — grises cálidos
  border:       "#DDD8D0",   // hsl(35,12%,84%) — borde principal cálido
  borderStrong: "#C8C0B4",   // hsl(35,12%,74%) — borde visible cálido
  borderSubtle: "#EDEAE4",   // hsl(40,15%,91%) — borde muy sutil

  // Inputs
  inputBg:      "#F5F2EC",   // hsl(38,18%,94%) — fondo input cálido
  inputFocus:   "#2D4A3E",   // Verde botella para focus

  // Estado
  success:      "#2D4A3E",
  error:        "#8B1A1A",
} as const;
