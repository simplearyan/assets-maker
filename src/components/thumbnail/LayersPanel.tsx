import type { ThumbnailElement } from '../../types/thumbnail';
import { Button } from '../ui/Button';
import { Type, Square, Circle, Image as ImageIcon, ChevronUp, ChevronDown, Trash2, MousePointer2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LayersPanelProps {
    elements: ThumbnailElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onReorder: (id: string, type: 'front' | 'back' | 'forward' | 'backward') => void;
    onDelete: (id: string) => void;
}

export function LayersPanel({ elements, selectedId, onSelect, onReorder, onDelete }: LayersPanelProps) {
    // Reverse elements to show Top layer first in UI
    const reversedElements = [...elements].reverse();

    const getElementIcon = (type: string) => {
        switch (type) {
            case 'text': return Type;
            case 'rect': return Square;
            case 'circle': return Circle;
            case 'image': return ImageIcon;
            default: return MousePointer2;
        }
    };

    const getElementLabel = (el: ThumbnailElement) => {
        if (el.type === 'text') return el.text || 'Text';
        if (el.type === 'image') return 'Image';
        return el.type.charAt(0).toUpperCase() + el.type.slice(1);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-surface">
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {reversedElements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-text-muted text-sm italic">
                        No elements on canvas
                    </div>
                ) : (
                    reversedElements.map((el, index) => {
                        const Icon = getElementIcon(el.type);
                        const isSelected = selectedId === el.id;
                        const actualIndex = elements.length - 1 - index;

                        return (
                            <div
                                key={el.id}
                                className={cn(
                                    "group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 cursor-pointer border border-transparent",
                                    isSelected
                                        ? "bg-accent/10 border-accent/30 text-accent font-medium"
                                        : "hover:bg-white/5 text-text-muted hover:text-text-main"
                                )}
                                onClick={() => onSelect(el.id)}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded flex items-center justify-center shrink-0",
                                    isSelected ? "bg-accent text-bg" : "bg-border/20"
                                )}>
                                    <Icon size={16} />
                                </div>

                                <span className="flex-1 text-xs truncate">
                                    {getElementLabel(el)}
                                </span>

                                <div className={cn(
                                    "flex items-center gap-0.5 transition-opacity duration-200",
                                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onReorder(el.id, 'forward');
                                        }}
                                        disabled={actualIndex === elements.length - 1}
                                    >
                                        <ChevronUp size={14} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onReorder(el.id, 'backward');
                                        }}
                                        disabled={actualIndex === 0}
                                    >
                                        <ChevronDown size={14} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(el.id);
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-3 border-t border-border bg-surface-card/50 text-[10px] text-text-muted flex justify-between items-center">
                <span>Total Layers: {elements.length}</span>
                <span>Select to manage</span>
            </div>
        </div>
    );
}
