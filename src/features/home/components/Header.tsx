import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import React from 'react';
import ThemeToggle from '@/features/common/components/ThemeToggle';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  onClearSession?: () => void;
}

export default function Header({ onClearSession }: HeaderProps): React.JSX.Element {
  const appState = usePhotoboothStore((state) => state.appState);
  const photos = usePhotoboothStore((state) => state.photos);
  const session = usePhotoboothStore((state) => state.session);
  const goToCamera = usePhotoboothStore((state) => state.goToCamera);
  const goToStrip = usePhotoboothStore((state) => state.goToStrip);
  const goToLayouts = usePhotoboothStore((state) => state.goToLayouts);

  // Handle copying session ID to clipboard
  const handleCopySessionId = async () => {
    if (!session?.session_id) return;

    try {
      await navigator.clipboard.writeText(session.session_id);
      toast.success('Session ID copied successfully!');
    } catch (error) {
      console.error('Failed to copy session ID:', error);
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = session.session_id;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Session ID copied successfully!');
      } catch (fallbackError) {
        toast.error('Failed to copy session ID. Please copy it manually.');
      }
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
                  👤 Session
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 mt-1">
                  <li className="menu-title">
                    <span>Current Session</span>
                  </li>
                  <li>
                    <div className="text-xs text-base-content/50 px-2 pb-1">
                      💡 Click session ID to copy
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Session ID:</span>
                      <button
                        onClick={handleCopySessionId}
                        className="badge badge-primary badge-sm font-mono hover:badge-primary-focus transition-colors cursor-pointer group relative"
                        title="Click to copy session ID"
                      >
                        {session.session_id}
                      </button>
                    </div>
                  </li>
                  {session.nickname && (
                    <li>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm">Nickname:</span>
                        <span className="text-sm text-base-content/70">{session.nickname}</span>
                      </div>
                    </li>
                  )}
                  <li>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Photos:</span>
                      <span className="badge badge-ghost badge-sm">{photos.length}</span>
                    </div>
                  </li>
                  <div className="divider my-1"></div>
                  {onClearSession && (
                    <li>
                      <button
                        onClick={onClearSession}
                        className="text-error hover:bg-error/20 hover:text-error-content"
                      >
                        🗑️ Clear Session
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Photos count for when no session */}
            {!session && (
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="badge badge-ghost badge-sm">
                  {photos.length} photos
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}