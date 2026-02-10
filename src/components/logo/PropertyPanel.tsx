import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { ColorPicker } from '../ui/inputs/ColorPicker';
import { Slider } from '../ui/inputs/Slider';
import {
    AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignEndVertical,
    ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, Trash2, Copy, Type,
    Bold, Italic, Underline, Edit3
} from 'lucide-react';
import { fabric } from 'fabric';

interface PropertyPanelProps {
    selectedObject: fabric.Object | null;
    onUpdateProperty: (key: string, value: any) => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onReorder: (action: 'front' | 'back' | 'forward' | 'backward') => void;
    onAlign: (action: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
    version?: number;
    snapToGrid?: boolean;
    onToggleGrid?: () => void;
}

export function PropertyPanel({
    selectedObject,
    onUpdateProperty,
    onDelete,
    onDuplicate,
    onReorder,
    onAlign,
    version = 0,
    snapToGrid = true,
    onToggleGrid
}: PropertyPanelProps) {
    if (!selectedObject) {
        return (
            <GlassCard className="w-80 flex flex-col h-full border-l border-white/5 rounded-none rounded-l-3xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-text-main">Canvas</h3>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Settings</label>

                    <div className="flex items-center justify-between p-3 bg-surface/30 rounded-xl border border-white/5">
                        <span className="text-sm text-text-main">Snap to Grid</span>
                        <button
                            onClick={onToggleGrid}
                            className={`w-10 h-5 rounded-full transition-colors relative ${snapToGrid ? 'bg-accent' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${snapToGrid ? 'translate-x-5' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <p className="text-xs text-text-muted text-center">
                        Select an element on the canvas to edit its properties.
                    </p>
                </div>
            </GlassCard>
        );
    }

    const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text';

    return (
        <GlassCard className="w-80 flex flex-col h-full border-l border-white/5 rounded-none rounded-l-3xl p-6 overflow-y-auto custom-scrollbar space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-text-main">Properties</h3>
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={onDuplicate} title="Duplicate">
                        <Copy size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => (selectedObject?.canvas as any)?.toggleEdit?.()} title="Edit Points (Polygons)">
                        <Edit3 size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-500 hover:bg-red-500/10" title="Delete">
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>

            {/* Alignment */}
            <div className="space-y-3">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Alignment</label>
                <div className="grid grid-cols-6 gap-1">
                    <Button variant="ghost" size="sm" className="px-0 h-8" onClick={() => onAlign('left')} title="Align Left">
                        <AlignLeft size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8" onClick={() => onAlign('center')} title="Align Center">
                        <AlignCenter size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8" onClick={() => onAlign('right')} title="Align Right">
                        <AlignRight size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8" onClick={() => onAlign('top')} title="Align Top">
                        <AlignStartVertical size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8" onClick={() => onAlign('middle')} title="Align Middle">
                        <AlignCenter size={16} className="rotate-90" />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8" onClick={() => onAlign('bottom')} title="Align Bottom">
                        <AlignEndVertical size={16} />
                    </Button>
                </div>
            </div>

            {/* Layering */}
            <div className="space-y-3">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Layer Order</label>
                <div className="grid grid-cols-4 gap-2">
                    <Button variant="ghost" size="sm" className="h-9" onClick={() => onReorder('front')} title="Bring to Front">
                        <ArrowUpToLine size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9" onClick={() => onReorder('forward')} title="Bring Forward">
                        <ArrowUp size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9" onClick={() => onReorder('backward')} title="Send Backward">
                        <ArrowDown size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9" onClick={() => onReorder('back')} title="Send to Back">
                        <ArrowDownToLine size={16} />
                    </Button>
                </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Appearance</label>

                <div className="space-y-3">
                    <div className="flex gap-2">
                        <button
                            className="text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-main"
                            onClick={() => onUpdateProperty('fill', '#000000')} // Reset to solid black default
                        >
                            Solid
                        </button>
                        <div className="w-px h-3 bg-white/10 my-auto" />
                        <button
                            className="text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-main"
                            onClick={() => {
                                // Apply a default linear gradient
                                const gradient = new fabric.Gradient({
                                    type: 'linear',
                                    coords: { x1: 0, y1: 0, x2: 0, y2: selectedObject.height! },
                                    colorStops: [
                                        { offset: 0, color: '#3b82f6' },
                                        { offset: 1, color: '#ef4444' }
                                    ]
                                });
                                onUpdateProperty('fill', gradient);
                            }}
                        >
                            Gradient
                        </button>
                    </div>

                    <div className="flex justify-between text-xs text-text-muted">
                        <span>Fill</span>
                        <span>{typeof selectedObject.fill === 'string' ? selectedObject.fill : 'Gradient'}</span>
                    </div>

                    {typeof selectedObject.fill === 'string' ? (
                        <ColorPicker
                            value={selectedObject.fill}
                            onChange={(val) => onUpdateProperty('fill', val)}
                        />
                    ) : (
                        <div className="p-3 bg-surface/30 rounded-lg border border-white/5 space-y-2">
                            <p className="text-xs text-text-muted">Gradient editing coming soon...</p>
                            <Button size="sm" variant="ghost" className="w-full text-xs" onClick={() => onUpdateProperty('fill', '#3b82f6')}>
                                Revert to Solid
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-text-muted">
                        <span>Opacity</span>
                        <span>{Math.round((selectedObject.opacity || 1) * 100)}%</span>
                    </div>
                    <Slider
                        key={`opacity-${version}`} // Force re-render on version change
                        min={0} max={1} step={0.01}
                        value={selectedObject.opacity || 1}
                        onChange={(e) => onUpdateProperty('opacity', parseFloat(e.target.value as any))}
                    />
                </div>
            </div>

            {/* Typography (Conditional) */}
            {isText && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                        <Type size={12} /> Typography
                    </label>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-text-muted">
                            <span>Font Size</span>
                            <span>{(selectedObject as any).fontSize}px</span>
                        </div>
                        <Slider
                            key={`fontsize-${version}`}
                            min={8} max={200} step={1}
                            value={(selectedObject as any).fontSize || 40}
                            onChange={(e) => onUpdateProperty('fontSize', parseInt(e.target.value as any))}
                        />
                    </div>

                    <div className="flex gap-2 bg-surface/30 p-1 rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 ${(selectedObject as any).fontWeight === 'bold' ? 'bg-accent text-white' : ''}`}
                            onClick={() => onUpdateProperty('fontWeight', (selectedObject as any).fontWeight === 'bold' ? 'normal' : 'bold')}
                        >
                            <Bold size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 ${(selectedObject as any).fontStyle === 'italic' ? 'bg-accent text-white' : ''}`}
                            onClick={() => onUpdateProperty('fontStyle', (selectedObject as any).fontStyle === 'italic' ? 'normal' : 'italic')}
                        >
                            <Italic size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 ${(selectedObject as any).underline ? 'bg-accent text-white' : ''}`}
                            onClick={() => onUpdateProperty('underline', !(selectedObject as any).underline)}
                        >
                            <Underline size={16} />
                        </Button>
                    </div>
                </div>
            )}
        </GlassCard>
    );
}
