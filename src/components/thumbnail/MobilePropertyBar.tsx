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
import { useRef, useEffect } from 'react';

export type PropertyTab = 'text' | 'color' | 'stroke' | 'position' | 'size' | 'opacity' | 'layers' | null;

interface MobilePropertyBarProps {
    element: ThumbnailElement;
    activeTab: PropertyTab;
    onTabChange: (tab: PropertyTab) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onClose: () => void;
}

export function MobilePropertyBar({
    element,
    activeTab,
    onTabChange,
    onDelete,
    onDuplicate,
    onClose
}: MobilePropertyBarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to active item
    useEffect(() => {
        if (activeTab && scrollRef.current) {
            // Simple logic: just scroll to make sure it's visible?
            // For now, let's just let user scroll.
        }
    }, [activeTab]);

    const commonTools = [
        { id: 'position', icon: Move, label: 'Position' },
        { id: 'opacity', icon: Layers, label: 'Opacity' },
    ];

    const specificTools = [];

    if (element.type === 'text') {
        specificTools.push({ id: 'text', icon: TypeIcon, label: 'Edit Text' });
        specificTools.push({ id: 'color', icon: Palette, label: 'Color' });
        specificTools.push({ id: 'size', icon: Maximize, label: 'Size' });
    } else if (element.type === 'rect' || element.type === 'circle') {
        specificTools.push({ id: 'color', icon: Palette, label: 'Fill' });
        specificTools.push({ id: 'stroke', icon: Maximize, label: 'Stroke' }); // reusing Maximize icon for now as stroke width
    }

    const allTools = [...specificTools, ...commonTools];

    return (
        <div className="h-16 bg-surface backdrop-blur-xl border-t border-white/10 flex items-center px-2 z-[60] overflow-x-auto no-scrollbar gap-2" ref={scrollRef}>
            <Button variant="ghost" size="icon" onClick={onClose} className="mr-2 text-white/50 shrink-0">
                <X size={20} />
            </Button>

            <div className="w-px h-8 bg-white/10 shrink-0 mx-1" />

            {allTools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => onTabChange(activeTab === tool.id ? null : (tool.id as PropertyTab))}
                    className={cn(
                        "flex flex-col items-center justify-center w-16 h-full gap-1 rounded-lg transition-colors shrink-0",
                        activeTab === tool.id ? "text-accent bg-white/5" : "text-text-muted hover:text-white hover:bg-white/5"
                    )}
                >
                    <tool.icon size={20} />
                    <span className="text-[10px] uppercase font-medium">{tool.label}</span>
                </button>
            ))}

            <div className="w-px h-8 bg-white/10 shrink-0 mx-1" />

            <button
                onClick={onDuplicate}
                className="flex flex-col items-center justify-center w-14 h-full gap-1 rounded-lg text-text-muted hover:text-white shrink-0"
            >
                <Copy size={18} />
                <span className="text-[10px]">Copy</span>
            </button>

            <button
                onClick={onDelete}
                className="flex flex-col items-center justify-center w-14 h-full gap-1 rounded-lg text-red-400 hover:text-red-300 shrink-0"
            >
                <Trash2 size={18} />
                <span className="text-[10px]">Del</span>
            </button>
        </div>
    );
}
