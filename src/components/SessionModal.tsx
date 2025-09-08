'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (nickname?: string) => void;
  onRecoverSession: (sessionId: string, nickname?: string) => void;
}

export default function SessionModal({ isOpen, onClose, onCreateSession, onRecoverSession }: SessionModalProps) {
  const [sessionCode, setSessionCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateSessionFormat = (code: string): boolean => {
    const sessionIdRegex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return sessionIdRegex.test(code.toUpperCase());
  };

  const validateSessionWithAPI = async (sessionId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/session/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    const trimmedCode = sessionCode.trim().toUpperCase();
    const trimmedNickname = nickname.trim();

    try {
      if (trimmedCode) {
        // User entered a session code - validate it
        if (!validateSessionFormat(trimmedCode)) {
          setError('Invalid session code format. Use format: ABCD-EFGH-IJKL');
          setIsValidating(false);
          return;
        }

        // Validate with API
        const isValid = await validateSessionWithAPI(trimmedCode);
        
        if (isValid) {
          // Session exists - recover it
          toast.success('Session recovered successfully!');
          onRecoverSession(trimmedCode, trimmedNickname || undefined);
          onClose();
        } else {
          // Session not found - create new one instead
          setError('Session not found. Creating a new session instead...');
          setTimeout(() => {
            onCreateSession(trimmedNickname || undefined);
            onClose();
          }, 1500);
        }
      } else {
        // No session code entered - create new session
        onCreateSession(trimmedNickname || undefined);
        onClose();
      }
    } catch (error) {
      console.error('Session handling error:', error);
      setError('Something went wrong. Creating a new session...');
      setTimeout(() => {
        onCreateSession(trimmedNickname || undefined);
        onClose();
      }, 1500);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSkip = () => {
    onCreateSession();
    onClose();
  };

  const handleSessionCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSessionCode(value);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open glass-effect">
      <div className="modal-box max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-primary mb-2">Welcome to Tic a Pic! 📸</h3>
          <p className="text-base-content/70">
            Start a new session or continue an existing one
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Session Code Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Start new session or enter existing code</span>
            </label>
            <input
              type="text"
              placeholder="Enter session code (e.g., ABCD-EFGH-IJKL)"
              className="input input-bordered input-primary w-full font-mono"
              value={sessionCode}
              onChange={handleSessionCodeChange}
              maxLength={14}
              disabled={isValidating}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Leave empty to create a new session
              </span>
            </label>
          </div>

          {/* Nickname Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your nickname (optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Darla"
              className="input input-bordered input-secondary w-full"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={50}
              disabled={isValidating}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                For labeling your session
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Benefits */}
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">✨ With a session you get:</h4>
            <ul className="text-sm space-y-1 text-base-content/80">
              <li>• Save photos between visits</li>
              <li>• Remember your layout preferences</li>
              <li>• Share your session code with friends</li>
              <li>• Resume from any device</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isValidating}
            >
              {isValidating ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Validating...
                </>
              ) : (
                'Continue'
              )}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="btn btn-ghost flex-1"
              disabled={isValidating}
            >
              Skip for Now
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-base-content/50">
          <p>No login required • Data stored locally on your device</p>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop glass-effect backdrop-blur-md" onClick={handleSkip}></div>
    </div>
  );
}
