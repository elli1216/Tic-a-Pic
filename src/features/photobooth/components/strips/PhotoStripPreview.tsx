import React, { useRef, useEffect } from 'react';

interface Layout {
  name: string;
  background?: string;
  slots: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  }>;
}

interface PhotoStripPreviewProps {
  boothPhotos: (string | null)[];
  selectedLayout: Layout;
  isCapturing: boolean;
  currentSlot: number;
  countdown: number;
  allPhotosComplete: boolean;
}

export default function PhotoStripPreview({
  boothPhotos,
  selectedLayout,
  isCapturing,
  currentSlot,
  countdown,
  allPhotosComplete
}: PhotoStripPreviewProps) {
  const stripCanvasRef = useRef<HTMLCanvasElement>(null);

  // Draw photo strip preview
  useEffect(() => {
    const drawStrip = () => {
      const canvas = stripCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

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

      // Draw each slot
      selectedLayout.slots.forEach((slot, index) => {
        const slotX = (slot.x / 100) * stripWidth;
        const slotY = (slot.y / 100) * stripHeight;
        const slotWidth = (slot.width / 100) * stripWidth;
        const slotHeight = (slot.height / 100) * stripHeight;

        const photo = boothPhotos[index];

        if (photo) {
          // Draw photo
          const img = new Image();
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
          };
          img.src = photo;
        } else {
          // Draw empty slot
          ctx.fillStyle = '#f9fafb';
          ctx.fillRect(slotX, slotY, slotWidth, slotHeight);

          // Dashed border
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = '#9ca3af';
          ctx.strokeRect(slotX, slotY, slotWidth, slotHeight);
          ctx.setLineDash([]);

          // Placeholder text
          ctx.fillStyle = '#6b7280';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Show which slot is next during capture
          if (isCapturing && index === currentSlot && countdown > 0) {
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText(countdown.toString(), slotX + slotWidth / 2, slotY + slotHeight / 2);
          } else if (index === currentSlot && isCapturing) {
            ctx.fillStyle = '#10b981';
            ctx.fillText('📸 CAPTURING...', slotX + slotWidth / 2, slotY + slotHeight / 2);
          } else {
            ctx.fillText(`Photo ${index + 1}`, slotX + slotWidth / 2, slotY + slotHeight / 2);
          }
        }
      });

      // Add watermark (optional)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.font = 'italic 12px Dancing Script';
      ctx.textAlign = 'center';
      ctx.fillText('Made with Tic a Pic', stripWidth / 2, stripHeight - 20);
    };

    drawStrip();
  }, [boothPhotos, selectedLayout, isCapturing, currentSlot, countdown]);

  return (
    <div className="space-y-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Your Photo Strip</h2>
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-inner p-2" style={{ maxWidth: '300px' }}>
              <canvas
                ref={stripCanvasRef}
                className="w-full h-auto"
                style={{ maxHeight: '600px', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={slot}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${boothPhotos[slot]
                    ? 'bg-success'
                    : slot === currentSlot && isCapturing
                      ? 'bg-warning animate-pulse'
                      : 'bg-base-300'
                  }
                `}
              />
            ))}
          </div>

          {/* Status */}
          <div className="text-center mt-2">
            <p className="text-sm text-base-content/60">
              {allPhotosComplete
                ? '✨ All photos captured! Ready to save or retake.'
                : isCapturing
                  ? `Capturing photo ${currentSlot + 1} of 4...`
                  : 'Ready to start your photo session'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
