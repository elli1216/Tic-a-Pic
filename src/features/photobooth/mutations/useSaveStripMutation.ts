import { useMutation } from '@tanstack/react-query';
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

export const useSaveStripMutation = () => {
  return useMutation<SaveStripResponse, Error, SaveStripData>({
    mutationFn: saveStripToAPI,
  });
};
