import { usePhotoboothStore, LAYOUT_PRESETS } from '@/features/common/store/usePhotoboothStore';

export default function LayoutPicker() {
  const selectedLayout = usePhotoboothStore((state) => state.selectedLayout);
  const setSelectedLayout = usePhotoboothStore((state) => state.setSelectedLayout);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Choose Strip Style</h2>
        <div className="grid grid-cols-4 gap-2">
          {LAYOUT_PRESETS.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setSelectedLayout(layout)}
              className={`
                p-2 rounded-lg border-2 transition-all
                ${selectedLayout.id === layout.id
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-base-300 hover:border-primary/50'
                }
              `}
            >
              <div
                className="w-full h-12 rounded mb-1"
                style={{ background: layout.background }}
              />
              <span className="text-xs text-center block truncate">
                {layout.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}