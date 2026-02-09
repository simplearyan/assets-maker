import type { ThumbnailElement } from '../../types/thumbnail';
import { Button } from '../ui/Button';
import { Label } from '../ui/inputs/Label';
import { Input } from '../ui/inputs/Input';
import { Textarea } from '../ui/inputs/Textarea';
import { Slider } from '../ui/inputs/Slider';
import { ColorPicker } from '../ui/inputs/ColorPicker';
import { X, Trash2, Copy, ArrowUpToLine, ArrowDownToLine, ChevronUp, ChevronDown } from 'lucide-react';

interface CanvasSettings {
    width: number;
    height: number;
    background: string;
    isTransparent: boolean;
}

interface PropertiesPanelProps {
    element: ThumbnailElement | null;
    onChange: (id: string, attrs: Partial<ThumbnailElement>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onReorder?: (id: string, type: 'front' | 'back' | 'forward' | 'backward') => void;
    onClose?: () => void;
    // Canvas Settings
    canvasSettings?: CanvasSettings;
    onUpdateCanvas?: (settings: Partial<CanvasSettings>) => void;
}

export function PropertiesPanel({
    element, onChange, onDelete, onDuplicate, onReorder, onClose,
    canvasSettings, onUpdateCanvas
}: PropertiesPanelProps) {
    if (!element) {
        return (
            <div className="p-4 space-y-6 h-full overflow-y-auto bg-surface text-text-main">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Canvas Settings</h3>
                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X size={18} />
                        </Button>
                    )}
                </div>

                {/* Aspect Ratio Presets */}
                <div className="space-y-3">
                    <Label>Aspect Ratio</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={canvasSettings?.width === 1280 && canvasSettings?.height === 720 ? "primary" : "glass"}
                            size="sm"
                            onClick={() => onUpdateCanvas?.({ width: 1280, height: 720 })}
                        >
                            16:9 (YouTube)
                        </Button>
                        <Button
                            variant={canvasSettings?.width === 720 && canvasSettings?.height === 1280 ? "primary" : "glass"}
                            size="sm"
                            onClick={() => onUpdateCanvas?.({ width: 720, height: 1280 })}
                        >
                            9:16 (Shorts)
                        </Button>
                        <Button
                            variant={canvasSettings?.width === 1080 && canvasSettings?.height === 1080 ? "primary" : "glass"}
                            size="sm"
                            onClick={() => onUpdateCanvas?.({ width: 1080, height: 1080 })}
                        >
                            1:1 (Square)
                        </Button>
                        <Button
                            variant={canvasSettings?.width === 1280 && canvasSettings?.height === 960 ? "primary" : "glass"}
                            size="sm"
                            onClick={() => onUpdateCanvas?.({ width: 1280, height: 960 })}
                        >
                            4:3 (Classic)
                        </Button>
                    </div>
                </div>

                <hr className="border-border" />

                {/* Background Settings */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>Transparent Background</Label>
                        <input
                            type="checkbox"
                            checked={canvasSettings?.isTransparent}
                            onChange={(e) => onUpdateCanvas?.({ isTransparent: e.target.checked })}
                            className="w-5 h-5 rounded border-border bg-surface-card text-accent focus:ring-accent"
                        />
                    </div>

                    {!canvasSettings?.isTransparent && (
                        <div>
                            <Label className="mb-2 block">Background Color</Label>
                            <ColorPicker
                                value={canvasSettings?.background || '#ffffff'}
                                onChange={(value) => onUpdateCanvas?.({ background: value })}
                            />
                        </div>
                    )}
                </div>

                <div className="pt-8 text-center text-[11px] text-text-muted uppercase font-bold tracking-wider">
                    Project Info
                    <div className="mt-2 text-[10px] font-mono normal-case">
                        {canvasSettings?.width} x {canvasSettings?.height}px
                    </div>
                </div>
            </div>
        );
    }

    const handleChange = (key: keyof ThumbnailElement, value: any) => {
        onChange(element.id, { [key]: value });
    };

    return (
        <div className="p-4 space-y-6 h-full overflow-y-auto bg-surface text-text-main">
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
                <Button variant="glass" size="sm" className="border-red-500/20 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => onDelete(element.id)}>
                    <Trash2 size={16} className="mr-2" /> Delete
                </Button>
            </div>

            {/* Layering Controls */}
            <div className="space-y-2">
                <Label>Layering</Label>
                <div className="grid grid-cols-4 gap-1">
                    <Button variant="glass" size="sm" onClick={() => onReorder?.(element.id, 'front')} title="Bring to Front" className="px-0">
                        <ArrowUpToLine size={16} />
                    </Button>
                    <Button variant="glass" size="sm" onClick={() => onReorder?.(element.id, 'forward')} title="Bring Forward" className="px-0">
                        <ChevronUp size={16} />
                    </Button>
                    <Button variant="glass" size="sm" onClick={() => onReorder?.(element.id, 'backward')} title="Send Backward" className="px-0">
                        <ChevronDown size={16} />
                    </Button>
                    <Button variant="glass" size="sm" onClick={() => onReorder?.(element.id, 'back')} title="Send to Back" className="px-0">
                        <ArrowDownToLine size={16} />
                    </Button>
                </div>
            </div>

            {/* Text Properties - Content First */}
            {element.type === 'text' && (
                <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                        value={element.text || ''}
                        onChange={(e) => handleChange('text', e.target.value)}
                        className="h-24 font-medium text-lg"
                        autoFocus
                    />
                </div>
            )}

            <hr className="border-border" />

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

            {/* Other Text Properties */}
            {element.type === 'text' && (
                <div className="space-y-4">
                    <div>
                        <Label>Font Size ({element.fontSize}px)</Label>
                        <Slider
                            min={12}
                            max={200}
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
                            min={0}
                            max={20}
                            value={element.strokeWidth || 0}
                            onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
                        />
                    </div>
                </div>
            )}

            {/* Opacity */}
            <div>
                <Label>Opacity ({Math.round((element.opacity !== undefined ? element.opacity : 1) * 100)}%)</Label>
                <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={element.opacity !== undefined ? element.opacity : 1}
                    onChange={(e) => handleChange('opacity', Number(e.target.value))}
                />
            </div>
        </div>
    );
}
