'use client';

import React from 'react';
import LayoutGallery from '@/components/LayoutGallery';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { LayoutConfig } from '@/components/PhotoStripCanvas';
import { saveLayout } from '@/lib/session';
import toast from 'react-hot-toast';

export default function LayoutsView(): React.JSX.Element {
  const { photos, goToStrip } = usePhotoboothStore();
  const selectedLayout = usePhotoboothStore((state) => state.selectedLayout);
  const setSelectedLayout = usePhotoboothStore((state) => state.setSelectedLayout);
  const setAppState = usePhotoboothStore((state) => state.setAppState);

  // Handle layout selection with validation
  const handleLayoutSelect = (layout: LayoutConfig) => {
    // Check if user has photos first
    if (photos.length === 0) {
      toast.error('Please add some photos first before choosing a layout!', {
        position: 'top-right',
      });
      return;
    }

    // Save layout to store and localStorage
    setSelectedLayout(layout);
    saveLayout(layout);

    // Show success message
    toast.success(`Layout "${layout.name}" selected successfully!`, {
      position: 'top-right',
    });

    // Go back to strip view
    setAppState('strip');
  };

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

      <LayoutGallery
        selectedLayout={selectedLayout}
        onLayoutSelect={handleLayoutSelect}
      />

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
