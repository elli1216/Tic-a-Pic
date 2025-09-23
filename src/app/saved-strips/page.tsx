'use client';

import React from 'react';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { toast } from 'react-hot-toast';
import { Download, Eye, Camera, RefreshCw, Calendar } from 'lucide-react';
import Image from 'next/image';
import { SavedStrip } from '@/shared/types/TYPES';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/features/photobooth/utils/formatDate.util';
import { useSuspenseQuery } from '@tanstack/react-query';

// Helper function to get strips from localStorage
const getLocalStrips = (): SavedStrip[] => {
  if (typeof window === 'undefined') return [];

  try {
    const localStrips = localStorage.getItem('tic-a-pic-local-strips');
    return localStrips ? JSON.parse(localStrips) : [];
  } catch (error) {
    console.error('Error loading local strips:', error);
    return [];
  }
};

export default function SavedStrips() {
  const session = usePhotoboothStore((state) => state.session);
  const router = useRouter();
  const selectedStrip = usePhotoboothStore((state) => state.selectedStrip);
  const setSelectedStrip = usePhotoboothStore((state) => state.setSelectedStrip);
  const isTemporarySession = typeof window !== 'undefined' ? localStorage.getItem('isTemporarySession') === 'true' : false;

  const query = useSuspenseQuery<SavedStrip[]>({
    queryKey: ['saved-strips', session?.session_id, isTemporarySession],
    queryFn: async () => {
      // If it's a temporary session, get strips from localStorage
      if (isTemporarySession) {
        return getLocalStrips();
      }

      // Otherwise, fetch from database
      if (!session?.session_id) {
        return [];
      }

      const response = await fetch(`/api/strip/list?session_id=${session.session_id}`);
      const data = await response.json();
      return data.strips || [];
    },
  });

  // Download strip (use saved strip image if available)
  const downloadStrip = async (strip: SavedStrip) => {
    try {
      if (strip.strip_image_url) {
        // Use the saved strip image directly
        const link = document.createElement('a');
        link.download = `tic-a-pic-strip-${strip.id}-${Date.now()}.png`;
        link.href = strip.strip_image_url;
        link.click();
        toast.success('Strip downloaded! 📥');
      } else {
        toast.error('Strip image not available');
      }
    } catch (error) {
      console.error('Error downloading strip:', error);
      toast.error('Failed to download strip');
    }
  };

  // View strip in modal
  const viewStrip = (strip: SavedStrip) => {
    setSelectedStrip(strip);
  };

  const handleBackToCamera = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Camera className="text-primary" />
              Saved Photo Strips
            </h1>
            <div className="text-base-content/60 mt-1">
              {query.data.length > 0
                ? `${query.data.length} strip${query.data.length !== 1 ? 's' : ''} saved`
                : 'No strips saved yet'
              }
              {isTemporarySession && (
                <span className="ml-2 badge badge-warning badge-sm">
                  Local Session
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => query.refetch()}
            className={`btn btn-ghost btn-sm gap-2 ${isTemporarySession ? 'hidden' : ''}`}
            disabled={query.isFetching}
          >
            <RefreshCw size={16} className={query.isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Strips Grid */}
        {query.data.length === 0 ? (
          <div className="text-center py-12">
            <Camera size={64} className="mx-auto text-base-content/30 mb-4" />
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">
              No Photo Strips Yet
            </h3>
            <p className="text-base-content/50 mb-6">
              Start taking photos to create your first photo strip!
            </p>
            <button
              onClick={handleBackToCamera}
              className="btn btn-primary gap-2"
              disabled={query.isFetching}
            >
              <Camera size={16} />
              Take Photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {query.data.map((strip) => (
              <div key={strip.id} className="card bg-base-100 shadow-xl">
                <div className="card-body p-4">
                  {/* Strip Preview */}
                  <div className="aspect-[3/4] bg-base-200 rounded-lg overflow-hidden mb-3 relative">
                    {strip.strip_image_url ? (
                      <Image
                        width={300}
                        height={400}
                        src={strip.strip_image_url}
                        alt="Photo Strip"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="grid grid-cols-1 gap-1 h-full">
                        {strip.photo_urls.slice(0, 4).map((photo, index) => (
                          <div key={index} className="bg-base-300 relative overflow-hidden">
                            <Image
                              width={100}
                              height={100}
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        onClick={() => viewStrip(strip)}
                        className="btn btn-primary btn-sm gap-1"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </div>

                  {/* Strip Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                      <Calendar size={14} />
                      <span>{formatDate(strip.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="badge badge-primary badge-sm">
                        {strip.photo_urls.length} photo{strip.photo_urls.length !== 1 ? 's' : ''}
                      </span>
                      <span className="badge badge-secondary badge-sm">
                        {strip.layouts?.name || 'Unknown Layout'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end mt-3 gap-2">
                    <button
                      onClick={() => viewStrip(strip)}
                      className="btn btn-ghost btn-sm gap-1"
                    >
                      <Eye size={14} />
                    </button>

                    <button
                      onClick={() => downloadStrip(strip)}
                      className="btn btn-ghost btn-sm gap-1"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Strip Modal */}
        {selectedStrip && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Photo Strip Preview</h3>
                <button
                  onClick={() => setSelectedStrip(null)}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-center mb-4">
                <div className="bg-white rounded-lg shadow-inner p-4" style={{ maxWidth: '300px' }}>
                  {selectedStrip.strip_image_url ? (
                    <Image
                      width={300}
                      height={900}
                      src={selectedStrip.strip_image_url}
                      alt="Photo Strip"
                      className="w-full h-auto"
                      style={{ maxHeight: '600px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      Strip image not available
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-base-content/60 mb-4">
                <span>Created: {formatDate(selectedStrip.created_at)}</span>
                <span>{selectedStrip.photo_urls.length} photos</span>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => downloadStrip(selectedStrip)}
                  className="btn btn-primary gap-2"
                  disabled={!selectedStrip.strip_image_url}
                >
                  <Download size={16} />
                  Download Strip
                </button>
                <button
                  onClick={() => setSelectedStrip(null)}
                  className="btn btn-ghost"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
