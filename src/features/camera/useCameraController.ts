'use client';

import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { useCameraStore } from '@/features/common/store/useCameraStore';

/**
 * Centralized camera controller using react-webcam.
 * Handles stream lifecycle, capture, switch, mirror via Zustand state.
 */
export function useCameraController() {
  const addPhoto = usePhotoboothStore((state) => state.addPhoto);

  const isCapturing = useCameraStore((state) => state.isCapturing);
  const setIsCapturing = useCameraStore((state) => state.setIsCapturing);
  const isMirrored = useCameraStore((state) => state.isMirrored);
  const setIsMirrored = useCameraStore((state) => state.setIsMirrored);
  const facingMode = useCameraStore((state) => state.facingMode);
  const setFacingMode = useCameraStore((state) => state.setFacingMode);
  const error = useCameraStore((state) => state.error);
  const setError = useCameraStore((state) => state.setError);
  const isInitializing = useCameraStore((state) => state.isInitializing);
  const setIsInitializing = useCameraStore((state) => state.setIsInitializing);

  const webcamRef = useRef<Webcam>(null);

  // Validate environment before starting camera
  const checkBrowserSupport = useCallback((): boolean => {
    const isSecure =
      window.isSecureContext ||
      location.protocol === 'https:' ||
      location.hostname === 'localhost';

    if (!isSecure) {
      setError(
        '🔒 Camera access requires HTTPS.\n\nPlease:\n• Use HTTPS in production\n• Run dev server over localhost'
      );
      return false;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        '❌ Your browser does not support camera access.\n\nPlease:\n• Update your browser\n• Try Chrome, Firefox, Safari, or Edge'
      );
      return false;
    }

    return true;
  }, [setError]);

  // Start camera with constraints fallback
  const startCamera = useCallback(async () => {
    if (!checkBrowserSupport()) {
      setIsInitializing(false);
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const constraints = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: { ideal: facingMode },
      };

      // We don't await here — react-webcam handles this internally
      console.log('Attempting to start camera with:', constraints);
    } catch (err) {
      console.error('Failed to start camera:', err);
      setError('Failed to initialize camera. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  }, [checkBrowserSupport, facingMode, setIsInitializing, setError]);

  // Called by react-webcam when stream starts
  const onUserMedia = useCallback(() => {
    console.log('✅ Camera stream started');
    setIsInitializing(false);
    setError(null);
  }, [setIsInitializing, setError]);

  // Called when getUserMedia fails
  const onUserMediaError = useCallback(
    (err: Error) => {
      console.error('🎥 Camera error:', err);

      setIsInitializing(false);

      if (err.name === 'NotAllowedError') {
        setError(
          '🚫 Camera permission denied.\n\nPlease:\n• Allow camera access\n• Check site permissions in browser settings'
        );
      } else if (err.name === 'NotFoundError') {
        setError(
          '🔍 No camera found.\n\nPlease:\n• Connect a camera\n• Check device privacy settings'
        );
      } else if (err.name === 'NotReadableError') {
        setError(
          '🔧 Camera busy or unavailable.\n\nPlease:\n• Close other apps using the camera\n• Restart your device'
        );
      } else {
        setError(`⚠️ Camera error: ${err.message}\n\nTry restarting the app.`);
      }
    },
    [setError, setIsInitializing]
  );

  // Switch between front and back camera
  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    console.log(`Switching to ${newFacingMode} camera`);

    setFacingMode(newFacingMode);
    setIsMirrored(newFacingMode === 'user'); // Mirror only front cam

    // Restart stream with new facing mode
    try {
      setIsInitializing(true);
      setError(null);

      // Force remount by changing key
      // handled in UI via key={facingMode}
    } catch (err) {
      console.error('Failed to switch camera:', err);
      setError('Failed to switch camera. Please try again.');
      setFacingMode(facingMode); // revert
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode, setFacingMode, setIsMirrored, setError]);

  // Toggle mirror/flip (only affects front cam visually)
  const toggleMirror = useCallback(() => {
    setIsMirrored(!isMirrored);
  }, [isMirrored, setIsMirrored]);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!webcamRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      const webcam = webcamRef.current;
      const video = webcam.video as HTMLVideoElement;
      if (!video) throw new Error('No video element');

      // Get container dimensions (from CSS)
      const container = webcamRef.current?.video?.getBoundingClientRect();
      if (!container) throw new Error('Could not get container size');

      const containerWidth = container.width;
      const containerHeight = container.height;

      // Calculate video aspect ratio
      const videoRatio = video.videoWidth / video.videoHeight;
      const containerRatio = containerWidth / containerHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      // We're using object-cover → we crop to fit
      if (videoRatio > containerRatio) {
        // Video is wider → crop left/right
        drawWidth = containerWidth;
        drawHeight = containerWidth / videoRatio;
        offsetX = 0;
        offsetY = (containerHeight - drawHeight) / 2;
      } else {
        // Video is taller → crop top/bottom
        drawWidth = containerHeight * videoRatio;
        drawHeight = containerHeight;
        offsetX = (containerWidth - drawWidth) / 2;
        offsetY = 0;
      }

      // Create canvas for final output
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw only the visible part of the video
      ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

      // Apply mirror for front camera
      if (isMirrored && facingMode === 'user') {
        const mirroredCanvas = document.createElement('canvas');
        mirroredCanvas.width = canvas.width;
        mirroredCanvas.height = canvas.height;
        const mCtx = mirroredCanvas.getContext('2d');
        if (!mCtx) throw new Error('Failed to mirror');

        mCtx.translate(canvas.width, 0);
        mCtx.scale(-1, 1);
        mCtx.drawImage(canvas, 0, 0);

        const dataURL = mirroredCanvas.toDataURL('image/jpeg', 0.9);
        addPhoto(dataURL);
      } else {
        const dataURL = canvas.toDataURL('image/jpeg', 0.9);
        addPhoto(dataURL);
      }

      setTimeout(() => setIsCapturing(false), 200);
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo. Please try again.');
      setIsCapturing(false);
    }
  }, [addPhoto, isCapturing, setIsCapturing, setError, isMirrored, facingMode]);

  // Retry handler (restarts camera flow)
  const restartCamera = useCallback(() => {
    console.log('🔁 Restarting camera...');
    setError(null);
    setIsInitializing(true);
    startCamera();
  }, [setError, setIsInitializing, startCamera]);

  return {
    webcamRef,
    capturePhoto,
    switchCamera,
    toggleMirror,
    restartCamera,
    isCapturing,
    isMirrored,
    facingMode,
    isInitializing,
    error,

    // react-webcam callbacks
    onUserMedia,
    onUserMediaError,
  };
}
