'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveStripLocally, saveStripToAPI, SaveStripData, SaveStripResponse } from '../services/photobooth.service';
import { toast } from 'react-hot-toast';

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
        return toast.promise(saveStripLocally(data), {
          loading: 'Saving strip locally...',
          success: 'Strip saved locally!',
          error: 'Failed to save strip locally.',
        });
      } else {
        return toast.promise(saveStripToAPI(data), {
          loading: 'Saving strip to API...',
          success: 'Strip saved to API!',
          error: 'Failed to save strip to API.',
        });
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
