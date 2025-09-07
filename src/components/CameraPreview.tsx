'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraPreviewProps {
  onCapture: (imageData: string) => void;
  isCapturing?: boolean;
}

export default function CameraPreview({ onCapture, isCapturing = false }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Initialize camera
  const initCamera = useCallback(async (facing: 'user' | 'environment' = 'user') => {
    try {
      setError(null);

      // Stop existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('Unable to access camera. Please check permissions.');
    }
  }, [stream]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    onCapture(imageData);
  }, [onCapture]);

  // Switch camera (front/back)
  const switchCamera = useCallback(() => {
    const newFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacing);
    initCamera(newFacing);
  }, [facingMode, initCamera]);

  // Initialize camera on mount
  useEffect(() => {
    initCamera(facingMode);

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Permission denied state
  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-base-200 rounded-2xl p-8">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-bold mb-2">Camera Permission Required</h3>
        <p className="text-base-content/70 text-center mb-4">
          {error || 'Please allow camera access to take photos'}
        </p>
        <button
          onClick={() => initCamera(facingMode)}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (hasPermission === null) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-base-200 rounded-2xl">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p className="text-base-content/70">Initializing camera...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Video Preview */}
      <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Camera overlay UI */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner guides */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/50"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/50"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/50"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/50"></div>
        </div>

        {/* Capture flash effect */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white animate-pulse"></div>
        )}
      </div>

      {/* Camera Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Switch Camera Button */}
        <button
          onClick={switchCamera}
          className="btn btn-ghost btn-circle text-xl"
          title="Switch Camera"
        >
          🔄
        </button>

        {/* Capture Button */}
        <button
          onClick={capturePhoto}
          disabled={isCapturing}
          className="btn btn-circle btn-lg btn-primary shadow-lg hover:shadow-xl transition-all duration-200"
          title="Take Photo"
        >
          <span className="text-2xl">📸</span>
        </button>

        {/* Placeholder for balance */}
        <div className="w-12"></div>
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
