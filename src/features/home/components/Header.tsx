import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import React from 'react';
import ThemeToggle from '@/features/common/components/ThemeToggle';
import { clearSession } from '@/lib/session';
import toast from 'react-hot-toast';

export default function Header(): React.JSX.Element {
  const { appState, photos, session, goToCamera, goToStrip, goToLayouts, setSession, setPhotos, setSelectedLayout, setShowSessionModal } = usePhotoboothStore();

  const handleClearSession = () => {
    if (confirm('Are you sure you want to clear your session? This will remove all photos and data.')) {
      clearSession();
      setSession(null);
      setPhotos([]);
      setSelectedLayout(null);
      toast.success('Session cleared successfully');
      // Show session modal for new session
      setTimeout(() => {
        setShowSessionModal(true);
      }, 1000);
    }
  };

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
            
            {/* Session Dropdown */}
            {session && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                  <div className="flex items-center gap-2">
                    <div className="badge badge-primary badge-sm">
                      {session.session_id}
                    </div>
                    {session.nickname && (
                      <span className="hidden md:inline text-base-content/70">{session.nickname}</span>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li className="menu-title">
                    <span>Session: {session.session_id}</span>
                  </li>
                  {session.nickname && (
                    <li className="menu-title">
                      <span>Nickname: {session.nickname}</span>
                    </li>
                  )}
                  <li>
                    <button onClick={() => {
                      navigator.clipboard.writeText(session.session_id);
                      toast.success('Session code copied to clipboard!');
                    }}>
                      📋 Copy Session Code
                    </button>
                  </li>
                  <li>
                    <button onClick={handleClearSession} className="text-error">
                      🗑️ Clear Session
                    </button>
                  </li>
                </ul>
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