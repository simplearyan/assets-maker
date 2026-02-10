import {
    Palette,
    Move,
    Maximize,
    Layers,
    Type as TypeIcon,
    Trash2,
    Copy,
    X,
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { ThumbnailElement } from '../../types/thumbnail';
import { cn } from '../../lib/utils';
import { useRef } from 'react';

export type PropertyTab = 'text' | 'color' | 'stroke' | 'position' | 'size' | 'opacity' | 'layers' | null;

interface MobileContextBarProps {
    element: ThumbnailElement;
    activeTab: PropertyTab;
    onTabChange: (tab: PropertyTab) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onClose: () => void;
}

export function MobileContextBar({
    element,
    activeTab,
    onTabChange,
    onDelete,
    onDuplicate,
    onClose
}: MobileContextBarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const commonTools = [
        { id: 'position', icon: Move, label: 'Position' },
        { id: 'layers', icon: Layers, label: 'Layers' },
        { id: 'opacity', icon: Palette, label: 'Opacity' },
    ];

    const specificTools = [];

    if (element.type === 'text') {
        specificTools.push({ id: 'text', icon: TypeIcon, label: 'Edit' });
        specificTools.push({ id: 'color', icon: Palette, label: 'Color' });
        specificTools.push({ id: 'size', icon: Maximize, label: 'Size' });
    } else if (element.type === 'rect' || element.type === 'circle') {
        specificTools.push({ id: 'color', icon: Palette, label: 'Fill' });
        specificTools.push({ id: 'stroke', icon: Maximize, label: 'Stroke' });
    }

    const allTools = [...specificTools, ...commonTools];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-surface backdrop-blur-2xl backdrop-saturate-150 shadow-2xl border-t border-border z-[60] flex items-center px-4 pb-[env(safe-area-inset-bottom)]">

            {/* Close Button */}
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-lg h-8 w-8 px-0 text-text-muted hover:text-text-main shrink-0">
                <X size={24} />
            </Button>

            <div className="w-px h-6 bg-border/50 shrink-0 mx-2" />

            {/* Scrollable Tools */}
            <div className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-2 px-1" ref={scrollRef}>
                {allTools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => onTabChange(activeTab === tool.id ? null : (tool.id as PropertyTab))}
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

            {/* Actions Group */}
            <div className="flex items-center gap-0.5 bg-text-main/5 rounded-lg p-1 ml-2 shrink-0 border border-border/20">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDuplicate}
                    className="h-8 w-8 px-0 text-text-muted hover:text-text-main rounded-md"
                    title="Duplicate"
                >
                    <Copy size={16} />
                </Button>
                <div className="w-px h-4 bg-border/50 mx-0.5" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="h-8 w-8 px-0 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-md"
                    title="Delete"
                >
                    <Trash2 size={16} />
                </Button>
            </div>
        </div>
    );
}
