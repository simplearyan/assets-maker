import { useState } from 'react';
import { Settings, Video, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ExportPanelProps {
    onExportVideo: (config: ExportConfig) => void;
    onExportImage: (format: 'png' | 'svg', config: ExportConfig) => void;
    isExporting: boolean;
    progress: number;
}

export interface ExportConfig {
    resolution: { width: number; height: number };
    fps: number;
    format: 'webm' | 'mp4';
}

export function ExportPanel({ onExportVideo, onExportImage, isExporting, progress }: ExportPanelProps) {
    const [config, setConfig] = useState<ExportConfig>({
        resolution: { width: 1920, height: 1080 },
        fps: 30,
        format: 'webm'
    });

    const resolutions = [
        { label: '720p (HD)', width: 1280, height: 720 },
        { label: '1080p (Full HD)', width: 1920, height: 1080 },
        { label: '4K (Ultra HD)', width: 3840, height: 2160 },
        { label: 'Square (1080x1080)', width: 1080, height: 1080 },
    ];

    return (
        <div className="w-full h-full flex flex-col p-4 space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <Settings size={18} className="text-accent" />
                <h3 className="font-bold text-lg text-text-main uppercase tracking-wider">Export Settings</h3>
            </div>

            {/* Resolution Picker */}
            <div className="space-y-3">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                    <Video size={14} /> Resolution
                </label>
                <div className="grid grid-cols-1 gap-2">
                    {resolutions.map((res) => (
                        <button
                            key={res.label}
                            onClick={() => setConfig({ ...config, resolution: { width: res.width, height: res.height } })}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-sm",
                                config.resolution.width === res.width
                                    ? "bg-accent/10 border-accent text-accent"
                                    : "bg-white/5 border-white/5 text-text-muted hover:bg-white/10"
                            )}
                        >
                            <span>{res.label}</span>
                            {config.resolution.width === res.width && <Check size={14} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* FPS & Format */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Frame Rate</label>
                    <select
                        value={config.fps}
                        onChange={(e) => setConfig({ ...config, fps: parseInt(e.target.value) })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-main focus:border-accent outline-none"
                    >
                        <option value={24}>24 FPS</option>
                        <option value={30}>30 FPS</option>
                        <option value={60}>60 FPS</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Format</label>
                    <select
                        value={config.format}
                        onChange={(e) => setConfig({ ...config, format: e.target.value as 'webm' | 'mp4' })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-text-main focus:border-accent outline-none"
                    >
                        <option value="webm">WebM (VP9)</option>
                        <option value="mp4">MP4 (H.264)</option>
                    </select>
                </div>
            </div>

            <div className="pt-4 space-y-3">
                {isExporting ? (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-text-muted mb-1">
                            <span>Rendering Video...</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <button
                            disabled
                            className="w-full py-3 bg-surface border border-white/10 text-text-muted rounded-2xl font-bold flex items-center justify-center gap-2 cursor-wait"
                        >
                            <Loader2 size={18} className="animate-spin text-accent" />
                            Processing...
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => onExportVideo(config)}
                            className="w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl font-bold shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Video size={18} />
                            Export Video
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => onExportImage('png', config)}
                                className="py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 border border-white/5"
                            >
                                <ImageIcon size={14} />
                                Export PNG
                            </button>
                            <button
                                onClick={() => onExportImage('svg', config)}
                                className="py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 border border-white/5"
                            >
                                <ImageIcon size={14} />
                                Export SVG
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10">
                <p className="text-[10px] text-accent/60 leading-relaxed italic text-center">
                    Note: High-quality rendering is performed frame-by-frame. Please keep this tab active during the process.
                </p>
            </div>
        </div>
    );
}
