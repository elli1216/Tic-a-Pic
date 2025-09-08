"use client";

import React, { useEffect } from 'react';
import SessionModal from '@/components/SessionModal';
import CameraView from '@/features/camera/components/CameraView';
import PreviewView from '@/features/camera/components/PreviewView';
import StripView from '@/features/strip/components/StripView';
import { Toaster } from 'react-hot-toast';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import {
  getCurrentSession,
  createSession,
  recoverSession,
  getStoredPhotos,
  getStoredLayout
} from '@/lib/session';
import LayoutsView from '@/features/layouts/components/LayoutsView';
import Header from '@/features/home/components/Header';

/**
 * Main photobooth application page
 */
export default function Home(): React.JSX.Element {
  const {
    appState,
    showSessionModal,
    photos,
    setSession,
    setShowSessionModal,
    setPhotos,
    goToCamera,
    goToStrip,
    goToLayouts,
    setSelectedLayout,
  } = usePhotoboothStore();

  // Initialize app on mount
  useEffect(() => {
    // Check for existing session
    const existingSession = getCurrentSession();
    if (existingSession) {
      setSession(existingSession);
    } else {
      // Show session modal for new users
      setShowSessionModal(true);
    }

    // Load stored photos and layout
    const storedPhotos = getStoredPhotos();
    const storedLayout = getStoredLayout();

    setPhotos(storedPhotos);
    if (storedLayout) {
      setSelectedLayout(storedLayout);
    }
  }, [setSession, setShowSessionModal, setPhotos, setSelectedLayout]);

  // Handle session creation
  const handleCreateSession = (nickname?: string) => {
    const newSession = createSession(nickname);
    setSession(newSession);
  };

  // Handle session recovery
  const handleRecoverSession = (sessionId: string, nickname?: string) => {
    const recoveredSession = recoverSession(sessionId, nickname);
    setSession(recoveredSession);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Camera State */}
        {appState === 'camera' && <CameraView />}

        {/* Preview State */}
        {appState === 'preview' && <PreviewView />}

        {/* Photo Strip State */}
        {appState === 'strip' && <StripView />}
        {/* Layouts State */}
        {appState === 'layouts' && (
          <div className="space-y-6">
            <LayoutsView />
          </div>
        )}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-base-100/90 backdrop-blur-md border-t border-base-300 sm:hidden">
        <div className="flex justify-around py-2">
          <button
            onClick={goToCamera}
            className={`btn btn-ghost btn-sm ${appState === 'camera' ? 'btn-active' : ''}`}
          >
            📷 Camera
          </button>
          <button
            onClick={goToStrip}
            className={`btn btn-ghost btn-sm ${appState === 'strip' ? 'btn-active' : ''} ${photos.length === 0 ? 'btn-disabled opacity-50' : ''}`}
            disabled={photos.length === 0}
            title={photos.length === 0 ? 'Take some photos first' : 'View photo strip'}
          >
            🎞️ Strip {photos.length > 0 && `(${photos.length})`}
          </button>
          <button
            onClick={goToLayouts}
            className={`btn btn-ghost btn-sm ${appState === 'layouts' ? 'btn-active' : ''}`}
          >
            🎨 Layouts
          </button>
        </div>
      </nav>

      {/* Session Modal */}
      <SessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onCreateSession={handleCreateSession}
        onRecoverSession={handleRecoverSession}
      />

      {/* Toast Notifications */}
      <Toaster />

      {/* Bottom padding for mobile nav */}
      <div className="h-16 sm:hidden"></div>
    </div>
  );
}
