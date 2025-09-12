'use client';

import React, { useRef, useEffect } from 'react';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';

export interface LayoutConfig {
  id: string;
  name: string;
  type: 'free' | 'premium';
  slots: Array<{
    x: number; // percentage
    y: number; // percentage
    width: number; // percentage
    height: number; // percentage
    rotation?: number; // degrees
  }>;
  background?: string;
}

interface PhotoStripCanvasProps {
  showWatermark?: boolean;
  className?: string;
}

const DEFAULT_LAYOUT: LayoutConfig = {
  id: 'classic-4',
  name: 'Classic 4-Photo Strip',
  type: 'free',
  slots: [
    { x: 10, y: 5, width: 80, height: 20 },
    { x: 10, y: 27, width: 80, height: 20 },
    { x: 10, y: 49, width: 80, height: 20 },
    { x: 10, y: 71, width: 80, height: 20 },
  ],
  background: '#ffffff',
};

export default function PhotoStripCanvas({
  showWatermark = true,
  className = ''
}: PhotoStripCanvasProps) {
  const photos = usePhotoboothStore((state) => state.photos);
  const layout = usePhotoboothStore((state) => state.selectedLayout);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // QR code URL pointing to ticapic.com
  const qrCodeUrl = '/qr-ticapic.svg';

  const drawPhotoStrip = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (printable photo strip dimensions)
    const stripWidth = 600;
    const stripHeight = 1800; // 2x6 inch at 300 DPI
    canvas.width = stripWidth;
    canvas.height = stripHeight;

    // Clear canvas and set background
    ctx.fillStyle = layout.background || '#ffffff';
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    // Add subtle border
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, stripWidth - 2, stripHeight - 2);

    // Draw photo slots
    for (let i = 0; i < layout.slots.length; i++) {
      const slot = layout.slots[i];
      const photo = photos[i];

      // Calculate slot position and size
      const slotX = (slot.x / 100) * stripWidth;
      const slotY = (slot.y / 100) * stripHeight;
      const slotWidth = (slot.width / 100) * stripWidth;
      const slotHeight = (slot.height / 100) * stripHeight;

      // Draw slot background
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(slotX, slotY, slotWidth, slotHeight);

      // Draw slot border
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.strokeRect(slotX, slotY, slotWidth, slotHeight);

      if (photo) {
        try {
          // Load and draw photo
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = photo;
          });

          // Calculate scaling to fit slot while maintaining aspect ratio
          const imgAspect = img.width / img.height;
          const slotAspect = slotWidth / slotHeight;

          let drawWidth, drawHeight, drawX, drawY;

          if (imgAspect > slotAspect) {
            // Image is wider - fit height
            drawHeight = slotHeight;
            drawWidth = drawHeight * imgAspect;
            drawX = slotX - (drawWidth - slotWidth) / 2;
            drawY = slotY;
          } else {
            // Image is taller - fit width
            drawWidth = slotWidth;
            drawHeight = drawWidth / imgAspect;
            drawX = slotX;
            drawY = slotY - (drawHeight - slotHeight) / 2;
          }

          // Apply rotation if specified
          if (slot.rotation) {
            ctx.save();
            ctx.translate(slotX + slotWidth / 2, slotY + slotHeight / 2);
            ctx.rotate((slot.rotation * Math.PI) / 180);
            ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
            ctx.restore();
          } else {
            // Clip to slot bounds
            ctx.save();
            ctx.beginPath();
            ctx.rect(slotX, slotY, slotWidth, slotHeight);
            ctx.clip();
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();
          }
        } catch (error) {
          console.error('Error loading photo:', error);

          // Draw placeholder
          ctx.fillStyle = '#9ca3af';
          ctx.fillRect(slotX, slotY, slotWidth, slotHeight);
          ctx.fillStyle = '#ffffff';
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Photo ${i + 1}`, slotX + slotWidth / 2, slotY + slotHeight / 2);
        }
      } else {
        // Draw empty slot placeholder
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(slotX, slotY, slotWidth, slotHeight);

        // Add dashed border for empty slots
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#9ca3af';
        ctx.strokeRect(slotX, slotY, slotWidth, slotHeight);
        ctx.setLineDash([]);

        // Add placeholder text
        ctx.fillStyle = '#6b7280';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Photo ${i + 1}`, slotX + slotWidth / 2, slotY + slotHeight / 2);
      }
    }

    // Add QR watermark if enabled
    if (showWatermark) {
      try {
        const qrImg = new Image();
        await new Promise((resolve, reject) => {
          qrImg.onload = resolve;
          qrImg.onerror = reject;
          qrImg.src = qrCodeUrl;
        });

        // Position QR in bottom right
        const qrSize = 80;
        const qrX = stripWidth - qrSize - 20;
        const qrY = stripHeight - qrSize - 60;

        // Semi-transparent background for QR
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 40);

        // Draw QR code
        ctx.globalAlpha = 0.8;
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        ctx.globalAlpha = 1;

        // Add watermark text
        ctx.fillStyle = '#374151';
        ctx.font = '12px Dancing Script, cursive';
        ctx.textAlign = 'center';
        ctx.fillText('Made with Tic a Pic', qrX + qrSize / 2, qrY + qrSize + 20);
      } catch (error) {
        console.error('Error adding QR watermark:', error);
      }
    }
  };

  // Redraw when photos or layout change
  useEffect(() => {
    drawPhotoStrip();
  }, [photos, layout, showWatermark]);

  // Download functionality
  const downloadStrip = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `tic-a-pic-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative bg-white rounded-xl shadow-lg overflow-hidden"
        style={{ aspectRatio: '1/3' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={downloadStrip}
          className="btn btn-primary btn-sm"
          disabled={photos.length === 0}
        >
          📥 Download
        </button>

        <div className="tooltip" data-tip={showWatermark ? "QR watermark visible" : "QR watermark hidden"}>
          <div className={`badge ${showWatermark ? 'badge-primary' : 'badge-ghost'}`}>
            QR {showWatermark ? 'ON' : 'OFF'}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-base-content/60 text-center mt-2">
        <p>{layout.name}</p>
        <p>{photos.length} of {layout.slots.length} photos</p>
      </div>
    </div>
  );
}
