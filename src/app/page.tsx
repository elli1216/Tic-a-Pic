'use client';

import React from 'react';
import {
  CameraSection,
  PhotoStripPreview,
  LayoutPicker,
  SessionInfo,
  Instructions
} from '@/features/photobooth/components';
import { usePhotobooth } from '@/features/photobooth/hooks/usePhotobooth';
import { useSaveStripMutation } from '@/features/photobooth/mutations/useSaveStripMutation';

export default function PhotoboothPage() {
  const photobooth = usePhotobooth();
  const saveStripMutation = useSaveStripMutation();

  // Save strip handler
  const handleSaveStrip = () => {
    const stripData = photobooth.prepareStripData();
    if (!stripData) return;

    saveStripMutation.mutate(stripData, {
      onSuccess: photobooth.onSaveSuccess,
      onError: photobooth.onSaveError,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4">
      {/* Main Content - Side by Side Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Section */}
          <div className="space-y-4">
            <CameraSection
              facingMode={photobooth.facingMode}
              isCapturing={photobooth.isCapturing}
              countdown={photobooth.countdown}
              currentSlot={photobooth.currentSlot}
              allPhotosComplete={photobooth.allPhotosComplete}
              onStartSession={photobooth.startCaptureSession}
              onToggleCamera={photobooth.toggleCamera}
              onSaveStrip={handleSaveStrip}
              onRetakeAll={photobooth.retakeAll}
              onDownloadStrip={photobooth.downloadStrip}
              webcamRef={photobooth.webcamRef}
            />
            <Instructions />
          </div>

          {/* Photo Strip Preview Section */}
          <div className="space-y-4">
            <LayoutPicker />
            <PhotoStripPreview
              boothPhotos={photobooth.boothPhotos}
              selectedLayout={photobooth.selectedLayout}
              isCapturing={photobooth.isCapturing}
              currentSlot={photobooth.currentSlot}
              countdown={photobooth.countdown}
              allPhotosComplete={photobooth.allPhotosComplete}
            />
            <SessionInfo session={photobooth.session} />
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={photobooth.canvasRef} className="hidden" />
    </div>
  );
}