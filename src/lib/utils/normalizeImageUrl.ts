export function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  if (process.env.NODE_ENV === "development") {
    return url.replace("https://chriostretch-new.local", "http://chriostretch-new.local");
  }

  return url;
}

