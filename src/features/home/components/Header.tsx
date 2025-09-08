import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import React from 'react';
import ThemeToggle from '@/features/common/components/ThemeToggle';

export default function Header(): React.JSX.Element {
  const { appState, photos, session, goToCamera, goToStrip, goToLayouts } = usePhotoboothStore();

  return (
    <header className="sticky top-0 z-10 bg-base-100/80 backdrop-blur-md border-b border-base-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Tic a Pic
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-4">
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
          </nav>

          {/* Session info & Stats */}
          <div className="flex items-center justify-center gap-4">
            <ThemeToggle />
            {session && (
              <div className="hidden md:flex items-center justify-center gap-2 text-sm">
                <div className="badge badge-primary badge-sm">
                  {session.session_id}
                </div>
                {session.nickname && (
                  <span className="text-base-content/70">{session.nickname}</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="badge badge-ghost badge-sm">
                {photos.length} photos
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}