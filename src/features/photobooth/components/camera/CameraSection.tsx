import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { RotateCcw, Save, Download, Sparkles } from 'lucide-react';
import CameraErrorFallback from './error/CameraErrorFallback';

interface CameraSectionProps {
  facingMode: 'user' | 'environment';
  isCapturing: boolean;
  countdown: number;
  currentSlot: number;
  allPhotosComplete: boolean;
  onStartSession: () => void;
  onToggleCamera: () => void;
  onSaveStrip: () => void;
  onRetakeAll: () => void;
  onDownloadStrip: () => void;
  webcamRef: React.RefObject<Webcam | null>;
}

export default function CameraSection({
  facingMode,
  isCapturing,
  countdown,
  currentSlot,
  allPhotosComplete,
  onStartSession,
  onToggleCamera,
  onSaveStrip,
  onRetakeAll,
  onDownloadStrip,
  webcamRef
}: CameraSectionProps) {
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showErrorFallback, setShowErrorFallback] = useState(false);

  // Camera ready handler
  const handleUserMedia = useCallback(() => {
    setCameraReady(true);
    setCameraError(null);
    setShowErrorFallback(false);
  }, []);

  // Camera error handler
  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error('Error accessing camera:', error);
    setCameraReady(false);
    setShowErrorFallback(true);

    // Set user-friendly error message
    if (typeof error === 'string') {
      setCameraError(error);
    } else if (error.name === 'NotAllowedError') {
      setCameraError('Camera access denied. Please allow camera permissions and try again.');
    } else if (error.name === 'NotFoundError') {
      setCameraError('No camera found. Please connect a camera and try again.');
    } else if (error.name === 'NotReadableError') {
      setCameraError('Camera is in use by another application.');
    } else {
      setCameraError('Unable to access camera. Please check your device and permissions.');
    }
  }, []);

  // Retry camera access
  const retryCamera = useCallback(() => {
    setShowErrorFallback(false);
    setCameraError(null);
    setCameraReady(false);
    onToggleCamera(); // This will trigger re-initialization
  }, [onToggleCamera]);

  return (
    <div className="space-y-4">
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="relative aspect-[4/3] bg-black">
          {/* Webcam Preview */}
          <Webcam
            ref={webcamRef}
            audio={false}
            videoConstraints={{
              facingMode: facingMode,
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.95}
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
          {!cameraReady && !showErrorFallback && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-200">
              <div className="text-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <p className="mt-2 text-base-content/70">Initializing camera...</p>
              </div>
            </div>
          )}

          {/* Camera Error Fallback */}
          {showErrorFallback && (
            <CameraErrorFallback
              onRetry={retryCamera}
              error={cameraError || undefined}
            />
          )}

          {/* Current slot indicator */}
          {isCapturing && cameraReady && (
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
                  onClick={onStartSession}
                  className="btn btn-primary btn-lg gap-2"
                  disabled={!cameraReady}
                >
                  <Sparkles size={20} />
                  Start Session
                </button>
                <button
                  onClick={onToggleCamera}
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
                  onClick={onSaveStrip}
                  className="btn btn-success btn-lg gap-2"
                >
                  <Save size={20} />
                  Save Strip
                </button>
                <button
                  onClick={onRetakeAll}
                  className="btn btn-warning btn-lg gap-2"
                >
                  <RotateCcw size={20} />
                  Retake All
                </button>
                <button
                  onClick={onDownloadStrip}
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
    </div>
  );
}
