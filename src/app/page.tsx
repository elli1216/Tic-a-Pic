"use client";

import React, { useEffect, useState } from 'react';
import SessionModal from '@/components/SessionModal';
// OLD: These components are replaced by the unified booth experience
// import CameraView from '@/features/camera/components/CameraView';
// import PreviewView from '@/features/camera/components/PreviewView';
import StripView from '@/features/strip/components/StripView';
import { Toaster } from 'react-hot-toast';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import {
  getCurrentSession,
  getStoredPhotos,
  getStoredLayout,
  clearSession,

} from '@/lib/session';
import LayoutsView from '@/features/layouts/components/LayoutsView';
import Header from '@/features/home/components/Header';
import { toast } from 'react-hot-toast';
import useThemeStore from '@/features/common/store/useThemeStore';
import { FilmIcon, LayoutIcon } from 'lucide-react';

/**
 * Main photobooth application page
 */
export default function Home(): React.JSX.Element {
  const appState = usePhotoboothStore((state) => state.appState);
  const photos = usePhotoboothStore((state) => state.photos);
  const setSession = usePhotoboothStore((state) => state.setSession);
  const setShowSessionModal = usePhotoboothStore((state) => state.setShowSessionModal);
  const setPhotos = usePhotoboothStore((state) => state.setPhotos);
  const setSelectedLayout = usePhotoboothStore((state) => state.setSelectedLayout);
  const goToStrip = usePhotoboothStore((state) => state.goToStrip);
  const goToLayouts = usePhotoboothStore((state) => state.goToLayouts);
  const theme = useThemeStore((state) => state.theme);

  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
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
      } catch (error) {
        console.error('Error initializing app:', error);
        toast.error('Error loading application. Please refresh the page.');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [setSession, setShowSessionModal, setPhotos, setSelectedLayout]);


  // Handle clear session
  const handleClearSession = () => {
    clearSession();
    setSession(null);
    setPhotos([]);
    // Reset to default layout
    const defaultLayout = {
      id: 'classic-4',
      name: 'Classic Strip',
      type: 'free' as const,
      slots: [
        { x: 10, y: 5, width: 80, height: 20 },
        { x: 10, y: 27, width: 80, height: 20 },
        { x: 10, y: 49, width: 80, height: 20 },
        { x: 10, y: 71, width: 80, height: 20 },
      ],
      background: '#ffffff',
    };
    setSelectedLayout(defaultLayout);
    setShowSessionModal(true);
    toast.success('Session cleared successfully!');
  };

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center">
        <div className="text-center space-y-6">
          {/* Animated Logo/Icon */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-25"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl text-white">📸</span>
              </div>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">Tic-a-Pic</h1>
            <p className="text-lg text-base-content/70">Initializing your photo booth...</p>
            <div className="flex items-center justify-center space-x-1 text-sm text-base-content/50">
              <span>Setting up session</span>
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Header */}
      <Header onClearSession={handleClearSession} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Default/Layouts State - Show layout selection */}
          {(appState === 'layouts' || appState === 'camera') && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-dancing-script)' }}>
                  Welcome to Tic a Pic! 📸
                </h1>
                <p className="text-lg text-base-content/70">
                  Choose a layout to start your photo booth experience
                </p>
              </div>
              <LayoutsView />
            </div>
          )}

          {/* Photo Strip State - View/Edit existing photos */}
          {appState === 'strip' && (
            <div className="animate-fade-in">
              <StripView />
            </div>
          )}

          {/* NEW: Booth State - Unified Photobooth Experience */}
          {appState === 'booth' && (
            <div className="animate-fade-in">
              {/* Booth is now a separate page, redirect there */}
              {typeof window !== 'undefined' && (window.location.href = '/booth')}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) - Updated for new flow */}
      <nav className="fixed bottom-0 left-0 right-0 bg-base-100/95 backdrop-blur-lg border-t border-base-300 shadow-lg sm:hidden z-50">
        <div className="flex justify-around py-3 px-2">
          <button
            onClick={goToLayouts}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200
              ${(appState === 'layouts' || appState === 'camera')
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content/70 hover:text-primary hover:bg-primary/10'
              }
            `}
          >
            <LayoutIcon className="text-xl" />
            <span className="text-xs font-medium">Layouts</span>
          </button>
          <button
            onClick={goToStrip}
            className={`
              flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 relative
              ${appState === 'strip'
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content/70 hover:text-primary hover:bg-primary/10'
              }
              ${photos.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={photos.length === 0}
            title={photos.length === 0 ? 'Select a layout first' : 'View saved strips'}
          >
            <FilmIcon className="text-xl" />
            <span className="text-xs font-medium">
              My Strips
              {photos.length > 0 && (
                <span className="ml-1 bg-secondary text-secondary-content rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                  {photos.length}
                </span>
              )}
            </span>
          </button>
        </div>
      </nav>

      {/* Session Modal */}
      <SessionModal />

      {/* Toast Notifications */}
      <Toaster toastOptions={{
        position: 'top-left',
        style: {
          backgroundColor: theme === 'sunset' ? '#111827' : '#ffffff',
          color: theme === 'sunset' ? '#ffffff' : '#000000',
        },
      }} />

      {/* Bottom padding for mobile nav */}
      <div className="h-20 sm:hidden"></div>
    </div>
  );
}
