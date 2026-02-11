import { Minus, Plus, Maximize, ZoomIn } from 'lucide-react';

interface DataVizBottomBarProps {
    zoom: number;
    onZoomChange: (zoom: number) => void;
}

export function DataVizBottomBar({ zoom, onZoomChange }: DataVizBottomBarProps) {
    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl z-50">
            <button
                onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}
                className="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors"
            >
                <Minus size={16} />
            </button>

            <div className="flex items-center gap-2 px-2 min-w-[100px]">
                <ZoomIn size={14} className="text-text-muted" />
                <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                    className="w-24 accent-accent"
                />
                <span className="text-xs font-mono w-10 text-right">{Math.round(zoom * 100)}%</span>
            </div>

            <button
                onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
                className="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors"
            >
                <Plus size={16} />
            </button>

            <div className="w-px h-4 bg-white/10 mx-1" />

            <button
                onClick={() => onZoomChange(1)} // Reset to 100% or fit?
                className="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors"
                title="Reset Zoom"
            >
                <Maximize size={16} />
            </button>
        </div>
    );
}
