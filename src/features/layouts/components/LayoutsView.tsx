'use client';

import React from 'react';
import LayoutGallery from '@/components/LayoutGallery';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { Lightbulb } from 'lucide-react';

export default function LayoutsView(): React.JSX.Element {
  const photos = usePhotoboothStore((state) => state.photos);
  const goToStrip = usePhotoboothStore((state) => state.goToStrip);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Layout</h2>
        <p className="text-base-content/70">
          Select a layout for your photo strip
        </p>
      </div>

      {/* Layout Gallery */}
      <div className="min-h-[400px]">
        {photos.length === 0 && (
          <div className="mb-4 p-3 bg-warning/20 border border-warning/30 rounded-lg">
            <p className="flex items-center justify-center gap-1 text-warning-content text-sm text-center">
              <Lightbulb size={12} className="text-warning" /> Add some photos first to see how they&apos;ll look in different layouts!
            </p>
          </div>
        )}
        <LayoutGallery />
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-3 text-warning-content">
        <button
          onClick={goToStrip}
          className="btn btn-outline text-warning-content"
          disabled={photos.length === 0}
          title={photos.length === 0 ? 'Take some photos first' : 'View photo strip'}
        >
          ← Back to Strip
        </button>
      </div>
    </div>
  );
}
