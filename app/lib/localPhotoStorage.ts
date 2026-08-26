export interface LocalPhotoStrip {
  id: string;
  dataUrl: string;
  thumbnailDataUrl?: string;
  cardLayout: string;
  frameTheme: string;
  isDuoMode: boolean;
  createdAt: number;
}

const STORAGE_KEY = "tic_a_pic_local_strips_v1";

export function getLocalPhotoStrips(): LocalPhotoStrip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read local photo strips:", err);
    return [];
  }
}

export function saveLocalPhotoStrip(strip: Omit<LocalPhotoStrip, "id" | "createdAt">): LocalPhotoStrip {
  const existing = getLocalPhotoStrips();
  const newStrip: LocalPhotoStrip = {
    ...strip,
    id: `local-strip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
  };

  // Keep last 30 strips in local storage to prevent exceeding browser quota
  const updated = [newStrip, ...existing].slice(0, 30);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Storage quota exceeded or error saving to localStorage:", err);
  }

  return newStrip;
}

export function deleteLocalPhotoStrip(id: string): void {
  const existing = getLocalPhotoStrips();
  const updated = existing.filter((s) => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to delete local strip:", err);
  }
}

export function clearLocalPhotoStrips(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
