'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { toast } from 'react-hot-toast';

interface CreateSessionForm {
  nickname: string;
}

interface LoadSessionForm {
  sessionId: string;
}

export default function SessionModal() {
  const showSessionModal = usePhotoboothStore((state) => state.showSessionModal);
  const setShowSessionModal = usePhotoboothStore((state) => state.setShowSessionModal);
  const createSession = usePhotoboothStore((state) => state.createSession);
  const loadExistingSession = usePhotoboothStore((state) => state.loadExistingSession);

  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'create' | 'existing'>('create');

  const createForm = useForm<CreateSessionForm>({
    defaultValues: {
      nickname: ''
    }
  });

  const loadForm = useForm<LoadSessionForm>({
    defaultValues: {
      sessionId: ''
    }
  });

  const onCreateSubmit = async (data: CreateSessionForm) => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const trimmedNickname = data.nickname.trim();
      await createSession(trimmedNickname || undefined);
      setShowSessionModal(false);
      toast.success('Session created successfully!');
      createForm.reset();
    } catch (error) {
      toast.error('Failed to create session!');
      console.error('Failed to create session:', error);
      // Error handling is done in store
    } finally {
      setIsCreating(false);
    }
  };

  const handleSkip = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      await createSession();
      setShowSessionModal(false);
      toast.success('Session created!');
    } catch (error) {
      toast.error('Failed to create session!');
      console.error('Failed to create session:', error);
      // Error handling is done in store
    } finally {
      setIsCreating(false);
    }
  };

  const onLoadSubmit = async (data: LoadSessionForm) => {
    if (isLoading || !data.sessionId.trim()) return;

    setIsLoading(true);
    try {
      await loadExistingSession(data.sessionId.trim().toUpperCase());
      setShowSessionModal(false);
      toast.success('Session loaded successfully!');
      // Reset form and mode
      loadForm.reset();
      setMode('create');
    } catch (error) {
      toast.error('Failed to load session!');
      console.error('Failed to load session:', error);
      // Error handling is done in store
    } finally {
      setIsLoading(false);
    }
  };

  if (!showSessionModal) return null;

  return (
    <div className="modal modal-open glass-effect">
      <div className="modal-box max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-primary mb-2">Welcome to Tic a Pic! 📸</h3>
          <p className="text-base-content/70">
            {mode === 'create'
              ? "Want to save your photobooth session? Give it a fun nickname!"
              : "Enter your session ID to continue where you left off!"
            }
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab flex-1 ${mode === 'create' ? 'tab-active' : ''}`}
            onClick={() => setMode('create')}
            type="button"
          >
            Create New Session
          </button>
          <button
            className={`tab flex-1 ${mode === 'existing' ? 'tab-active' : ''}`}
            onClick={() => setMode('existing')}
            type="button"
          >
            Use Existing Session
          </button>
        </div>

        {/* Create Session Form */}
        {mode === 'create' && (
          <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Session Nickname (Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 'Darla's Birthday', 'Squad Goals'..."
                className="input input-bordered input-primary w-full"
                {...createForm.register('nickname', { maxLength: 50 })}
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
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating...
                  </>
                ) : (
                  'Create Session 🎉'
                )}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="btn btn-ghost flex-1"
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Skip for Now'}
              </button>
            </div>
          </form>
        )}

        {/* Existing Session Form */}
        {mode === 'existing' && (
          <form onSubmit={loadForm.handleSubmit(onLoadSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Session ID</span>
              </label>
              <input
                type="text"
                placeholder="e.g., A1B2-C3D4-E5F6"
                className="input input-bordered input-primary w-full font-mono"
                {...loadForm.register('sessionId', {
                  required: 'Session ID is required',
                  maxLength: 14,
                  pattern: {
                    value: /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/,
                    message: 'Invalid session ID format'
                  },
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }
                })}
              />
              {loadForm.formState.errors.sessionId && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {loadForm.formState.errors.sessionId.message}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Enter the session ID from your previous visit
                </span>
              </label>
            </div>

            {/* Info */}
            <div className="bg-info/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-info">🔍 Find Your Session ID</h4>
              <p className="text-sm text-base-content/80">
                Your session ID was displayed when you first created your session.
                It looks like <code className="bg-base-300 px-1 rounded">A1B2-C3D4-E5F6</code>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isLoading || !loadForm.formState.isValid}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Loading...
                  </>
                ) : (
                  'Load Session 🔓'
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode('create')}
                className="btn btn-ghost flex-1"
                disabled={isLoading}
              >
                Create New Instead
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-base-content/50">
          <p>No login required • Session saved securely</p>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop glass-effect backdrop-blur-md" onClick={handleSkip}></div>
    </div>
  );
}
