
// Convierte URL de Google Drive a URL directa
export function convertGDriveUrl(url: string): string {
  if (!url) return url;
  
  // Si ya es URL directa de gdrive, devolverla tal cual
  if (url.includes("drive.google.com/uc?")) return url;
  
  // Extraer ID de diferentes formatos de Google Drive
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const id = match[1];
      // Para videos usar embed, para imágenes usar uc
      if (url.includes("preview") || url.includes("video")) {
        return `https://drive.google.com/file/d/${id}/preview`;
      }
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
  }
  
  return url; // Si no es Drive, devolver original
}
