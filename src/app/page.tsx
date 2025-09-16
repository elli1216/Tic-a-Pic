'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { toast } from 'react-hot-toast';

// Import modular components
import {
  CameraSection,
  PhotoStripPreview,
  SessionInfo,
  Instructions
} from '@/features/photobooth/components';

export default function PhotoboothPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Zustand state
  const session = usePhotoboothStore((state) => state.session);
  const selectedLayout = usePhotoboothStore((state) => state.selectedLayout);
  const boothPhotos = usePhotoboothStore((state) => state.boothPhotos);
  const currentSlot = usePhotoboothStore((state) => state.currentSlot);
  const isCapturing = usePhotoboothStore((state) => state.isCapturing);
  const countdown = usePhotoboothStore((state) => state.countdown);
  const setBoothPhoto = usePhotoboothStore((state) => state.setBoothPhoto);
  const setCurrentSlot = usePhotoboothStore((state) => state.setCurrentSlot);
  const setIsCapturing = usePhotoboothStore((state) => state.setIsCapturing);
  const setCountdown = usePhotoboothStore((state) => state.setCountdown);
  const resetBoothPhotos = usePhotoboothStore((state) => state.resetBoothPhotos);
  const setPhotos = usePhotoboothStore((state) => state.setPhotos);

  // Local state
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [allPhotosComplete, setAllPhotosComplete] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
      }
    };
  }, []);

  // Capture photo from webcam for a specific slot
  const capturePhotoForSlot = useCallback((slot: number) => {
    if (!webcamRef.current) return;

    // Capture screenshot from webcam
    const photoDataUrl = webcamRef.current.getScreenshot();
    if (!photoDataUrl) {
      toast.error('Failed to capture photo');
      return;
    }

    setBoothPhoto(slot as 0 | 1 | 2 | 3, photoDataUrl);

    // Play capture sound (optional)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiDYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.play().catch(() => { });

    // Visual feedback
    toast.success(`Photo ${slot + 1} captured!`, { duration: 1000 });

    // Move to next slot or complete
    if (slot < 3) {
      const nextSlot = (slot + 1) as 0 | 1 | 2 | 3;
      setCurrentSlot(nextSlot);
      // Start countdown for next photo
      startCountdownForSlot(nextSlot);
    } else {
      // All photos captured
      setIsCapturing(false);
      setAllPhotosComplete(true);
      toast.success('All photos captured! 📸', { duration: 2000 });
    }
  }, [setBoothPhoto, setCurrentSlot, setIsCapturing]);

  // Start countdown for a specific slot
  const startCountdownForSlot = useCallback((slot: number) => {
    // Clear any existing intervals/timeouts first
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (captureTimeoutRef.current) {
      clearTimeout(captureTimeoutRef.current);
      captureTimeoutRef.current = null;
    }

    setCountdown(3);

    let count = 3;
    countdownIntervalRef.current = setInterval(() => {
      count--;
      setCountdown(count);

      if (count === 0) {
        clearInterval(countdownIntervalRef.current!);
        setCountdown(0);
        // Capture after countdown - pass the specific slot to avoid stale closures
        captureTimeoutRef.current = setTimeout(() => {
          capturePhotoForSlot(slot);
        }, 100);
      }
    }, 1000);
  }, [setCountdown, capturePhotoForSlot]);

  // Start capture session
  const startCaptureSession = useCallback(() => {
    setIsCapturing(true);
    setCurrentSlot(0);
    setAllPhotosComplete(false);
    startCountdownForSlot(0);
  }, [setIsCapturing, setCurrentSlot, startCountdownForSlot]);

  // Retake all photos
  const retakeAll = useCallback(() => {
    resetBoothPhotos();
    setAllPhotosComplete(false);
    toast.success('Ready to retake photos!');
  }, [resetBoothPhotos]);

  // Save strip to permanent photos
  const saveStrip = useCallback(async () => {
    try {
      // Filter out null photos and validate
      const validPhotos = boothPhotos.filter(photo => photo !== null) as string[];
      if (validPhotos.length === 0) {
        toast.error('No photos to save!');
        return;
      }

      // Save to store (this will persist to localStorage via existing logic)
      setPhotos(validPhotos);

      // Generate the strip image from canvas
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) {
        toast.error('Could not generate strip image');
        return;
      }

      const stripImageData = canvas.toDataURL('image/png');

      // Save complete strip to Supabase
      try {
        const response = await fetch('/api/strip/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: session?.session_id,
            layout_id: selectedLayout.id,
            strip_image_data: stripImageData,
            photo_urls: validPhotos,
            metadata: {
              taken_at: new Date().toISOString(),
              photo_count: validPhotos.length
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save strip to server');
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Unknown error saving strip');
        }

        toast.success('Photo strip saved successfully! ✨');

      } catch (error) {
        console.error('Error saving strip to server:', error);
        toast.error('Failed to save photo strip to server');
      }

      // Optional: Reset booth photos after saving
      setTimeout(() => {
        resetBoothPhotos();
        setAllPhotosComplete(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving strip:', error);
      toast.error('Failed to save photo strip');
    }
  }, [boothPhotos, session, setPhotos, resetBoothPhotos, selectedLayout]);

  // Download strip as image
  const downloadStrip = useCallback(() => {
    // We'll get the canvas from the PhotoStripPreview component
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `tic-a-pic-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    toast.success('Photo strip downloaded! 📥');
  }, []);

  // Toggle camera facing mode
  const toggleCamera = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4">
      {/* Main Content - Side by Side Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Section */}
          <div className="space-y-4">
            <CameraSection
              facingMode={facingMode}
              isCapturing={isCapturing}
              countdown={countdown}
              currentSlot={currentSlot}
              allPhotosComplete={allPhotosComplete}
              onStartSession={startCaptureSession}
              onToggleCamera={toggleCamera}
              onSaveStrip={saveStrip}
              onRetakeAll={retakeAll}
              onDownloadStrip={downloadStrip}
              webcamRef={webcamRef}
            />
            <Instructions />
          </div>

          {/* Photo Strip Preview Section */}
          <div className="space-y-4">
            <PhotoStripPreview
              boothPhotos={boothPhotos}
              selectedLayout={selectedLayout}
              isCapturing={isCapturing}
              currentSlot={currentSlot}
              countdown={countdown}
              allPhotosComplete={allPhotosComplete}
            />
            <SessionInfo session={session} />
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}