/**
 * Client-safe video utility functions
 * (No Node.js or server-only dependencies)
 */

/**
 * Extracts standard 11-character YouTube video ID from any URL format
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const clean = url.trim();
  if (clean.length === 11 && !clean.includes('/') && !clean.includes('?')) {
    return clean;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = clean.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Obfuscates a video ID or URL for safe DOM passing
 */
export function obfuscateVideoToken(idOrUrl: string): string {
  try {
    const raw = `ya7_${Date.now()}_${idOrUrl}`;
    if (typeof window !== 'undefined') {
      return btoa(unescape(encodeURIComponent(raw)));
    }
    return Buffer.from(raw).toString('base64');
  } catch {
    return idOrUrl;
  }
}

/**
 * Decodes an obfuscated video token
 */
export function deobfuscateVideoToken(token: string): string {
  try {
    let decoded = '';
    if (typeof window !== 'undefined') {
      decoded = decodeURIComponent(escape(atob(token)));
    } else {
      decoded = Buffer.from(token, 'base64').toString('utf8');
    }
    const parts = decoded.split('_');
    if (parts.length >= 3 && parts[0] === 'ya7') {
      return parts.slice(2).join('_');
    }
    return decoded;
  } catch {
    return token;
  }
}

