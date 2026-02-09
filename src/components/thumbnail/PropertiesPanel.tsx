import type { ThumbnailElement } from '../../types/thumbnail';
import { Button } from '../ui/Button';
import { X, Trash2, Copy, Layers } from 'lucide-react';

interface PropertiesPanelProps {
    element: ThumbnailElement | null;
    onChange: (id: string, attrs: Partial<ThumbnailElement>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onClose?: () => void; // For mobile drawer
}

export function PropertiesPanel({ element, onChange, onDelete, onDuplicate, onClose }: PropertiesPanelProps) {
    if (!element) {
        return (
            <div className="p-4 text-center text-text-muted h-full flex flex-col items-center justify-center">
                <p>Select an element to edit properties</p>
                {onClose && (
                    <Button variant="ghost" onClick={onClose} className="mt-4">
                        Close
                    </Button>
                )}
            </div>
        );
    }

    const handleChange = (key: keyof ThumbnailElement, value: any) => {
        onChange(element.id, { [key]: value });
    };

    return (
        <div className="p-4 space-y-6 h-full overflow-y-auto bg-surface backdrop-blur-md ">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold capitalize">{element.type} Properties</h3>
                {onClose && (
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X size={18} />
                    </Button>
                )}
            </div>

            {/* Common Actions */}
            <div className="grid grid-cols-2 gap-2">
                <Button variant="ghost" className="border border-white/10 justify-start" onClick={() => onDuplicate(element.id)}>
                    <Copy size={16} className="mr-2" /> Duplicate
                </Button>
                <Button variant="ghost" className="border border-red-500/20 text-red-400 hover:text-red-300 justify-start" onClick={() => onDelete(element.id)}>
                    <Trash2 size={16} className="mr-2" /> Delete
                </Button>
            </div>

            <hr className="border-white/10" />

            {/* Position & Size */}
            <div className="space-y-4">
                <h4 className="text-xs font-semibold text-text-muted uppercase">Position</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-xs text-text-muted">X</label>
                        <input
                            type="number"
                            value={Math.round(element.x)}
                            onChange={(e) => handleChange('x', Number(e.target.value))}
                            className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-text-muted">Y</label>
                        <input
                            type="number"
                            value={Math.round(element.y)}
                            onChange={(e) => handleChange('y', Number(e.target.value))}
                            className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Text Properties */}
            {element.type === 'text' && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase">Content</label>
                        <textarea
                            value={element.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            className="w-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-sm h-20"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase">Font Size ({element.fontSize}px)</label>
                        <input
                            type="range"
                            min="12"
                            max="200"
                            value={element.fontSize || 24}
                            onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase">Color</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={element.fill || '#000000'}
                                onChange={(e) => handleChange('fill', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-xs text-text-muted">{element.fill}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Shape Properties */}
            {(element.type === 'rect' || element.type === 'circle') && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase">Fill Color</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={element.fill || '#3b82f6'}
                                onChange={(e) => handleChange('fill', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-xs text-text-muted">{element.fill}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase">Stroke Color</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={element.stroke || '#000000'}
                                onChange={(e) => handleChange('stroke', e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-xs text-text-muted">{element.stroke}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-text-muted uppercase">Stroke Width ({element.strokeWidth || 0}px)</label>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            value={element.strokeWidth || 0}
                            onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            )}

            {/* Opacity */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-text-muted uppercase">Opacity ({Math.round((element.opacity || 1) * 100)}%)</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={element.opacity !== undefined ? element.opacity : 1}
                    onChange={(e) => handleChange('opacity', Number(e.target.value))}
                    className="w-full"
                />
            </div>
        </div>
    );
}
