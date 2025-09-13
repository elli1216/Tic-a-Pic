'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { Camera, CameraType } from 'react-camera-pro';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { CameraIcon, CameraOffIcon, FlipVertical, SwitchCameraIcon } from 'lucide-react';
import { useCameraStore } from '@/features/common/store/useCameraStore';
import { FacingMode } from '@/shared/types/TYPES';

export default function CameraPreview() {
  const isCapturing = usePhotoboothStore((state) => state.isCapturing);
  const setIsCapturing = usePhotoboothStore((state) => state.setIsCapturing);
  const addPhoto = usePhotoboothStore((state) => state.addPhoto);

  const cameraRef = useRef<CameraType>(null);
  const isMirrored = useCameraStore((state) => state.isMirrored);
  const facingMode = useCameraStore((state) => state.facingMode);
  const setFacingMode = useCameraStore((state) => state.setFacingMode);
  const setIsMirrored = useCameraStore((state) => state.setIsMirrored);
  const error = useCameraStore((state) => state.error);
  const setError = useCameraStore((state) => state.setError);
  const isInitializing = useCameraStore((state) => state.isInitializing);
  const setIsInitializing = useCameraStore((state) => state.setIsInitializing);
  const cameraReady = useCameraStore((state) => state.cameraReady);
  const setCameraReady = useCameraStore((state) => state.setCameraReady);
  const cameraKey = useCameraStore((state) => state.cameraKey);
  const setCameraKey = useCameraStore((state) => state.setCameraKey);

  // Capture photo using react-camera-pro
  const capturePhoto = useCallback(() => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      // Take photo - react-camera-pro returns base64 data URL or ImageData
      const photo = cameraRef.current.takePhoto('base64url');

      if (photo && typeof photo === 'string') {
        // Handle mirroring by creating a canvas and flipping if needed
        if (isMirrored && facingMode === 'user') {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;

              // Flip horizontally
              ctx.save();
              ctx.scale(-1, 1);
              ctx.drawImage(img, -canvas.width, 0, canvas.width, canvas.height);
              ctx.restore();

              const mirroredPhoto = canvas.toDataURL('image/jpeg', 0.8);
              addPhoto(mirroredPhoto);
            } else {
              addPhoto(photo);
            }
          };
          img.src = photo;
        } else {
          addPhoto(photo);
        }
      }

      // Reset capturing state after a brief delay for visual feedback
      setTimeout(() => setIsCapturing(false), 200);
    } catch (err) {
      console.error('Error capturing photo:', err);
      setIsCapturing(false);
      setError('Failed to capture photo. Please try again.');
    }
  }, [addPhoto, setIsCapturing, isMirrored, facingMode, isCapturing]);

  // Switch camera (front/back)
  const switchCamera = useCallback(() => {
    if (cameraRef.current) {
      try {
        const newFacing = cameraRef.current.switchCamera();
        setFacingMode(newFacing as 'user' | 'environment');
        // Auto-set mirror based on camera: front camera typically mirrored, back camera not
        setIsMirrored(newFacing === 'user');
      } catch (err) {
        console.error('Error switching camera:', err);
        // Fallback to manual switching if library method fails
        const newFacing = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(newFacing as 'user' | 'environment');
        setIsMirrored(newFacing === 'user');
      }
    }
  }, [facingMode]);

  // Toggle mirror/flip
  const toggleMirror = useCallback(() => {
    setIsMirrored(!isMirrored);
  }, []);

  // Add timeout for camera initialization
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isInitializing && !cameraReady) {
        console.error('Camera initialization timeout');
        setError('Camera failed to initialize. This might be due to:\n• Camera permissions not granted\n• Camera is being used by another application\n• Browser compatibility issues\n• Try refreshing the page or using a different browser');
        setIsInitializing(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isInitializing, cameraReady]);

  // Handle component mount - reset states and check browser compatibility
  useEffect(() => {
    console.log('CameraPreview component mounted');

    // Check browser compatibility
    const checkBrowserSupport = () => {
      // Check for HTTPS requirement
      const isSecure = window.isSecureContext ||
        location.protocol === 'https:' ||
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1';

      if (!isSecure) {
        setError('Camera access requires HTTPS. Please:\n• Use HTTPS in production\n• Run with "npm run dev:https" for local development\n• Or access via localhost');
        setIsInitializing(false);
        return false;
      }

      // Check for getUserMedia support
      const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

      if (!hasGetUserMedia) {
        setError('Camera API not supported in this browser. Please:\n• Update your browser to the latest version\n• Try Chrome, Firefox, Safari, or Edge\n• Check if camera is disabled in browser settings');
        setIsInitializing(false);
        return false;
      }

      return true;
    };

    if (checkBrowserSupport()) {
      setIsInitializing(true);
      setCameraReady(false);
      setError(null);
    }
  }, []);


  // Error state
  if (error) {
    const isHttpsError = error.includes('HTTPS') || error.includes('secure connection');

    return (
      <div className="flex flex-col items-center justify-center h-96 bg-base-200 rounded-2xl p-8">
        <div className="text-6xl mb-4">
          {isHttpsError ? '🔒' : <CameraOffIcon size={64} />}
        </div>
        <h3 className="text-xl font-bold mb-2">
          {isHttpsError ? 'Secure Connection Required' : 'Camera Access Issue'}
        </h3>
        <div className="text-base-content/70 text-center mb-4 max-w-sm">
          <div className="whitespace-pre-line text-sm">
            {error}
          </div>
        </div>
        {isHttpsError && (
          <div className="text-sm text-base-content/50 text-center mb-4 max-w-sm">
            <p>Camera access requires:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>HTTPS connection</li>
            </ul>
          </div>
        )}
        <button
          onClick={() => {
            setError(null);
            setIsInitializing(true);
            setCameraReady(false);
            setCameraKey(cameraKey + 1); // Force re-render of Camera component
          }}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-base-200 rounded-2xl p-8">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p className="text-base-content/70 mb-4">Initializing camera...</p>
        <div className="text-sm text-base-content/50 text-center max-w-sm">
          <p>If the camera doesn't load:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-left">
            <li>Make sure you allow camera permissions</li>
            <li>Close other apps using the camera</li>
            <li>Try refreshing the page</li>
          </ul>
        </div>
        <button
          onClick={() => {
            console.log('Manual refresh triggered');
            setIsInitializing(true);
            setCameraReady(false);
            setError(null);
            setCameraKey(cameraKey + 1); // Force re-render of Camera component
          }}
          className="btn btn-outline btn-sm mt-4"
        >
          Refresh Camera
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Camera Preview */}
      <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl">
        <div
          className={`w-full h-full transition-transform duration-300 ${isMirrored && facingMode === 'user' ? 'scale-x-[-1]' : ''
            }`}
        >
          <Camera
            key={cameraKey}
            ref={cameraRef}
            facingMode={facingMode as FacingMode}
            aspectRatio="cover"
            numberOfCamerasCallback={(numberOfCameras) => {
              console.log('Number of cameras detected:', numberOfCameras);
              if (numberOfCameras === 0) {
                setError('No cameras detected on this device.');
                setIsInitializing(false);
              }
            }}
            errorMessages={{
              noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
              permissionDenied: 'Permission denied. Please refresh and give camera permission.',
              switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
              canvas: 'Canvas is not supported.'
            }}
            videoReadyCallback={() => {
              console.log('Camera video ready - camera initialized successfully');
              setIsInitializing(false);
              setCameraReady(true);
              setError(null);
            }}
          />
        </div>

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
        {/* Left Controls */}
        <div className="flex items-center gap-2">
          {/* Switch Camera Button */}
          <button
            onClick={switchCamera}
            className="btn btn-ghost btn-circle text-xl"
            title="Switch Camera"
          >
            <SwitchCameraIcon className="w-6 h-6" />
          </button>

          {/* Mirror Toggle Button */}
          <button
            onClick={toggleMirror}
            className={`btn btn-ghost btn-circle text-xl ${isMirrored ? 'bg-primary/20 text-primary' : ''
              }`}
            title={isMirrored ? 'Disable Mirror' : 'Enable Mirror'}
          >
            <FlipVertical className="w-6 h-6" />
          </button>
        </div>

        {/* Capture Button */}
        <button
          onClick={capturePhoto}
          onTouchStart={(e) => e.preventDefault()} // Prevent mobile touch delay
          disabled={isCapturing}
          className="btn btn-circle btn-lg btn-primary shadow-lg hover:shadow-xl transition-all duration-200 touch-manipulation"
          title="Take Photo"
        >
          <CameraIcon className="w-6 h-6" />
        </button>

        {/* Right Controls - Placeholder for balance */}
        <div className="w-20"></div>
      </div>
    </div>
  );
}