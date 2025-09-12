'use client';

import React from 'react';
import PhotoStripCanvas from '@/components/PhotoStripCanvas';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { removePhoto } from '@/lib/session';
import Image from 'next/image';

export default function StripView(): React.JSX.Element {
  const {
    photos,
    selectedLayout,
    removePhoto: removePhotoFromStore,
    goToCamera,
    goToLayouts
  } = usePhotoboothStore();

  // Handle photo removal
  const handleRemovePhoto = (index: number) => {
    // Remove from localStorage
    removePhoto(index);
    // Remove from store
    removePhotoFromStore(index);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Photo Strip</h2>
        <p className="text-base-content/70">
          Add more photos or change the layout
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Photo Strip */}
        <div className="order-2 lg:order-1">
          <PhotoStripCanvas
            showWatermark={true}
            className="w-full"
          />
        </div>

        {/* Controls */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={goToCamera}
              className="btn btn-primary"
            >
              📷 Add Photo
            </button>
            <button
              onClick={goToLayouts}
              className="btn btn-outline"
            >
              🎨 Change Layout
            </button>
          </div>

          {/* Current Photos */}
          {photos.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Your Photos ({photos.length})</h3>
              <div className="grid grid-cols-2 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Layout Info */}
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Current Layout</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{selectedLayout.name}</p>
                <p className="text-sm text-base-content/60">
                  {selectedLayout.slots.length} photo slots
                </p>
              </div>
              <div className={`badge ${selectedLayout.type === 'free' ? 'badge-success' : 'badge-warning'}`}>
                {selectedLayout.type}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
