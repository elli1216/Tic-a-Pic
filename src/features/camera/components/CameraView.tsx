'use client';

import React from 'react';
import CameraPreview from '@/components/CameraPreview';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';

export default function CameraView(): React.JSX.Element {
  const { photos, isCapturing } = usePhotoboothStore();
  const setCurrentPhoto = usePhotoboothStore((state) => state.setCurrentPhoto);
  const setAppState = usePhotoboothStore((state) => state.setAppState);
  const setIsCapturing = usePhotoboothStore((state) => state.setIsCapturing);
  const goToStrip = usePhotoboothStore((state) => state.goToStrip);

  // Handle photo capture
  const handleCapture = (imageData: string) => {
    setIsCapturing(true);
    setCurrentPhoto(imageData);
    setAppState('preview');

    // Reset capturing state after animation
    setTimeout(() => setIsCapturing(false), 500);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Take Your Photo</h2>
        <p className="text-base-content/70">
          Position yourself and click the capture button
        </p>
      </div>

      <CameraPreview
        onCapture={handleCapture}
        isCapturing={isCapturing}
      />

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
