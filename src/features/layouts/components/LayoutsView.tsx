'use client';

import React from 'react';
import LayoutGallery from '@/components/LayoutGallery';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';

export default function LayoutsView(): React.JSX.Element {
  const photos = usePhotoboothStore((state) => state.photos);
  const goToStrip = usePhotoboothStore((state) => state.goToStrip);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Style</h2>
        <p className="text-base-content/70">
          Pick a layout that matches your vibe
        </p>
        {photos.length === 0 && (
          <div className="mt-3 p-3 bg-warning/20 border border-warning/30 rounded-lg">
            <p className="text-warning-content text-sm">
              💡 Add some photos first to see how they&apos;ll look in different layouts!
            </p>
          </div>
        )}
      </div>

      <LayoutGallery />

      <div className="text-center">
        <button
          onClick={goToStrip}
          className={`btn btn-primary ${photos.length === 0 ? 'btn-disabled opacity-50' : ''}`}
        >
          ← Back to Strip
        </button>
      </div>
    </div>
  );
}
