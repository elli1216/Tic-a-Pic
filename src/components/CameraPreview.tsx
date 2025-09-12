'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { LegacyNavigator } from '@/shared/types/TYPES';

export default function CameraPreview() {
  const isCapturing = usePhotoboothStore((state) => state.isCapturing);
  const setIsCapturing = usePhotoboothStore((state) => state.setIsCapturing);
  const addPhoto = usePhotoboothStore((state) => state.addPhoto);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Check if camera API is available
  const isCameraSupported = useCallback(() => {
    // Check if we're in a secure context (HTTPS or localhost)
    const isSecureContext = window.isSecureContext ||
      location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1';

    // Check if mediaDevices API is available
    let hasMediaDevices = !!(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    // Polyfill for older browsers
    if (!hasMediaDevices && navigator) {
      // Check for older getUserMedia implementations
      const legacyNavigator = navigator as LegacyNavigator;
      const getUserMedia = legacyNavigator.getUserMedia ||
        legacyNavigator.webkitGetUserMedia ||
        legacyNavigator.mozGetUserMedia ||
        legacyNavigator.msGetUserMedia;

      if (getUserMedia) {
        // Create a polyfill for navigator.mediaDevices
        if (!navigator.mediaDevices) {
          legacyNavigator.mediaDevices = {} as MediaDevices;
        }

        if (!navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia = function (constraints: MediaStreamConstraints) {
            return new Promise((resolve, reject) => {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        hasMediaDevices = true;
      }
    }

    return { isSecureContext, hasMediaDevices };
  }, []);

  // Initialize camera
  const initCamera = useCallback(async (facing: 'user' | 'environment' = 'user') => {
    try {
      setError(null);

      // Check camera support
      const { isSecureContext, hasMediaDevices } = isCameraSupported();

      if (!isSecureContext) {
        throw new Error('Camera access requires HTTPS or localhost. Please use a secure connection.');
      }

      if (!hasMediaDevices) {
        throw new Error('Camera API is not supported in this browser or device.');
      }

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
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        console.error('Error accessing camera:', err);
        setHasPermission(false);

        // Provide more specific error messages
        let errorMessage = 'Unable to access camera.';

        if (err.message) {
          errorMessage = err.message;
        } else if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera access was denied. Please allow camera permissions and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device.';
        } else if (err.name === 'NotSupportedError') {
          errorMessage = 'Camera is not supported on this device or browser.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.';
        } else if (err.name === 'OverconstrainedError') {
          errorMessage = 'Camera settings are not supported. Trying with basic settings...';

          // Try again with basic constraints
          try {
            const basicConstraints: MediaStreamConstraints = {
              video: true,
              audio: false,
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(basicConstraints);
            setStream(mediaStream);
            setHasPermission(true);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
            }
            return; // Success with basic constraints
          } catch (basicErr: Error | unknown) {
            if (basicErr instanceof Error) {
              errorMessage = 'Camera access failed even with basic settings.';
            } else {
              errorMessage = 'Camera access failed even with basic settings.';
            }
          }
        }

        setError(errorMessage);
      }
    }
  }, [stream, isCameraSupported]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

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
    addPhoto(imageData);

    // Reset capturing state after a brief delay for visual feedback
    setTimeout(() => setIsCapturing(false), 200);
  }, [addPhoto, setIsCapturing]);

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
    const isHttpsError = error?.includes('HTTPS') || error?.includes('secure connection');

    return (
      <div className="flex flex-col items-center justify-center h-96 bg-base-200 rounded-2xl p-8">
        <div className="text-6xl mb-4">
          {isHttpsError ? '🔒' : '📸'}
        </div>
        <h3 className="text-xl font-bold mb-2">
          {isHttpsError ? 'Secure Connection Required' : 'Camera Access Issue'}
        </h3>
        <p className="text-base-content/70 text-center mb-4 max-w-sm">
          {error || 'Please allow camera access to take photos'}
        </p>
        {isHttpsError && (
          <div className="text-sm text-base-content/50 text-center mb-4 max-w-sm">
            <p>Camera access requires:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>HTTPS connection</li>
              <li>Or localhost for development</li>
            </ul>
          </div>
        )}
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
