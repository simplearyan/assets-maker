import {
    Palette,
    X,
    Ratio
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { useRef } from 'react';

export type CanvasTab = 'size' | 'background' | null;

interface CanvasSettings {
    width?: number;
    height?: number;
    background?: string;
    isTransparent?: boolean;
    clipContent?: boolean;
}

interface MobileCanvasBarProps {
    canvasSettings: CanvasSettings;
    activeTab: CanvasTab;
    onTabChange: (tab: CanvasTab) => void;
    onUpdateCanvas: (settings: Partial<CanvasSettings>) => void;
    onClose: () => void;
}

export function MobileCanvasBar({
    canvasSettings,
    activeTab,
    onTabChange,
    onUpdateCanvas,
    onClose
}: MobileCanvasBarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const tools = [
        { id: 'size', icon: Ratio, label: 'Size' },
        { id: 'background', icon: Palette, label: 'Background' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-3xl backdrop-saturate-150 shadow-2xl z-[60] flex flex-col pb-[env(safe-area-inset-bottom)]">

            {/* Expanded Content Area (Size/Color Pickers) */}
            {activeTab && (
                <div className="p-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
                    {activeTab === 'size' && (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Aspect Ratio</span>
                                <div className="grid grid-cols-4 gap-2">
                                    <Button
                                        variant={canvasSettings?.width === 1280 && canvasSettings?.height === 720 ? "primary" : "glass"}
                                        size="sm"
                                        onClick={() => onUpdateCanvas({ width: 1280, height: 720 })}
                                        className="text-[10px] h-8"
                                    >
                                        16:9
                                    </Button>
                                    <Button
                                        variant={canvasSettings?.width === 720 && canvasSettings?.height === 1280 ? "primary" : "glass"}
                                        size="sm"
                                        onClick={() => onUpdateCanvas({ width: 720, height: 1280 })}
                                        className="text-[10px] h-8"
                                    >
                                        9:16
                                    </Button>
                                    <Button
                                        variant={canvasSettings?.width === 1080 && canvasSettings?.height === 1080 ? "primary" : "glass"}
                                        size="sm"
                                        onClick={() => onUpdateCanvas({ width: 1080, height: 1080 })}
                                        className="text-[10px] h-8"
                                    >
                                        1:1
                                    </Button>
                                    <Button
                                        variant={canvasSettings?.width === 1280 && canvasSettings?.height === 960 ? "primary" : "glass"}
                                        size="sm"
                                        onClick={() => onUpdateCanvas({ width: 1280, height: 960 })}
                                        className="text-[10px] h-8"
                                    >
                                        4:3
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 mt-2">
                                <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-text-muted hover:text-text-main transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={canvasSettings?.clipContent}
                                        onChange={(e) => onUpdateCanvas({ clipContent: e.target.checked })}
                                        className="rounded border-border bg-surface-card text-accent focus:ring-accent w-4 h-4"
                                    />
                                    Clip Content
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'background' && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Background</span>
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={canvasSettings?.isTransparent}
                                        onChange={(e) => onUpdateCanvas({ isTransparent: e.target.checked })}
                                        className="rounded border-border bg-surface-card text-accent focus:ring-accent"
                                    />
                                    Transparent
                                </label>
                            </div>
                            {!canvasSettings?.isTransparent && (
                                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                                    {['#ffffff', '#000000', '#ff5252', '#ff4081', '#7c4dff', '#536dfe', '#448aff', '#18ffff', '#69f0ae', '#b2ff59', '#ffd740', '#ffab40'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => onUpdateCanvas({ background: color })}
                                            className={cn(
                                                "w-8 h-8 rounded-full border border-border shrink-0 transition-transform",
                                                canvasSettings?.background === color && "ring-2 ring-accent scale-110"
                                            )}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Main Bar */}
            <div className="h-16 flex items-center px-4 w-full">
                {/* Close Button */}
                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-lg h-8 w-8 px-0 text-text-muted hover:text-text-main shrink-0">
                    <X size={24} />
                </Button>

                <div className="w-px h-6 bg-border/50 shrink-0 mx-2" />

                {/* Tools */}
                <div className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-2 px-1" ref={scrollRef}>
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={() => onTabChange(activeTab === tool.id ? null : (tool.id as CanvasTab))}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[3.5rem] h-12 gap-1 rounded-lg transition-all shrink-0",
                                activeTab === tool.id
                                    ? "bg-accent/10 text-accent"
                                    : "text-text-muted hover:text-text-main hover:bg-white/5"
                            )}
                        >
                            <tool.icon size={20} />
                            <span className="text-[10px] uppercase font-medium tracking-tight">{tool.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
