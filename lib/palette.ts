// The Edit Marbella — Design Tokens
// Paleta: Blanco + Verde Botella

export const PALETTE = {
  // Fondos
  bg:           "#FAFAF7",   // Blanco cálido principal
  bgSoft:       "#F2EFE9",   // Fondo suave secundario
  bgDark:       "#1C2B24",   // Verde botella oscuro — para secciones invertidas

  // Textos
  textPrimary:  "#111111",   // Casi negro
  textSecond:   "#4A4A4A",   // Gris oscuro
  textMuted:    "#8A8A8A",   // Gris medio
  textInverse:  "#FAFAF7",   // Blanco sobre fondo oscuro

  // Acento principal — Verde botella
  accent:       "#2D4A3E",   // Verde botella profundo
  accentLight:  "#3D6B58",   // Verde botella medio
  accentPale:   "#E8F0EC",   // Verde muy suave para fondos

  // Detalle — Oro arena (solo como línea o separador)
  gold:         "#C5A880",   // Oro arena discreto
  goldPale:     "#F0E8D8",   // Oro muy tenue

  // Bordes
  border:       "#E2DDD6",   // Borde cálido
  borderStrong: "#C8C2B8",   // Borde más visible

  // Estado
  success:      "#2D4A3E",
  error:        "#8B1A1A",
} as const;

export type PaletteKey = keyof typeof PALETTE;
