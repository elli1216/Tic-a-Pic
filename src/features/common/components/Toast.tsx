'use client';

import React, { useEffect } from 'react';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';

export default function Toast(): React.JSX.Element | null {
  const { toast, setToast } = usePhotoboothStore();

  // Auto dismiss toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  const getToastClass = () => {
    switch (toast.type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-error';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="toast toast-top toast-center z-50">
      <div className={`alert ${getToastClass()} shadow-lg`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{getIcon()}</span>
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="btn btn-ghost btn-xs ml-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}