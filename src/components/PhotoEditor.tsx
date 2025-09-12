'use client';

import React, { useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePhotoboothStore } from '@/features/common/store/usePhotoboothStore';
import { LayoutConfig } from './PhotoStripCanvas';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface PhotoEditorProps {
  layout: LayoutConfig;
  className?: string;
}

interface SortablePhotoItemProps {
  photo: string | null;
  index: number;
  slotNumber: number;
  onRemove: (index: number) => void;
  onReplace: (index: number, newPhoto: string) => void;
}

function SortablePhotoItem({ photo, index, slotNumber, onRemove, onReplace }: SortablePhotoItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `photo-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onReplace(index, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-white rounded-lg border-2 transition-all duration-200
        ${isDragging ? 'border-primary shadow-lg z-10' : 'border-base-300'}
        ${photo ? 'hover:border-primary/50' : 'border-dashed border-base-400'}
      `}
      {...attributes}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="aspect-[3/4] p-2">
        {photo ? (
          <div className="relative w-full h-full group">
            <Image
              src={photo}
              alt={`Photo ${slotNumber}`}
              className="w-full h-full object-cover rounded"
              width={200}
              height={267}
            />

            {/* Drag handle */}
            <div
              {...listeners}
              className="absolute top-1 left-1 w-6 h-6 bg-black/50 rounded cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="text-white text-xs">⋮⋮</span>
            </div>

            {/* Controls overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-sm btn-circle bg-white/90 hover:bg-white border-0 text-base-content"
                  title="Replace photo"
                >
                  📷
                </button>
                <button
                  onClick={() => onRemove(index)}
                  className="btn btn-sm btn-circle bg-white/90 hover:bg-white border-0 text-error"
                  title="Remove photo"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full border-2 border-dashed border-base-400 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-4xl mb-2">📸</span>
            <span className="text-sm text-base-content/60 text-center">
              Slot {slotNumber}
              <br />
              Click to add
            </span>
          </div>
        )}
      </div>

      {/* Slot number badge */}
      <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">{slotNumber}</span>
      </div>
    </div>
  );
}

export default function PhotoEditor({ layout, className = '' }: PhotoEditorProps) {
  const photos = usePhotoboothStore((state) => state.photos);
  const reorderPhotos = usePhotoboothStore((state) => state.reorderPhotos);
  const removePhoto = usePhotoboothStore((state) => state.removePhoto);
  const replacePhoto = usePhotoboothStore((state) => state.replacePhoto);
  const setAppState = usePhotoboothStore((state) => state.setAppState);

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Create photo slots array matching layout slots
  const photoSlots = layout.slots.map((_, index) => photos[index] || null);
  const photoIds = photoSlots.map((_, index) => `photo-${index}`);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = photoIds.indexOf(active.id as string);
      const newIndex = photoIds.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderPhotos(oldIndex, newIndex);
        toast.success('Photo reordered!');
      }
    }
  };

  const handleRemove = (index: number) => {
    removePhoto(index);
    toast.success('Photo removed!');
  };

  const handleReplace = (index: number, newPhoto: string) => {
    replacePhoto(index, newPhoto);
    toast.success('Photo replaced!');
  };

  const handleAddMore = () => {
    setAppState('camera');
    toast('Take more photos to fill your strip!', { icon: '📷' });
  };

  const activePhoto = activeId ? photoSlots[photoIds.indexOf(activeId)] : null;

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Edit Your Photos</h3>
          <p className="text-sm text-base-content/70">
            Drag to reorder • Click to replace • Hover to edit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="badge badge-info badge-sm">
            {photos.length}/{layout.slots.length} photos
          </div>
          {photos.length < layout.slots.length && (
            <button
              onClick={handleAddMore}
              className="btn btn-primary btn-sm"
            >
              📷 Add More
            </button>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={photoIds} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photoSlots.map((photo, index) => (
              <SortablePhotoItem
                key={`photo-${index}`}
                photo={photo}
                index={index}
                slotNumber={index + 1}
                onRemove={handleRemove}
                onReplace={handleReplace}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activePhoto && (
            <div className="bg-white rounded-lg border-2 border-primary shadow-lg">
              <div className="aspect-[3/4] p-2">
                <Image
                  src={activePhoto}
                  alt="Dragging photo"
                  className="w-full h-full object-cover rounded"
                  width={200}
                  height={267}
                />
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Tips */}
      <div className="mt-6 p-4 bg-base-200 rounded-lg">
        <h4 className="font-medium mb-2">💡 Pro Tips:</h4>
        <ul className="text-sm text-base-content/70 space-y-1">
          <li>• Drag photos to reorder them in your strip</li>
          <li>• Click the camera icon to replace a photo</li>
          <li>• Click empty slots to add new photos</li>
          <li>• Use the trash icon to remove unwanted photos</li>
        </ul>
      </div>
    </div>
  );
}
