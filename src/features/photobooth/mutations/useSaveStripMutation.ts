import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SavedStrip } from '@/shared/types/TYPES';

interface SaveStripData {
  session_id: string | undefined;
  layout_id: string;
  strip_image_data: string;
  photo_urls: string[];
  metadata: {
    taken_at: string;
    photo_count: number;
  };
}

interface SaveStripResponse {
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

/**
 * Save strips to localStorage
 * @param {SavedStrip[]} strips
 */
export const saveLocalStrips = (strips: SavedStrip[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('tic-a-pic-local-strips', JSON.stringify(strips));
  } catch (error) {
    console.error('Error saving local strips:', error);
  }
};

const saveStripToAPI = async (
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

const saveStripLocally = async (
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

export const useSaveStripMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<SaveStripResponse, Error, SaveStripData>({
    mutationFn: async (data: SaveStripData) => {
      // Check if it's a temporary session
      const isTemporarySession =
        typeof window !== 'undefined'
          ? localStorage.getItem('isTemporarySession') === 'true'
          : false;

      if (isTemporarySession) {
        return saveStripLocally(data);
      } else {
        return saveStripToAPI(data);
      }
    },
    onSuccess: (_, variables: SaveStripData) => {
      // Invalidate the saved-strips query to refresh the list
      const isTemporarySession =
        typeof window !== 'undefined'
          ? localStorage.getItem('isTemporarySession') === 'true'
          : false;

      queryClient.invalidateQueries({
        queryKey: ['saved-strips', variables.session_id, isTemporarySession],
      });
    },
  });
};
