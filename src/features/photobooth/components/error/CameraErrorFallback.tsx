import React from 'react';
import { Camera, AlertTriangle, RefreshCw } from 'lucide-react';

interface CameraErrorFallbackProps {
  onRetry: () => void;
  error?: string;
}

export default function CameraErrorFallback({ onRetry, error }: CameraErrorFallbackProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-base-200">
      <div className="text-center max-w-sm mx-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Camera size={64} className="text-error/20" />
            <AlertTriangle size={32} className="absolute -top-1 -right-1 text-error" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-error mb-2">Camera Access Error</h3>

        <p className="text-sm text-base-content/70 mb-4">
          {error || 'Unable to access your camera. This could be due to:'}
        </p>

        <ul className="text-xs text-base-content/60 mb-6 text-left space-y-1">
          <li>• Camera permissions not granted</li>
          <li>• Camera is in use by another application</li>
          <li>• No camera device found</li>
          <li>• Browser security restrictions</li>
        </ul>

        <div className="space-y-2">
          <button
            onClick={onRetry}
            className="btn btn-primary btn-sm gap-2"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <div className="text-xs text-base-content/50">
            Make sure to allow camera permissions when prompted
          </div>
        </div>
      </div>
    </div>
  );
}
