
// Convierte URL de Google Drive a URL del proxy interno
export function convertGDriveUrl(url: string): string {
  if (!url) return url;
  
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
      return `/api/drive?id=${id}`;
    }
  }
  
  return url;
}
