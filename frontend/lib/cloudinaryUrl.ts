type SizePreset = "card" | "hero" | "thumb";

const PRESETS: Record<SizePreset, string> = {
  thumb: "w_120,h_120,c_fill",
  card: "w_400,c_limit",
  hero: "w_1200,c_limit",
};

/**
 * Inserts Cloudinary delivery transformations (auto format/quality + a size
 * preset) into an existing Cloudinary URL. Falls back to the original URL
 * unchanged if it isn't a Cloudinary URL (e.g. a local/static image).
 */
export function optimizedImage(url: string | undefined | null, size: SizePreset): string {
  if (!url) return "";
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const insertAt = idx + marker.length;
  const transform = `f_auto,q_auto,${PRESETS[size]}/`;
  return url.slice(0, insertAt) + transform + url.slice(insertAt);
}
