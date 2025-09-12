'use client';

import React from 'react';
import CameraPreview from '@/components/CameraPreview';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';

export default function CameraView(): React.JSX.Element {
  const photos = usePhotoboothStore((state) => state.photos);
  const goToStrip = usePhotoboothStore((state) => state.goToStrip);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Take Your Photo</h2>
        <p className="text-base-content/70">
          Position yourself and click the capture button
        </p>
      </div>

      <CameraPreview />

      {photos.length > 0 && (
        <div className="text-center">
          <button
            onClick={goToStrip}
            className="btn btn-outline"
          >
            View Photo Strip ({photos.length})
          </button>
        </div>
      )}
    </div>
  );
}
