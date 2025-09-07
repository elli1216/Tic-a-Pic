"use client";

import React, { useState, useEffect } from 'react';
import CameraPreview from '@/components/CameraPreview';
import PhotoStripCanvas, { LayoutConfig } from '@/components/PhotoStripCanvas';
import LayoutGallery, { FREE_LAYOUTS } from '@/components/LayoutGallery';
import SessionModal from '@/components/SessionModal';
import {
  getCurrentSession,
  createSession,
  getStoredPhotos,
  addPhoto,
  removePhoto,
  getStoredLayout,
  saveLayout,
  PhotoSession,
} from '@/lib/session';

type AppState = 'camera' | 'preview' | 'strip' | 'layouts';

/**
 * Main photobooth application page
 */
export default function Home(): React.JSX.Element {
  // State management
  const [appState, setAppState] = useState<AppState>('camera');
  const [session, setSession] = useState<PhotoSession | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<LayoutConfig>(FREE_LAYOUTS[0]);
  const [isCapturing, setIsCapturing] = useState(false);

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
  }, []);

  // Handle session creation
  const handleCreateSession = (nickname?: string) => {
    const newSession = createSession(nickname);
    setSession(newSession);
  };

  // Handle photo capture
  const handleCapture = (imageData: string) => {
    setIsCapturing(true);
    setCurrentPhoto(imageData);
    setAppState('preview');
    
    // Reset capturing state after animation
    setTimeout(() => setIsCapturing(false), 500);
  };

  // Handle photo confirmation
  const handleUsePhoto = () => {
    if (currentPhoto) {
      addPhoto(currentPhoto);
      setPhotos([...photos, currentPhoto]);
      setCurrentPhoto(null);
      setAppState('strip');
    }
  };

  // Handle photo retake
  const handleRetake = () => {
    setCurrentPhoto(null);
    setAppState('camera');
  };

  // Handle photo removal
  const handleRemovePhoto = (index: number) => {
    removePhoto(index);
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
  };

  // Handle layout selection
  const handleLayoutSelect = (layout: LayoutConfig) => {
    setSelectedLayout(layout);
    saveLayout(layout);
    setAppState('strip');
  };

  // Navigation helpers
  const goToCamera = () => setAppState('camera');
  const goToStrip = () => setAppState('strip');
  const goToLayouts = () => setAppState('layouts');

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-base-100/80 backdrop-blur-md border-b border-base-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">📸</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tic a Pic
              </h1>
            </div>

            {/* Session info */}
            {session && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="badge badge-primary badge-sm">
                  {session.session_id}
                </div>
                {session.nickname && (
                  <span className="text-base-content/70">{session.nickname}</span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-2 text-sm">
              <span className="badge badge-ghost badge-sm">
                {photos.length} photos
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Camera State */}
        {appState === 'camera' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Take Your Photo</h2>
              <p className="text-base-content/70">
                Position yourself and click the capture button
              </p>
            </div>

            <CameraPreview 
              onCapture={handleCapture}
              isCapturing={isCapturing}
            />

            {photos.length > 0 && (
              <div className="text-center">
                <button 
                  onClick={goToStrip}
                  className="btn btn-outline"
                >
                  View Photo Strip ({photos.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* Preview State */}
        {appState === 'preview' && currentPhoto && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">How&apos;s This Look?</h2>
              <p className="text-base-content/70">
                Love it or retake it!
              </p>
            </div>

            {/* Photo Preview */}
            <div className="relative aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={currentPhoto} 
                alt="Captured photo" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                onClick={handleRetake}
                className="btn btn-outline flex-1"
              >
                📷 Retake
              </button>
              <button 
                onClick={handleUsePhoto}
                className="btn btn-primary flex-1"
              >
                ✨ Use in Strip
              </button>
            </div>
          </div>
        )}

        {/* Photo Strip State */}
        {appState === 'strip' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Your Photo Strip</h2>
              <p className="text-base-content/70">
                Add more photos or change the layout
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Photo Strip */}
              <div className="order-2 lg:order-1">
                <PhotoStripCanvas
                  photos={photos}
                  layout={selectedLayout}
                  showWatermark={true}
                  className="w-full"
                />
              </div>

              {/* Controls */}
              <div className="order-1 lg:order-2 space-y-6">
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={goToCamera}
                    className="btn btn-primary"
                  >
                    📷 Add Photo
                  </button>
                  <button 
                    onClick={goToLayouts}
                    className="btn btn-outline"
                  >
                    🎨 Change Layout
                  </button>
                </div>

                {/* Current Photos */}
                {photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Your Photos ({photos.length})</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={photo} 
                            alt={`Photo ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemovePhoto(index)}
                            className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Layout Info */}
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Current Layout</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selectedLayout.name}</p>
                      <p className="text-sm text-base-content/60">
                        {selectedLayout.slots.length} photo slots
                      </p>
                    </div>
                    <div className={`badge ${selectedLayout.type === 'free' ? 'badge-success' : 'badge-warning'}`}>
                      {selectedLayout.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layouts State */}
        {appState === 'layouts' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your Style</h2>
              <p className="text-base-content/70">
                Pick a layout that matches your vibe
              </p>
            </div>

            <LayoutGallery
              selectedLayout={selectedLayout}
              onLayoutSelect={handleLayoutSelect}
            />

            <div className="text-center">
              <button 
                onClick={goToStrip}
                className="btn btn-primary"
              >
                ← Back to Strip
              </button>
            </div>
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
            className={`btn btn-ghost btn-sm ${appState === 'strip' ? 'btn-active' : ''}`}
            disabled={photos.length === 0}
          >
            🎞️ Strip
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
      />

      {/* Bottom padding for mobile nav */}
      <div className="h-16 sm:hidden"></div>
    </div>
  );
}
