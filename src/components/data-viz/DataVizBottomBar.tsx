import { Minus, Plus, Maximize, ZoomIn, Play, Pause, Download } from 'lucide-react';

interface DataVizBottomBarProps {
    zoom: number;
    onZoomChange: (zoom: number) => void;
    playback?: {
        currentTime: number;
        duration: number;
        isPlaying: boolean;
        play: () => void;
        pause: () => void;
        seek: (time: number) => void;
    };
    onExport?: () => void;
}

export function DataVizBottomBar({ zoom, onZoomChange, playback, onExport }: DataVizBottomBarProps) {
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}.${Math.floor((ms % 1000) / 100)}`;
    };

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl z-50">
            {/* Playback Controls */}
            {playback && (
                <div className="flex items-center gap-2 pr-2 border-r border-white/10">
                    <button
                        onClick={playback.isPlaying ? playback.pause : playback.play}
                        className="p-2 bg-accent text-white rounded-full hover:scale-105 transition-transform shadow-lg shadow-accent/20"
                    >
                        {playback.isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>

                    <div className="flex flex-col min-w-[120px]">
                        <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1 px-1">
                            <span>{formatTime(playback.currentTime)}</span>
                            <span>{formatTime(playback.duration)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={playback.duration}
                            value={playback.currentTime}
                            onChange={(e) => playback.seek(parseInt(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                    </div>
                </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onZoomChange(Math.max(0.1, zoom - 0.1))}
                    className="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors"
                >
                    <Minus size={16} />
                </button>

                <div className="flex items-center gap-2 px-1">
                    <ZoomIn size={14} className="text-text-muted" />
                    <span className="text-xs font-mono w-10 text-right">{Math.round(zoom * 100)}%</span>
                </div>

                <button
                    onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
                    className="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors"
                >
                    <Plus size={16} />
                </button>

                <button
                    onClick={() => onZoomChange(1)}
                    className="p-2 hover:bg-white/10 rounded-full text-text-muted hover:text-white transition-colors"
                    title="Reset Zoom"
                >
                    <Maximize size={16} />
                </button>
            </div>

            {/* Export Button */}
            <div className="w-px h-6 bg-white/10 mx-1" />

            <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-semibold transition-all border border-white/5"
            >
                <Download size={14} />
                Export
            </button>
        </div>
    );
}
