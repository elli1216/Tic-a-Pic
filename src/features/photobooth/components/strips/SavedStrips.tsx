'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { toast } from 'react-hot-toast';
import { Download, Eye, Camera, RefreshCw, Calendar } from 'lucide-react';

interface SavedStrip {
  id: string;
  session_id: string;
  layout_id: string;
  strip_image_url: string;
  photo_urls: string[]; // JSONB array
  metadata?: {
    taken_at?: string;
    photo_count?: number;
    stickers?: any[];
    filters?: any[];
  };
  created_at: string;
  layouts?: {
    name: string;
    type: string;
    config_json: string;
    thumbnail_url?: string;
  };
}

interface PhotoStrip {
  id: string;
  photos: string[];
  created_at: string;
  session_id: string | undefined;
  strip_image_url?: string;
  layout_name?: string;
}

export default function SavedStrips() {
  const session = usePhotoboothStore((state) => state.session);
  const photos = usePhotoboothStore((state) => state.photos);
  const selectedLayout = usePhotoboothStore((state) => state.selectedLayout);

  const [savedStrips, setSavedStrips] = useState<SavedStrip[]>([]);
  const [photoStrips, setPhotoStrips] = useState<PhotoStrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrip, setSelectedStrip] = useState<PhotoStrip | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isTemporarySession = localStorage.getItem('isTemporarySession');

  // Fetch saved strips from API
  useEffect(() => {
    const fetchSavedStrips = async () => {
      if (!session?.session_id && isTemporarySession === 'true') {
        // If no session, just show local photos as a strip
        if (photos.length > 0) {
          const localStrip: PhotoStrip = {
            id: 'local',
            photos: photos,
            created_at: new Date().toISOString(),
            session_id: 'local',
            layout_name: 'Current Session'
          };
          setPhotoStrips([localStrip]);
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/strip/list?session_id=${session?.session_id}`);
        const data = await response.json();

        if (data.success && data.strips) {
          setSavedStrips(data.strips);

          // Convert saved strips to PhotoStrip format for display
          const strips: PhotoStrip[] = data.strips.map((strip: SavedStrip) => ({
            id: strip.id,
            photos: strip.photo_urls,
            created_at: strip.created_at,
            session_id: strip.session_id,
            strip_image_url: strip.strip_image_url,
            layout_name: strip.layouts?.name || 'Unknown Layout'
          }));

          // Add local photos if they exist and are different
          if (photos.length > 0) {
            const localStrip: PhotoStrip = {
              id: 'local-current',
              photos: photos,
              created_at: new Date().toISOString(),
              session_id: session?.session_id,
              layout_name: 'Current Session'
            };
            strips.unshift(localStrip); // Add to beginning
          }

          setPhotoStrips(strips);
        }
      } catch (error) {
        console.error('Error fetching saved strips:', error);
        toast.error('Failed to load saved strips');

        // Fallback to local photos
        if (photos.length > 0) {
          const localStrip: PhotoStrip = {
            id: 'local-fallback',
            photos: photos,
            created_at: new Date().toISOString(),
            session_id: session?.session_id || 'local',
            layout_name: 'Current Session'
          };
          setPhotoStrips([localStrip]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSavedStrips();
  }, [session, photos]);

  // Generate strip preview canvas
  const generateStripCanvas = (strip: PhotoStrip): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(canvas);

      // Set canvas size (portrait strip)
      const stripWidth = 400;
      const stripHeight = 1200;
      canvas.width = stripWidth;
      canvas.height = stripHeight;

      // Clear and set background
      ctx.fillStyle = selectedLayout.background || '#ffffff';
      ctx.fillRect(0, 0, stripWidth, stripHeight);

      // Draw border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, stripWidth - 2, stripHeight - 2);

      let loadedImages = 0;
      const totalImages = Math.min(strip.photos.length, 4);

      if (totalImages === 0) {
        resolve(canvas);
        return;
      }

      // Draw each photo
      strip.photos.slice(0, 4).forEach((photoUrl, index) => {
        const slot = selectedLayout.slots[index];
        if (!slot) return;

        const slotX = (slot.x / 100) * stripWidth;
        const slotY = (slot.y / 100) * stripHeight;
        const slotWidth = (slot.width / 100) * stripWidth;
        const slotHeight = (slot.height / 100) * stripHeight;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.save();

          // Apply rotation if specified
          if (slot.rotation) {
            ctx.translate(slotX + slotWidth / 2, slotY + slotHeight / 2);
            ctx.rotate((slot.rotation * Math.PI) / 180);
            ctx.translate(-(slotX + slotWidth / 2), -(slotY + slotHeight / 2));
          }

          // Clip to slot bounds
          ctx.beginPath();
          ctx.rect(slotX, slotY, slotWidth, slotHeight);
          ctx.clip();

          // Draw image (cover fit)
          const imgAspect = img.width / img.height;
          const slotAspect = slotWidth / slotHeight;

          let drawWidth, drawHeight, drawX, drawY;

          if (imgAspect > slotAspect) {
            drawHeight = slotHeight;
            drawWidth = drawHeight * imgAspect;
            drawX = slotX - (drawWidth - slotWidth) / 2;
            drawY = slotY;
          } else {
            drawWidth = slotWidth;
            drawHeight = drawWidth / imgAspect;
            drawX = slotX;
            drawY = slotY - (drawHeight - slotHeight) / 2;
          }

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          ctx.restore();

          // Draw slot border
          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 1;
          ctx.strokeRect(slotX, slotY, slotWidth, slotHeight);

          loadedImages++;
          if (loadedImages === totalImages) {
            // Add watermark
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.font = 'italic 12px Dancing Script';
            ctx.textAlign = 'center';
            ctx.fillText('Made with Tic a Pic', stripWidth / 2, stripHeight - 20);

            resolve(canvas);
          }
        };
        img.onerror = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            resolve(canvas);
          }
        };
        img.src = photoUrl;
      });
    });
  };

  // Download strip
  const downloadStrip = async (strip: PhotoStrip) => {
    try {
      const canvas = await generateStripCanvas(strip);
      const link = document.createElement('a');
      link.download = `tic-a-pic-strip-${strip.id}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Strip downloaded! 📥');
    } catch (error) {
      console.error('Error downloading strip:', error);
      toast.error('Failed to download strip');
    }
  };

  // View strip in modal
  const viewStrip = async (strip: PhotoStrip) => {
    setSelectedStrip(strip);

    // Generate preview
    setTimeout(async () => {
      if (canvasRef.current) {
        try {
          const canvas = await generateStripCanvas(strip);
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = canvas.width;
            canvasRef.current.height = canvas.height;
            ctx.drawImage(canvas, 0, 0);
          }
        } catch (error) {
          console.error('Error generating preview:', error);
        }
      }
    }, 100);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Refresh data
  const refreshData = () => {
    setLoading(true);
    // Trigger re-fetch by changing a dependency
    setSavedStrips([]);
    setPhotoStrips([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="mt-4 text-base-content/70">Loading your saved strips...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-base-content/60 mt-1">
              {photoStrips.length > 0
                ? `${photoStrips.length} strip${photoStrips.length !== 1 ? 's' : ''} saved`
                : 'No strips saved yet'
              }
            </p>
          </div>

          <button
            onClick={refreshData}
            className="btn btn-ghost btn-sm gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Strips Grid */}
        {photoStrips.length === 0 ? (
          <div className="text-center py-12">
            <Camera size={64} className="mx-auto text-base-content/30 mb-4" />
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">
              No Photo Strips Yet
            </h3>
            <p className="text-base-content/50 mb-6">
              Start taking photos to create your first photo strip!
            </p>
            <a href="/" className="btn btn-primary gap-2">
              <Camera size={16} />
              Take Photos
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photoStrips.map((strip) => (
              <div key={strip.id} className="card bg-base-100 shadow-xl">
                <div className="card-body p-4">
                  {/* Strip Preview */}
                  <div className="aspect-[3/4] bg-base-200 rounded-lg overflow-hidden mb-3 relative">
                    <div className="grid grid-cols-1 gap-1 h-full">
                      {strip.photos.slice(0, 4).map((photo, index) => (
                        <div key={index} className="bg-base-300 relative overflow-hidden">
                          <img
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
                        {strip.photos.length} photo{strip.photos.length !== 1 ? 's' : ''}
                      </span>

                      {strip.id.startsWith('local') && (
                        <span className="badge badge-warning badge-sm">
                          Current Session
                        </span>
                      )}
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
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto"
                    style={{ maxHeight: '600px', objectFit: 'contain' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-base-content/60 mb-4">
                <span>Created: {formatDate(selectedStrip.created_at)}</span>
                <span>{selectedStrip.photos.length} photos</span>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => downloadStrip(selectedStrip)}
                  className="btn btn-primary gap-2"
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
