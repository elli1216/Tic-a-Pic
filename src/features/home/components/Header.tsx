import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import React from 'react';
import ThemeToggle from '@/features/common/components/ThemeToggle';
import { toast } from 'react-hot-toast';
import { UserIcon, TrashIcon, CopyIcon, Camera, Images} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clearSession } from '@/lib/session';

export default function Header(): React.JSX.Element {
  const photos = usePhotoboothStore((state) => state.photos);
  const session = usePhotoboothStore((state) => state.session);
  const setSession = usePhotoboothStore((state) => state.setSession);
  const pathname = usePathname();
  const isTemporarySession = localStorage.getItem('isTemporarySession');
  console.log(isTemporarySession);

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
        console.error('Failed to copy session ID:', fallbackError);
      }
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-base-100/80 backdrop-blur-md border-b border-base-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text hover:opacity-80 transition-opacity">
              Tic a Pic
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-2">
            <Link
              href="/"
              className={`btn btn-ghost btn-sm gap-2 ${pathname === '/' ? 'btn-active' : ''}`}
            >
              <Camera size={16} />
              Photo Booth
            </Link>

            <Link
              href="/saved-strips"
              className={`btn btn-ghost btn-sm gap-2 ${pathname === '/saved-strips' ? 'btn-active' : ''} ${photos.length === 0 && !session ? 'btn-disabled opacity-50' : ''}`}
              title={photos.length === 0 && !session ? 'Take some photos first' : 'View saved strips'}
            >
              <Images size={16} />
              Saved Strips
              {photos.length > 0 && (
                <span className="badge badge-primary badge-sm">{photos.length}</span>
              )}
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="sm:hidden dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-1">
              <li>
                <Link href="/" className={pathname === '/' ? 'active' : ''}>
                  <Camera size={16} />
                  Photo Booth
                </Link>
              </li>
              <li>
                <Link
                  href="/saved-strips"
                  className={pathname === '/saved-strips' ? 'active' : ''}
                >
                  <Images size={16} />
                  Saved Strips
                  {photos.length > 0 && (
                    <span className="badge badge-primary badge-sm">{photos.length}</span>
                  )}
                </Link>
              </li>
            </ul>
          </div>

          {/* Session info & Stats */}
          <div className="flex items-center justify-center gap-4">
            <ThemeToggle />

            {/* Session Dropdown */}
            {session && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm flex items-center gap-1 justify-center">
                  <UserIcon size={16} /> Session
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 mt-1">
                  <li className="menu-title">
                    <span>{`Current Session ${isTemporarySession === 'true' ? '(Temporary)' : ''}`}</span>
                  </li>
                  <li>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs">Session ID:</span>
                      <button
                        onClick={handleCopySessionId}
                        className="badge badge-primary flex items-center gap-1 justify-center badge-sm font-mono hover:badge-primary-focus transition-colors cursor-pointer group relative"
                        title="Click to copy session ID"
                      >
                        <CopyIcon size={12} /> {session.session_id}
                      </button>
                    </div>
                  </li>
                  {session.nickname && (
                    <li>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-xs">Nickname:</span>
                        <span className="text-sm text-base-content/70">{session.nickname}</span>
                      </div>
                    </li>
                  )}
                  <li>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-xs">Photos:</span>
                      <span className="badge badge-ghost badge-sm">{photos.length}</span>
                    </div>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button
                      onClick={() => {
                        clearSession();
                        setSession(null);
                      }}
                      className="text-error hover:bg-error/20 hover:text-error-content cursor-pointer"
                    >
                      <TrashIcon size={16} /> Clear Session
                    </button>
                  </li>
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