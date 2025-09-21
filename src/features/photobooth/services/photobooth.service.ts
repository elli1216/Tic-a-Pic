import { SavedStrip } from "@/shared/types/TYPES";

// Helper function to clear local strips
export const clearLocalStrips = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('tic-a-pic-local-strips');
  } catch (error) {
    console.error('Error clearing local strips:', error);
  }
};

// Helper function to save strips to localStorage
export const saveLocalStrips = (strips: SavedStrip[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('tic-a-pic-local-strips', JSON.stringify(strips));
  } catch (error) {
    console.error('Error saving local strips:', error);
  }
};

export interface SaveStripData {
  session_id: string | undefined;
  layout_id: string;
  strip_image_data: string;
  photo_urls: string[];
  metadata: {
    taken_at: string;
    photo_count: number;
  };
}

export interface SaveStripResponse {
  success: boolean;
  strip: SavedStrip;
}

/**
 * Get strips from localStorage
 * @returns {SavedStrip[]}
 */
export const getLocalStrips = (): SavedStrip[] => {
  if (typeof window === 'undefined') return [];

  try {
    const localStrips = localStorage.getItem('tic-a-pic-local-strips');
    return localStrips ? JSON.parse(localStrips) : [];
  } catch (error) {
    console.error('Error loading local strips:', error);
    return [];
  }
};

export const saveStripToAPI = async (
  data: SaveStripData
): Promise<SaveStripResponse> => {
  const response = await fetch('/api/strip/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to save strip');
  }

  return response.json();
};

const generateDate = () => {
  if (typeof window === 'undefined') return '';
  return new Date().toISOString();
};

export const saveStripLocally = async (
  data: SaveStripData
): Promise<SaveStripResponse> => {
  // Create a local strip record
  const localStrip: SavedStrip = {
    id: `local-${generateDate()}`, // Generate a unique local ID
    session_id: data.session_id || 'local',
    layout_id: data.layout_id,
    strip_image_url: data.strip_image_data, // Use the base64 data directly
    photo_urls: data.photo_urls,
    metadata: data.metadata,
    created_at: generateDate(),
    layouts: {
      name: 'Local Layout', // Default name for local strips
      type: 'free',
      config_json: '{}',
    },
  };

  // Get existing local strips and add the new one
  const existingStrips = getLocalStrips();
  const updatedStrips = [localStrip, ...existingStrips];

  // Save to localStorage
  saveLocalStrips(updatedStrips);

  return {
    success: true,
    strip: localStrip,
  };
};