'use client';

import React, { useState } from 'react';
import LayoutGallery from '@/components/LayoutGallery';
import PhotoEditor from '@/components/PhotoEditor';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';

export default function LayoutsView(): React.JSX.Element {
  const photos = usePhotoboothStore((state) => state.photos);
  const selectedLayout = usePhotoboothStore((state) => state.selectedLayout);
  const goToStrip = usePhotoboothStore((state) => state.goToStrip);
  const [activeTab, setActiveTab] = useState<'layouts' | 'photos'>('layouts');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Customize Your Strip</h2>
        <p className="text-base-content/70">
          Choose layouts and arrange your photos
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === 'layouts' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('layouts')}
          >
            🎨 Layouts
          </button>
          <button
            className={`tab ${activeTab === 'photos' ? 'tab-active' : ''} ${photos.length === 0 ? 'tab-disabled opacity-50' : ''}`}
            onClick={() => photos.length > 0 && setActiveTab('photos')}
          >
            📸 Edit Photos ({photos.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'layouts' && (
          <div>
            {photos.length === 0 && (
              <div className="mb-4 p-3 bg-warning/20 border border-warning/30 rounded-lg">
                <p className="text-warning-content text-sm text-center">
                  💡 Add some photos first to see how they&apos;ll look in different layouts!
                </p>
              </div>
            )}
            <LayoutGallery />
          </div>
        )}

        {activeTab === 'photos' && photos.length > 0 && (
          <PhotoEditor layout={selectedLayout} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-3">
        <button
          onClick={goToStrip}
          className="btn btn-outline"
        >
          ← Back to Strip
        </button>

        {photos.length > 0 && activeTab === 'layouts' && (
          <button
            onClick={() => setActiveTab('photos')}
            className="btn btn-primary"
          >
            Edit Photos →
          </button>
        )}

        {activeTab === 'photos' && (
          <button
            onClick={() => setActiveTab('layouts')}
            className="btn btn-secondary"
          >
            ← Change Layout
          </button>
        )}
      </div>
    </div>
  );
}
