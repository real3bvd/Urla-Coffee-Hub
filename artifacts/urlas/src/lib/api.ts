const apiBase = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${normalizedPath}`;
}

export function mediaUrl(url: string | null) {
  if (!url) {
    return null;
  }

  return url.startsWith("/api/") ? apiUrl(url) : url;
}
