'use client';

import React from 'react';
import Webcam from 'react-webcam';
import { CameraIcon, CameraOffIcon, FlipVertical, SwitchCameraIcon } from 'lucide-react';
import { useCameraController } from '@/features/camera/useCameraController';
import { FacingMode } from '@/shared/types/TYPES';

//Configure video constraints
const getVideoConstraints = (facingMode: FacingMode) => ({
  width: { ideal: 1280 },
  height: { ideal: 720 }, // 3:4 aspect ratio
  facingMode: { ideal: facingMode },
  aspectRatio: 1.7777777777777777, // 16:9 = 1.7777777777777777
});

export default function CameraPreview() {
  const {
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
    onUserMedia,
    onUserMediaError,
  } = useCameraController();

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-base-200 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">
          {error.includes('HTTPS') ? '🔒' : <CameraOffIcon size={64} className="text-warning" />}
        </div>
        <h3 className="text-xl font-bold mb-2">Camera Access Issue</h3>
        <div className="text-base-content/70 whitespace-pre-line text-sm mb-4 max-w-sm">
          {error}
        </div>
        <button onClick={restartCamera} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  // Loading State
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-base-200 rounded-2xl p-8">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p className="text-base-content/70 mb-4">Starting camera...</p>
        <div className="text-sm text-base-content/50 text-center max-w-sm">
          <ul className="list-disc list-inside space-y-1 text-left">
            <li>Allow camera permission if prompted</li>
            <li>Close other apps using the camera</li>
            <li>Ensure camera is connected and functional</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Camera Preview */}
      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto">
        <div className={`w-full h-full transition-transform duration-300 ${isMirrored && facingMode === 'user' ? 'scale-x-[-1]' : ''}`}>
          <Webcam
            ref={webcamRef}
            key={facingMode}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={getVideoConstraints(facingMode) as MediaTrackConstraints}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError as (error: string | DOMException) => void}
            mirrored={false}
            className="object-cover"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Left: Switch & Mirror */}
        <div className="flex items-center gap-2">
          <button
            onClick={switchCamera}
            className="btn btn-ghost btn-circle text-xl"
            title={`Switch to ${facingMode === 'user' ? 'Back' : 'Front'} Camera`}
          >
            <SwitchCameraIcon className="w-6 h-6" />
          </button>

          <button
            onClick={toggleMirror}
            className={`btn btn-ghost btn-circle text-xl ${isMirrored ? 'bg-primary/20 text-primary' : ''}`}
            title={isMirrored ? 'Disable Mirror' : 'Enable Mirror'}
          >
            <FlipVertical className="w-6 h-6" />
          </button>
        </div>

        {/* Center: Capture Button */}
        <button
          onClick={capturePhoto}
          onTouchStart={(e) => e.preventDefault()} // Prevent touch delay
          disabled={isCapturing}
          className="btn btn-circle btn-lg btn-primary shadow-lg hover:shadow-xl touch-manipulation active:scale-95 transition-all"
          title="Take Photo"
        >
          <CameraIcon className="w-6 h-6" />
        </button>

        {/* Right: Placeholder */}
        <div className="w-20"></div>
      </div>
    </div>
  );
}