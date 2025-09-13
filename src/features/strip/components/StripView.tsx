'use client';

import React, { useState } from 'react';
import PhotoStripCanvas from '@/components/PhotoStripCanvas';
import PhotoEditor from '@/components/PhotoEditor';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { removePhoto } from '@/lib/session';
import Image from 'next/image';
import { CameraIcon, LayoutIcon, EditIcon } from 'lucide-react';

export default function StripView(): React.JSX.Element {
  const {
    photos,
    selectedLayout,
    removePhoto: removePhotoFromStore,
    goToCamera,
    goToLayouts
  } = usePhotoboothStore();

  const [activeTab, setActiveTab] = useState<'strip' | 'edit'>('strip');

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
          View your strip, edit photos, or add more
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === 'strip' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('strip')}
          >
            📸 Strip View
          </button>
          <button
            className={`tab ${activeTab === 'edit' ? 'tab-active' : ''} ${photos.length === 0 ? 'tab-disabled opacity-50' : ''}`}
            onClick={() => photos.length > 0 && setActiveTab('edit')}
          >
            <EditIcon size={16} className="mr-1" />
            Edit Photos ({photos.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'strip' && (
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
                  <CameraIcon size={16} /> Add Photo
                </button>
                <button
                  onClick={goToLayouts}
                  className="btn btn-outline"
                >
                  <LayoutIcon size={16} /> Change Layout
                </button>
              </div>

              {/* Edit Photos Button */}
              {photos.length > 0 && (
                <button
                  onClick={() => setActiveTab('edit')}
                  className="btn btn-secondary w-full"
                >
                  <EditIcon size={16} /> Edit Photos
                </button>
              )}

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
                          width={100}
                          height={100}
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
        )}

        {activeTab === 'edit' && photos.length > 0 && (
          <div>
            <PhotoEditor layout={selectedLayout} />

            {/* Back to Strip Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setActiveTab('strip')}
                className="btn btn-outline"
              >
                ← Back to Strip View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
