import { useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { ColorPicker } from '../ui/inputs/ColorPicker';
import { Slider } from '../ui/inputs/Slider';
import {
    AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignEndVertical,
    ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, Trash2, Copy, Type,
    Bold, Italic, Underline, Edit3, Image, FileCode
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
    onExportSVG?: () => void;
    onExportPNG?: () => void;
}

export function PropertyPanel({
    selectedObject,
    onUpdateProperty,
    onDelete,
    onDuplicate,
    onReorder,
    onAlign,
    version,
    snapToGrid = true,
    onToggleGrid,
    onExportSVG,
    onExportPNG
}: PropertyPanelProps) {
    if (!selectedObject) {
        return (
            <GlassCard className="w-80 flex flex-col h-full border-l border-white/5 rounded-none rounded-l-3xl p-5 space-y-6 bg-surface/30 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                    <h3 className="font-bold text-lg text-text-main">Canvas</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-accent/30 transition-colors">
                        <span className="text-sm font-medium text-text-main">Snap to Grid</span>
                        <button
                            onClick={onToggleGrid}
                            className={`w-11 h-6 rounded-full transition-all relative ${snapToGrid ? 'bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]' : 'bg-white/10'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${snapToGrid ? 'translate-x-5' : ''}`} />
                        </button>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Export</label>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="ghost" className="bg-white/5 hover:bg-accent/10 border border-white/5 hover:border-accent/30 h-20 flex-col gap-2" onClick={onExportPNG}>
                                <div className="p-2 rounded-full bg-white/5">
                                    <Image size={20} className="text-accent" />
                                </div>
                                <span className="text-xs font-medium">PNG</span>
                            </Button>
                            <Button variant="ghost" className="bg-white/5 hover:bg-accent/10 border border-white/5 hover:border-accent/30 h-20 flex-col gap-2" onClick={onExportSVG}>
                                <div className="p-2 rounded-full bg-white/5">
                                    <FileCode size={20} className="text-accent" />
                                </div>
                                <span className="text-xs font-medium">SVG</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-auto">
                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 text-center">
                        <p className="text-xs text-text-muted">
                            Select an element on the canvas to edit its properties.
                        </p>
                    </div>
                </div>
            </GlassCard>
        );
    }

    const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text';

    // Force re-render when version changes
    useEffect(() => {
        // console.log('PropertyPanel version:', version);
    }, [version]);

    return (
        <GlassCard className="w-80 flex flex-col h-full border-l border-white/5 rounded-none rounded-l-3xl p-5 overflow-y-auto custom-scrollbar space-y-6 bg-surface/30 backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="font-bold text-lg text-text-main">Properties</h3>
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onDuplicate} title="Duplicate">
                        <Copy size={14} />
                    </Button>
                    {selectedObject.type === 'polygon' && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => (selectedObject?.canvas as any)?.toggleEdit?.()} title="Edit Points">
                            <Edit3 size={14} />
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:text-red-500 hover:bg-red-500/10" onClick={onDelete} title="Delete">
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>

            {/* Alignment */}
            <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Alignment</label>
                <div className="bg-white/5 p-1 rounded-xl grid grid-cols-6 gap-0.5">
                    <Button variant="ghost" size="sm" className="px-0 h-8 rounded-md hover:bg-white/10" onClick={() => onAlign('left')} title="Align Left">
                        <AlignLeft size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8 rounded-md hover:bg-white/10" onClick={() => onAlign('center')} title="Align Center">
                        <AlignCenter size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8 rounded-md hover:bg-white/10" onClick={() => onAlign('right')} title="Align Right">
                        <AlignRight size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8 rounded-md hover:bg-white/10" onClick={() => onAlign('top')} title="Align Top">
                        <AlignStartVertical size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8 rounded-md hover:bg-white/10" onClick={() => onAlign('middle')} title="Align Middle">
                        <AlignCenter size={16} className="rotate-90" />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-0 h-8 rounded-md hover:bg-white/10" onClick={() => onAlign('bottom')} title="Align Bottom">
                        <AlignEndVertical size={16} />
                    </Button>
                </div>
            </div>

            {/* Layering */}
            <div className="space-y-3">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Layer Order</label>
                <div className="grid grid-cols-4 gap-2">
                    <Button variant="ghost" size="sm" className="h-9 bg-white/5 border border-white/5 hover:border-accent/30" onClick={() => onReorder('front')} title="Bring to Front">
                        <ArrowUpToLine size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 bg-white/5 border border-white/5 hover:border-accent/30" onClick={() => onReorder('forward')} title="Bring Forward">
                        <ArrowUp size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 bg-white/5 border border-white/5 hover:border-accent/30" onClick={() => onReorder('backward')} title="Send Backward">
                        <ArrowDown size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 bg-white/5 border border-white/5 hover:border-accent/30" onClick={() => onReorder('back')} title="Send to Back">
                        <ArrowDownToLine size={16} />
                    </Button>
                </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Appearance</label>
                </div>

                <div className="space-y-3">
                    <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                        <button
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${typeof selectedObject.fill === 'string' ? 'bg-white/10 text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                            onClick={() => onUpdateProperty('fill', '#000000')}
                        >
                            Solid
                        </button>
                        <button
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${typeof selectedObject.fill !== 'string' ? 'bg-white/10 text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                            onClick={() => {
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

                    {typeof selectedObject.fill === 'string' ? (
                        <ColorPicker
                            value={selectedObject.fill}
                            onChange={(val) => onUpdateProperty('fill', val)}
                        />
                    ) : (
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-[10px] text-text-muted uppercase font-bold tracking-tight">Gradient Stops</span>
                            </div>
                            <div className="space-y-2">
                                {(selectedObject.fill as fabric.Gradient).colorStops?.map((stop, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-surface/50 p-2 rounded-lg border border-white/5">
                                        <div className="flex-1 flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full border border-white/20"
                                                style={{ backgroundColor: stop.color }}
                                            />
                                            <span className="text-xs text-text-muted font-mono">{Math.round(stop.offset * 100)}%</span>
                                        </div>
                                        <ColorPicker
                                            value={stop.color || '#000000'}
                                            onChange={(newColor) => {
                                                const fill = selectedObject.fill as fabric.Gradient;
                                                const newStops = [...(fill.colorStops || [])];
                                                newStops[index] = { ...newStops[index], color: newColor };

                                                const newGradient = new fabric.Gradient({
                                                    type: fill.type,
                                                    coords: fill.coords,
                                                    colorStops: newStops
                                                });
                                                onUpdateProperty('fill', newGradient);
                                            }}
                                            className="!gap-1"
                                        />
                                    </div>
                                ))}
                            </div>
                            <Button size="sm" variant="ghost" className="w-full text-[10px] h-7 hover:bg-white/5" onClick={() => onUpdateProperty('fill', '#3b82f6')}>
                                Revert to Solid Color
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-text-muted px-1">
                        <span>Opacity</span>
                        <span>{Math.round((selectedObject.opacity || 1) * 100)}%</span>
                    </div>
                    <Slider
                        min={0} max={1} step={0.01}
                        value={selectedObject.opacity || 1}
                        onChange={(e) => onUpdateProperty('opacity', parseFloat(e.target.value as any))}
                    />
                </div>
            </div>

            {/* Typography (Conditional) */}
            {isText && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 px-1">
                        <Type size={14} className="text-accent" /> Typography
                    </label>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-text-muted px-1">
                            <span>Font Size</span>
                            <span>{(selectedObject as any).fontSize}px</span>
                        </div>
                        <Slider
                            min={8} max={200} step={1}
                            value={(selectedObject as any).fontSize || 40}
                            onChange={(e) => onUpdateProperty('fontSize', parseInt(e.target.value as any))}
                        />
                    </div>

                    <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 ${(selectedObject as any).fontWeight === 'bold' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                            onClick={() => onUpdateProperty('fontWeight', (selectedObject as any).fontWeight === 'bold' ? 'normal' : 'bold')}
                        >
                            <Bold size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 ${(selectedObject as any).fontStyle === 'italic' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
                            onClick={() => onUpdateProperty('fontStyle', (selectedObject as any).fontStyle === 'italic' ? 'normal' : 'italic')}
                        >
                            <Italic size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`flex-1 ${(selectedObject as any).underline ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-white'}`}
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
