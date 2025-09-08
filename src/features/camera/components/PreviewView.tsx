'use client';

import React from 'react';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { addPhoto } from '@/lib/session';

export default function PreviewView(): React.JSX.Element {
  const {
    currentPhoto,
    setCurrentPhoto,
    addPhoto: addPhotoToStore,
    setAppState
  } = usePhotoboothStore();

  // Handle photo confirmation
  const handleUsePhoto = () => {
    if (currentPhoto) {
      // Add to local storage
      addPhoto(currentPhoto);
      // Add to store
      addPhotoToStore(currentPhoto);
      setCurrentPhoto(null);
      setAppState('strip');
    }
  };

  // Handle photo retake
  const handleRetake = () => {
    setCurrentPhoto(null);
    setAppState('camera');
  };

  if (!currentPhoto) {
    return <div>No photo to preview</div>;
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">How&apos;s This Look?</h2>
        <p className="text-base-content/70">
          Love it or retake it!
        </p>
      </div>

      {/* Photo Preview */}
      <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={currentPhoto}
          alt="Captured photo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleRetake}
          className="btn btn-outline flex-1"
        >
          📷 Retake
        </button>
        <button
          onClick={handleUsePhoto}
          className="btn btn-primary flex-1"
        >
          ✨ Use in Strip
        </button>
      </div>
    </div>
  );
}
