// Convierte URL de Google Drive o Supabase al proxy de imagen optimizada
export function convertGDriveUrl(url: string, width = 1200, quality = 80): string {
  if (!url) return url;
  if (url.startsWith("/api/image")) return url; // ya convertida
  if (url.startsWith("/api/drive")) {
    const id = url.split("id=")[1];
    return id ? `/api/image?id=${id}&w=${width}&q=${quality}` : url;
  }

  // URLs de Supabase Storage — pasar por proxy
  if (url.includes("supabase.co/storage") || url.startsWith("/gallery/") || url.startsWith("/storage/")) {
    const encoded = encodeURIComponent(url.startsWith("/") ? `https://sqdvkfcghdjxtyuybxpy.supabase.co${url}` : url);
    return `/api/image?url=${encoded}&w=${width}&q=${quality}`;
  }

  // URLs de Google Drive
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `/api/image?id=${match[1]}&w=${width}&q=${quality}`;
    }
  }

  return url;
}

// Versión para thumbnails pequeños — carrusel mobile
export function convertGDriveThumb(url: string): string {
  return convertGDriveUrl(url, 640, 75);
}
