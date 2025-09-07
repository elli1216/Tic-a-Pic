'use client';

import React, { useState } from 'react';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (nickname?: string) => void;
}

export default function SessionModal({ isOpen, onClose, onCreateSession }: SessionModalProps) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();
    onCreateSession(trimmedNickname || undefined);
    onClose();
  };

  const handleSkip = () => {
    onCreateSession();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-primary mb-2">Welcome to Tic a Pic! 📸</h3>
          <p className="text-base-content/70">
            Want to save your photobooth session? Give it a fun nickname!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Session Nickname (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 'Darla's Birthday', 'Squad Goals'..."
              className="input input-bordered w-full"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={50}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                This helps you find your photos later
              </span>
            </label>
          </div>

          {/* Benefits */}
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">✨ With a session you get:</h4>
            <ul className="text-sm space-y-1 text-base-content/80">
              <li>• Save photos between visits</li>
              <li>• Remember your layout preferences</li>
              <li>• Get a unique session code</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              Create Session 🎉
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="btn btn-ghost flex-1"
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
      <div className="modal-backdrop" onClick={handleSkip}></div>
    </div>
  );
}