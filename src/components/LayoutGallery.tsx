'use client';

import React from 'react';
import { LayoutConfig } from './PhotoStripCanvas';

interface LayoutGalleryProps {
  selectedLayout: LayoutConfig;
  onLayoutSelect: (layout: LayoutConfig) => void;
  className?: string;
}

// Free layout configurations
export const FREE_LAYOUTS: LayoutConfig[] = [
  {
    id: 'classic-4',
    name: 'Classic Strip',
    type: 'free',
    slots: [
      { x: 10, y: 5, width: 80, height: 20 },
      { x: 10, y: 27, width: 80, height: 20 },
      { x: 10, y: 49, width: 80, height: 20 },
      { x: 10, y: 71, width: 80, height: 20 },
    ],
    background: '#ffffff',
  },
  {
    id: 'big-small',
    name: 'Big & Small',
    type: 'free',
    slots: [
      { x: 5, y: 5, width: 90, height: 35 },
      { x: 5, y: 45, width: 42.5, height: 20 },
      { x: 52.5, y: 45, width: 42.5, height: 20 },
      { x: 5, y: 70, width: 90, height: 25 },
    ],
    background: '#ffffff',
  },
  {
    id: 'grid-2x2',
    name: '2×2 Grid',
    type: 'free',
    slots: [
      { x: 5, y: 10, width: 42.5, height: 35 },
      { x: 52.5, y: 10, width: 42.5, height: 35 },
      { x: 5, y: 50, width: 42.5, height: 35 },
      { x: 52.5, y: 50, width: 42.5, height: 35 },
    ],
    background: '#ffffff',
  },
  {
    id: 'diagonal',
    name: 'Diagonal Fun',
    type: 'free',
    slots: [
      { x: 5, y: 5, width: 35, height: 25, rotation: -5 },
      { x: 55, y: 15, width: 35, height: 25, rotation: 5 },
      { x: 10, y: 45, width: 35, height: 25, rotation: 3 },
      { x: 50, y: 55, width: 35, height: 25, rotation: -3 },
    ],
    background: '#f8fafc',
  },
  {
    id: 'vertical-stack',
    name: 'Tall Stack',
    type: 'free',
    slots: [
      { x: 15, y: 2, width: 70, height: 22 },
      { x: 15, y: 26, width: 70, height: 22 },
      { x: 15, y: 50, width: 70, height: 22 },
      { x: 15, y: 74, width: 70, height: 22 },
    ],
    background: '#ffffff',
  },
];

// Layout thumbnail component
function LayoutThumbnail({ layout, isSelected, onClick }: {
  layout: LayoutConfig;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105
        ${isSelected 
          ? 'border-primary bg-primary/10 shadow-lg' 
          : 'border-base-300 bg-base-200 hover:border-primary/50'
        }
      `}
    >
      {/* Thumbnail preview */}
      <div className="aspect-[1/3] p-2">
        <div 
          className="w-full h-full rounded relative overflow-hidden"
          style={{ backgroundColor: layout.background }}
        >
          {/* Mini photo slots */}
          {layout.slots.map((slot, index) => (
            <div
              key={index}
              className={`
                absolute border border-gray-300 bg-gray-100 rounded-sm
                flex items-center justify-center text-xs font-bold text-gray-500
                ${slot.rotation ? 'transform' : ''}
              `}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.width}%`,
                height: `${slot.height}%`,
                transform: slot.rotation ? `rotate(${slot.rotation}deg)` : undefined,
              }}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Layout info */}
      <div className="p-2 text-center">
        <h4 className="font-medium text-sm">{layout.name}</h4>
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className={`badge badge-xs ${layout.type === 'free' ? 'badge-success' : 'badge-warning'}`}>
            {layout.type}
          </span>
          <span className="text-xs text-base-content/60">
            {layout.slots.length} photos
          </span>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-1 right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
}

export default function LayoutGallery({ selectedLayout, onLayoutSelect, className = '' }: LayoutGalleryProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Choose Layout</h3>
        <div className="badge badge-info badge-sm">
          {FREE_LAYOUTS.length} Free Layouts
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {FREE_LAYOUTS.map((layout) => (
          <LayoutThumbnail
            key={layout.id}
            layout={layout}
            isSelected={selectedLayout.id === layout.id}
            onClick={() => onLayoutSelect(layout)}
          />
        ))}
      </div>

      {/* Premium teaser */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-primary">Want More Layouts?</h4>
            <p className="text-sm text-base-content/70">
              Unlock 20+ premium layouts, remove watermarks, and access AI tools!
            </p>
          </div>
          <button className="btn btn-primary btn-sm">
            Go Premium ✨
          </button>
        </div>
      </div>

      {/* Usage tip */}
      <div className="mt-4 text-center">
        <p className="text-xs text-base-content/60">
          💡 Tip: Take photos first, then choose your favorite layout!
        </p>
      </div>
    </div>
  );
}