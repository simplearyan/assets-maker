import { useState } from 'react';
import { cn } from '../../lib/utils';
import { LayersPanel } from './LayersPanel';
import type { ThumbnailElement } from '../../types/thumbnail';

interface SidebarContentProps {
    elements: ThumbnailElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onReorder: (id: string, type: 'front' | 'back' | 'forward' | 'backward') => void;
    onDelete: (id: string) => void;
    onAddTemplate?: (id: number) => void;
}

export function SidebarContent({
    elements,
    selectedId,
    onSelect,
    onReorder,
    onDelete,
    onAddTemplate
}: SidebarContentProps) {
    const [leftTab, setLeftTab] = useState<'templates' | 'layers'>('templates');

    return (
        <div className="flex flex-col h-full bg-surface">
            {/* Sidebar Tabs */}
            <div className="flex items-center p-1 bg-surface-card/50 border-b border-border gap-1 shrink-0">
                <button
                    onClick={() => setLeftTab('templates')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[11px] font-bold uppercase transition-all",
                        leftTab === 'templates'
                            ? "bg-surface text-accent shadow-sm"
                            : "text-text-muted hover:text-text-main hover:bg-white/5"
                    )}
                >
                    Templates
                </button>
                <button
                    onClick={() => setLeftTab('layers')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[11px] font-bold uppercase transition-all",
                        leftTab === 'layers'
                            ? "bg-surface text-accent shadow-sm"
                            : "text-text-muted hover:text-text-main hover:bg-white/5"
                    )}
                >
                    Layers
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {leftTab === 'templates' ? (
                    <div className="p-4">
                        <h2 className="text-sm font-bold uppercase text-text-muted mb-4 sr-only">Templates</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    onClick={() => onAddTemplate?.(i)}
                                    className="aspect-video bg-surface-card rounded hover:bg-border/50 cursor-pointer border border-border hover:border-accent/50 transition-colors"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <LayersPanel
                        elements={elements}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        onReorder={onReorder}
                        onDelete={onDelete}
                    />
                )}
            </div>
        </div>
    );
}
