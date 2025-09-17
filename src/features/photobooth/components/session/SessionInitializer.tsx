'use client';

import { useEffect } from 'react';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { clearSession, createSessionOnLocalStorage, getCurrentSession } from '@/lib/session';

export default function SessionInitializer() {
  const session = usePhotoboothStore((state) => state.session);
  const setShowSessionModal = usePhotoboothStore((state) => state.setShowSessionModal);
  const setSession = usePhotoboothStore((state) => state.setSession);
  const loadExistingSession = usePhotoboothStore((state) => state.loadExistingSession);

  useEffect(() => {
    const checkForExistingSession = async () => {
      // Check if we already have a session loaded
      if (session) {
        return;
      }

      // Check if localStorage is available (for SSR compatibility)
      if (typeof window === 'undefined') {
        return;
      }

      try {
        // Check localStorage for existing session data
        const savedSessionData = getCurrentSession();
        const isTemporarySession = localStorage.getItem('isTemporarySession');

        if (savedSessionData) {
          try {
            const sessionData = savedSessionData;

            if (isTemporarySession === 'true') {
              // For temporary sessions, just restore from localStorage
              setSession(sessionData);
              await createSessionOnLocalStorage();
              console.log('Restored temporary session from localStorage');
            } else if (sessionData.session_id) {
              // For persistent sessions, validate with the server
              try {
                await loadExistingSession(sessionData.session_id);
                console.log('Validated and restored session from server');
              } catch (error) {
                console.log('Session validation failed, clearing stored session', error);
                // Session no longer valid, clear it
                await clearSession();
                setShowSessionModal(true);
              }
            }
          } catch (parseError) {
            console.error('Error parsing stored session data:', parseError);
            await clearSession();
            setShowSessionModal(true);
          }
        } else {
          // No existing session found, show the modal
          setShowSessionModal(true);
        }
      } catch (error) {
        console.error('Error checking for existing session:', error);
        setShowSessionModal(true);
      }
    };

    checkForExistingSession();
  }, [session, setShowSessionModal, setSession, loadExistingSession]);

  // This component doesn't render anything
  return null;
}
