import type { ThumbnailElement } from '../../types/thumbnail';
import { Button } from '../ui/Button';
import { Label } from '../ui/inputs/Label';
import { Input } from '../ui/inputs/Input';
import { Textarea } from '../ui/inputs/Textarea';
import { Slider } from '../ui/inputs/Slider';
import { ColorPicker } from '../ui/inputs/ColorPicker';
import { X, Trash2, Copy } from 'lucide-react';

interface PropertiesPanelProps {
    element: ThumbnailElement | null;
    onChange: (id: string, attrs: Partial<ThumbnailElement>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onClose?: () => void;
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
        <div className="p-4 space-y-6 h-full overflow-y-auto bg-zinc-950 text-white">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold capitalize">{element.type} Properties</h3>
                {onClose && (
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X size={18} />
                    </Button>
                )}
            </div>

            {/* Common Actions */}
            <div className="grid grid-cols-2 gap-2">
                <Button variant="glass" size="sm" onClick={() => onDuplicate(element.id)}>
                    <Copy size={16} className="mr-2" /> Duplicate
                </Button>
                <Button variant="glass" size="sm" className="border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => onDelete(element.id)}>
                    <Trash2 size={16} className="mr-2" /> Delete
                </Button>
            </div>

            <hr className="border-white/10" />

            {/* Position & Size */}
            <div className="space-y-3">
                <Label>Position</Label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-[10px] mb-1">X</Label>
                        <Input
                            type="number"
                            value={Math.round(element.x)}
                            onChange={(e) => handleChange('x', Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label className="text-[10px] mb-1">Y</Label>
                        <Input
                            type="number"
                            value={Math.round(element.y)}
                            onChange={(e) => handleChange('y', Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Text Properties */}
            {element.type === 'text' && (
                <div className="space-y-4">
                    <div>
                        <Label>Content</Label>
                        <Textarea
                            value={element.text || ''}
                            onChange={(e) => handleChange('text', e.target.value)}
                            className="h-24 font-medium"
                        />
                    </div>
                    <div>
                        <Label>Font Size ({element.fontSize}px)</Label>
                        <Slider
                            min="12"
                            max="200"
                            value={element.fontSize || 24}
                            onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label>Color</Label>
                        <ColorPicker
                            value={element.fill || '#000000'}
                            onChange={(value) => handleChange('fill', value)}
                        />
                    </div>
                </div>
            )}

            {/* Shape Properties */}
            {(element.type === 'rect' || element.type === 'circle') && (
                <div className="space-y-4">
                    <div>
                        <Label>Fill Color</Label>
                        <ColorPicker
                            value={element.fill || '#3b82f6'}
                            onChange={(value) => handleChange('fill', value)}
                        />
                    </div>
                    <div>
                        <Label>Stroke Color</Label>
                        <ColorPicker
                            value={element.stroke || '#000000'}
                            onChange={(value) => handleChange('stroke', value)}
                        />
                    </div>
                    <div>
                        <Label>Stroke Width ({element.strokeWidth || 0}px)</Label>
                        <Slider
                            min="0"
                            max="20"
                            value={element.strokeWidth || 0}
                            onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
                        />
                    </div>
                </div>
            )}

            {/* Opacity */}
            <div>
                <Label>Opacity ({Math.round((element.opacity || 1) * 100)}%)</Label>
                <Slider
                    min="0"
                    max="1"
                    step="0.01"
                    value={element.opacity !== undefined ? element.opacity : 1}
                    onChange={(e) => handleChange('opacity', Number(e.target.value))}
                />
            </div>
        </div>
    );
}
