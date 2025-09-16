'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { toast } from 'react-hot-toast';
import { Camera, RotateCcw, Save, Download, ArrowLeft, Sparkles } from 'lucide-react';

export default function PhotoboothPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stripCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
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

  const [cameraReady, setCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [allPhotosComplete, setAllPhotosComplete] = useState(false);

  // Check if session exists, redirect if not
  useEffect(() => {
    if (!session) {
      toast.error('Please start a session first!');
      router.push('/');
    }
  }, [session, router]);

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraReady(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please check permissions.');
    }
  }, [facingMode]);

  // Initialize camera on mount
  useEffect(() => {
    initCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (captureTimeoutRef.current) {
        clearTimeout(captureTimeoutRef.current);
      }
    };
  }, [initCamera]);

  // Capture photo from video
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Mirror the image if using front camera
    if (facingMode === 'user') {
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.scale(-1, 1);
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Convert to data URL and save
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setBoothPhoto(currentSlot as 0 | 1 | 2 | 3, photoDataUrl);

    // Play capture sound (optional)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiDYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.play().catch(() => { });

    // Visual feedback
    toast.success(`Photo ${currentSlot + 1} captured!`, { duration: 1000 });

    // Move to next slot or complete
    if (currentSlot < 3) {
      const nextSlot = (currentSlot + 1) as 0 | 1 | 2 | 3;
      setCurrentSlot(nextSlot);
      // Start countdown for next photo
      startCountdownForSlot(nextSlot);
    } else {
      // All photos captured
      setIsCapturing(false);
      setAllPhotosComplete(true);
      toast.success('All photos captured! 📸', { duration: 2000 });
    }
  }, [currentSlot, facingMode, setBoothPhoto, setCurrentSlot, setIsCapturing]);

  // Start countdown for a specific slot
  const startCountdownForSlot = useCallback((slot: number) => {
    setCountdown(3);

    let count = 3;
    countdownIntervalRef.current = setInterval(() => {
      count--;
      setCountdown(count);

      if (count === 0) {
        clearInterval(countdownIntervalRef.current!);
        setCountdown(0);
        // Capture after countdown
        captureTimeoutRef.current = setTimeout(() => {
          capturePhoto();
        }, 100);
      }
    }, 1000);
  }, [setCountdown, capturePhoto]);

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
      // Filter out null photos and save to main photos array
      const validPhotos = boothPhotos.filter(photo => photo !== null) as string[];
      if (validPhotos.length === 0) {
        toast.error('No photos to save!');
        return;
      }

      // Save to store (this will persist to localStorage via existing logic)
      setPhotos(validPhotos);

      // Save each photo to Supabase
      for (const photo of validPhotos) {
        try {
          const response = await fetch('/api/photo/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: session?.session_id,
              photo_data: photo
            })
          });

          if (!response.ok) {
            console.error('Failed to save photo to Supabase');
          }
        } catch (error) {
          console.error('Error saving photo:', error);
        }
      }

      toast.success('Photo strip saved successfully! ✨');

      // Optional: Reset booth photos after saving
      setTimeout(() => {
        resetBoothPhotos();
        setAllPhotosComplete(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving strip:', error);
      toast.error('Failed to save photo strip');
    }
  }, [boothPhotos, session, setPhotos, resetBoothPhotos]);

  // Download strip as image
  const downloadStrip = useCallback(() => {
    if (!stripCanvasRef.current) return;

    const canvas = stripCanvasRef.current;
    const link = document.createElement('a');
    link.download = `tic-a-pic-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    toast.success('Photo strip downloaded! 📥');
  }, []);

  // Draw photo strip preview
  useEffect(() => {
    const drawStrip = () => {
      const canvas = stripCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (portrait strip)
      const stripWidth = 400;
      const stripHeight = 1200;
      canvas.width = stripWidth;
      canvas.height = stripHeight;

      // Clear and set background
      ctx.fillStyle = selectedLayout.background || '#ffffff';
      ctx.fillRect(0, 0, stripWidth, stripHeight);

      // Draw border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, stripWidth - 2, stripHeight - 2);

      // Draw each slot
      selectedLayout.slots.forEach((slot, index) => {
        const slotX = (slot.x / 100) * stripWidth;
        const slotY = (slot.y / 100) * stripHeight;
        const slotWidth = (slot.width / 100) * stripWidth;
        const slotHeight = (slot.height / 100) * stripHeight;

        const photo = boothPhotos[index];

        if (photo) {
          // Draw photo
          const img = new Image();
          img.onload = () => {
            ctx.save();

            // Apply rotation if specified
            if (slot.rotation) {
              ctx.translate(slotX + slotWidth / 2, slotY + slotHeight / 2);
              ctx.rotate((slot.rotation * Math.PI) / 180);
              ctx.translate(-(slotX + slotWidth / 2), -(slotY + slotHeight / 2));
            }

            // Clip to slot bounds
            ctx.beginPath();
            ctx.rect(slotX, slotY, slotWidth, slotHeight);
            ctx.clip();

            // Draw image (cover fit)
            const imgAspect = img.width / img.height;
            const slotAspect = slotWidth / slotHeight;

            let drawWidth, drawHeight, drawX, drawY;

            if (imgAspect > slotAspect) {
              drawHeight = slotHeight;
              drawWidth = drawHeight * imgAspect;
              drawX = slotX - (drawWidth - slotWidth) / 2;
              drawY = slotY;
            } else {
              drawWidth = slotWidth;
              drawHeight = drawWidth / imgAspect;
              drawX = slotX;
              drawY = slotY - (drawHeight - slotHeight) / 2;
            }

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();

            // Draw slot border
            ctx.strokeStyle = '#d1d5db';
            ctx.lineWidth = 1;
            ctx.strokeRect(slotX, slotY, slotWidth, slotHeight);
          };
          img.src = photo;
        } else {
          // Draw empty slot
          ctx.fillStyle = '#f9fafb';
          ctx.fillRect(slotX, slotY, slotWidth, slotHeight);

          // Dashed border
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = '#9ca3af';
          ctx.strokeRect(slotX, slotY, slotWidth, slotHeight);
          ctx.setLineDash([]);

          // Placeholder text
          ctx.fillStyle = '#6b7280';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Show which slot is next during capture
          if (isCapturing && index === currentSlot && countdown > 0) {
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(countdown.toString(), slotX + slotWidth / 2, slotY + slotHeight / 2);
          } else if (index === currentSlot && isCapturing) {
            ctx.fillStyle = '#10b981';
            ctx.fillText('📸 CAPTURING...', slotX + slotWidth / 2, slotY + slotHeight / 2);
          } else {
            ctx.fillText(`Photo ${index + 1}`, slotX + slotWidth / 2, slotY + slotHeight / 2);
          }
        }
      });

      // Add watermark (optional)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.font = 'italic 12px Dancing Script';
      ctx.textAlign = 'center';
      ctx.fillText('Made with Tic a Pic', stripWidth / 2, stripHeight - 20);
    };

    drawStrip();
  }, [boothPhotos, selectedLayout, isCapturing, currentSlot, countdown]);

  // Toggle camera
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="btn btn-ghost btn-sm gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Camera className="text-primary" />
            Photo Booth
          </h1>
          <div className="badge badge-primary badge-lg">
            {selectedLayout.name}
          </div>
        </div>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Section */}
          <div className="space-y-4">
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <div className="relative aspect-[4/3] bg-black">
                {/* Video Preview */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />

                {/* Countdown Overlay */}
                {isCapturing && countdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-8xl font-bold animate-ping">
                      {countdown}
                    </div>
                  </div>
                )}

                {/* Capture Flash Effect */}
                {isCapturing && countdown === 0 && (
                  <div className="absolute inset-0 bg-white animate-pulse opacity-50" />
                )}

                {/* Camera not ready overlay */}
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                    <div className="text-center">
                      <div className="loading loading-spinner loading-lg text-primary"></div>
                      <p className="mt-2 text-base-content/70">Initializing camera...</p>
                    </div>
                  </div>
                )}

                {/* Current slot indicator */}
                {isCapturing && (
                  <div className="absolute top-4 left-4 badge badge-primary badge-lg">
                    Photo {currentSlot + 1} of 4
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="card-body">
                <div className="flex flex-wrap gap-2 justify-center">
                  {!isCapturing && !allPhotosComplete && (
                    <>
                      <button
                        onClick={startCaptureSession}
                        className="btn btn-primary btn-lg gap-2"
                        disabled={!cameraReady}
                      >
                        <Sparkles size={20} />
                        Start Session
                      </button>
                      <button
                        onClick={toggleCamera}
                        className="btn btn-ghost btn-lg"
                        disabled={!cameraReady}
                      >
                        <RotateCcw size={20} />
                        Flip Camera
                      </button>
                    </>
                  )}

                  {allPhotosComplete && (
                    <>
                      <button
                        onClick={saveStrip}
                        className="btn btn-success btn-lg gap-2"
                      >
                        <Save size={20} />
                        Save Strip
                      </button>
                      <button
                        onClick={retakeAll}
                        className="btn btn-warning btn-lg gap-2"
                      >
                        <RotateCcw size={20} />
                        Retake All
                      </button>
                      <button
                        onClick={downloadStrip}
                        className="btn btn-secondary btn-lg gap-2"
                      >
                        <Download size={20} />
                        Download
                      </button>
                    </>
                  )}

                  {isCapturing && (
                    <div className="text-center w-full">
                      <p className="text-lg text-base-content/70">
                        {countdown > 0 ? 'Get ready...' : 'Smile! 📸'}
                      </p>
                      <progress
                        className="progress progress-primary w-full mt-2"
                        value={currentSlot * 25 + (countdown === 0 ? 25 : (3 - countdown) * 8.33)}
                        max="100"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body py-3">
                <h3 className="font-bold text-sm">How it works:</h3>
                <ol className="text-xs space-y-1 text-base-content/70">
                  <li>1. Click "Start Session" to begin</li>
                  <li>2. Strike a pose during the 3-second countdown</li>
                  <li>3. Photos will be captured automatically</li>
                  <li>4. After 4 photos, save or retake your strip!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Photo Strip Preview */}
          <div className="space-y-4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title justify-center">Your Photo Strip</h2>
                <div className="flex justify-center">
                  <div className="bg-white rounded-lg shadow-inner p-2" style={{ maxWidth: '300px' }}>
                    <canvas
                      ref={stripCanvasRef}
                      className="w-full h-auto"
                      style={{ maxHeight: '600px', objectFit: 'contain' }}
                    />
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {[0, 1, 2, 3].map((slot) => (
                    <div
                      key={slot}
                      className={`
                        w-3 h-3 rounded-full transition-all duration-300
                        ${boothPhotos[slot]
                          ? 'bg-success'
                          : slot === currentSlot && isCapturing
                            ? 'bg-warning animate-pulse'
                            : 'bg-base-300'
                        }
                      `}
                    />
                  ))}
                </div>

                {/* Status */}
                <div className="text-center mt-2">
                  <p className="text-sm text-base-content/60">
                    {allPhotosComplete
                      ? '✨ All photos captured! Ready to save or retake.'
                      : isCapturing
                        ? `Capturing photo ${currentSlot + 1} of 4...`
                        : 'Ready to start your photo session'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Session Info */}
            {session && (
              <div className="card bg-base-100 shadow-md">
                <div className="card-body py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/60">Session:</span>
                    <span className="font-mono font-bold">{session.session_id}</span>
                  </div>
                  {session.nickname && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-base-content/60">Nickname:</span>
                      <span className="font-bold">{session.nickname}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}