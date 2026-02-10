import { useState } from 'react';
import { cn } from '../../lib/utils';
import { LayersPanel } from './LayersPanel';
import { TEMPLATES, type Template } from '../../data/templates';
import type { ThumbnailElement } from '../../types/thumbnail';

interface SidebarContentProps {
    elements: ThumbnailElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onReorder: (id: string, type: 'front' | 'back' | 'forward' | 'backward') => void;
    onDelete: (id: string) => void;
    onAddTemplate?: (template: Template) => void;
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
                        <div className="grid grid-cols-2 gap-3">
                            {TEMPLATES.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => onAddTemplate?.(template)}
                                    className="group cursor-pointer space-y-2"
                                >
                                    <div
                                        className="aspect-video rounded-md border border-border group-hover:border-accent/50 transition-all overflow-hidden shadow-sm hover:shadow-md relative"
                                        style={{ background: template.preview.includes('gradient') ? template.preview : template.preview }}
                                    >
                                        {!template.preview.includes('gradient') && (
                                            <div className="w-full h-full" style={{ backgroundColor: template.preview }} />
                                        )}
                                        {/* Mock Elements Preview */}
                                        <div className="absolute inset-0 opacity-50 scale-50 origin-top-left pointer-events-none">
                                            {/* Simplified rendering for preview could go here if needed */}
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-medium text-text-muted group-hover:text-text-main truncate text-center">
                                        {template.name}
                                    </p>
                                </div>
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
