import { useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { ColorPicker } from '../ui/inputs/ColorPicker';
import { Slider } from '../ui/inputs/Slider';
import {
    AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignEndVertical,
    ArrowUp, ArrowDown, ArrowUpToLine, ArrowDownToLine, Trash2, Copy, Type,
    Bold, Italic, Underline, Edit3, Image, FileCode, Monitor,
    Sparkles, Focus, Save
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
    // Canvas settings
    canvasBg?: string;
    isTransparent?: boolean;
    canvasWidth?: number;
    canvasHeight?: number;
    onUpdateCanvasBg?: (color: string) => void;
    onUpdateCanvasTransparency?: (transparent: boolean) => void;
    onUpdateCanvasDimensions?: (w: number, h: number) => void;
    fonts?: string[];
    onLoadFont?: (font: string) => void;
    onSaveProject?: () => void;
    onClearProject?: () => void;
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
    onExportPNG,
    canvasBg = '#ffffff',
    isTransparent = false,
    canvasWidth = 800,
    canvasHeight = 600,
    onUpdateCanvasBg,
    onUpdateCanvasTransparency,
    onUpdateCanvasDimensions,
    fonts = [],
    onLoadFont,
    onSaveProject,
    onClearProject,
}: PropertyPanelProps) {
    if (!selectedObject) {
        return (
            <GlassCard className="w-80 flex flex-col h-full bg-surface/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 p-5 space-y-6">
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

                    {/* Canvas Background */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Background</label>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-text-muted">Transparent</span>
                                <button
                                    onClick={() => onUpdateCanvasTransparency?.(!isTransparent)}
                                    className={`w-9 h-5 rounded-full transition-all relative ${isTransparent ? 'bg-accent' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${isTransparent ? 'translate-x-4' : ''}`} />
                                </button>
                            </div>
                            {!isTransparent && (
                                <ColorPicker
                                    value={canvasBg}
                                    onChange={(val) => onUpdateCanvasBg?.(val)}
                                />
                            )}
                        </div>
                    </div>

                    {/* Aspect Ratio */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Aspect Ratio</label>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { label: '1:1', w: 800, h: 800 },
                                { label: '4:3', w: 1024, h: 768 },
                                { label: '16:9', w: 1280, h: 720 },
                                { label: '9:16', w: 720, h: 1280 },
                            ].map((ratio) => (
                                <Button
                                    key={ratio.label}
                                    variant="ghost"
                                    size="sm"
                                    className={`text-[10px] h-9 border border-white/5 ${canvasWidth === ratio.w && canvasHeight === ratio.h ? 'bg-accent/20 text-accent border-accent/30' : 'bg-white/5'}`}
                                    onClick={() => onUpdateCanvasDimensions?.(ratio.w, ratio.h)}
                                >
                                    <Monitor size={12} className="mr-1 opacity-50" />
                                    {ratio.label}
                                </Button>
                            ))}
                        </div>

                        {/* Custom Dimensions */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="space-y-1">
                                <span className="text-[10px] text-text-muted ml-1">Width</span>
                                <input
                                    type="number"
                                    value={canvasWidth}
                                    onChange={(e) => onUpdateCanvasDimensions?.(parseInt(e.target.value) || 0, canvasHeight)}
                                    className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1.5 text-xs text-text-main focus:border-accent/50 outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-text-muted ml-1">Height</span>
                                <input
                                    type="number"
                                    value={canvasHeight}
                                    onChange={(e) => onUpdateCanvasDimensions?.(canvasWidth, parseInt(e.target.value) || 0)}
                                    className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1.5 text-xs text-text-main focus:border-accent/50 outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">Storage</label>
                        <div className="grid grid-cols-1 gap-2">
                            <Button
                                variant="ghost"
                                className="bg-white/5 hover:bg-green-500/10 border border-white/5 hover:border-green-500/30 justify-between group"
                                onClick={onSaveProject}
                            >
                                <div className="flex items-center gap-2">
                                    <Save size={16} className="text-green-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">Save Project</span>
                                </div>
                                <span className="text-[10px] text-text-muted italic">Manual Sync</span>
                            </Button>
                            <Button
                                variant="ghost"
                                className="bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 justify-between group"
                                onClick={onClearProject}
                            >
                                <div className="flex items-center gap-2">
                                    <Trash2 size={16} className="text-red-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-medium">Clear All</span>
                                </div>
                                <span className="text-[10px] text-text-muted italic">Reset Studio</span>
                            </Button>
                        </div>
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
        <GlassCard className="w-80 flex flex-col h-full bg-surface/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 p-5 overflow-y-auto custom-scrollbar space-y-6">
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

                    {/* Font Family Selector */}
                    <div className="space-y-2">
                        <span className="text-[10px] text-text-muted ml-1 uppercase font-bold">Font Family</span>
                        <div className="grid grid-cols-1 gap-2">
                            <select
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-2 text-xs text-text-main focus:border-accent/50 outline-none transition-colors appearance-none cursor-pointer"
                                value={(selectedObject as any).fontFamily}
                                onChange={(e) => {
                                    const font = e.target.value;
                                    onLoadFont?.(font);
                                    onUpdateProperty('fontFamily', font);
                                }}
                            >
                                <option value="Inter" className="bg-surface text-text-main">Inter (Default)</option>
                                {fonts.filter(f => f !== 'Inter').map(font => (
                                    <option key={font} value={font} className="bg-surface text-text-main" style={{ fontFamily: font }}>
                                        {font}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

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

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-text-muted px-1">
                            <span>Letter Spacing</span>
                            <span>{(selectedObject as any).charSpacing / 10 || 0}</span>
                        </div>
                        <Slider
                            min={-100} max={500} step={10}
                            value={(selectedObject as any).charSpacing || 0}
                            onChange={(e) => onUpdateProperty('charSpacing', parseInt(e.target.value as any))}
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

            {/* SVG Component Colors (Group) */}
            {selectedObject.type === 'group' && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 px-1">
                        <FileCode size={14} className="text-accent" /> Component Colors
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                        {(selectedObject as fabric.Group).getObjects().map((obj, idx) => {
                            // Show all objects that have a fill, even if it's a gradient
                            if (!obj.fill) return null;

                            const isGradient = typeof obj.fill !== 'string';
                            const fillColor = isGradient ? '#cccccc' : (obj.fill as string);

                            return (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5 group transition-all hover:bg-white/10"
                                    onMouseEnter={() => onUpdateProperty('highlightChild', { index: idx, active: true })}
                                    onMouseLeave={() => onUpdateProperty('highlightChild', { index: idx, active: false })}
                                >
                                    <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                                        <span className="text-[10px] text-text-muted uppercase font-bold">Path {idx + 1}</span>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-3 h-3 rounded-full border border-white/20 ${isGradient ? 'bg-gradient-to-tr from-gray-400 to-gray-600' : ''}`}
                                                style={!isGradient ? { backgroundColor: fillColor } : {}}
                                            />
                                            <span className="text-[10px] text-text-muted font-mono truncate">
                                                {isGradient ? 'Gradient' : fillColor}
                                            </span>
                                        </div>
                                    </div>
                                    <ColorPicker
                                        value={fillColor}
                                        onChange={(val) => onUpdateProperty('childFill', { index: idx, color: val })}
                                        className="!gap-1"
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-text-muted px-1 italic">
                        Tip: Hover over a color to see the path on canvas.
                    </p>
                </div>
            )}

            {/* Effects */}
            {selectedObject && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2 px-1">
                        <Sparkles size={14} className="text-accent" /> Effects
                    </label>

                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-text-main">Drop Shadow</span>
                            <button
                                onClick={() => {
                                    const hasShadow = !!selectedObject.shadow;
                                    if (hasShadow) {
                                        onUpdateProperty('shadow', null);
                                    } else {
                                        onUpdateProperty('shadow', {
                                            color: 'rgba(0,0,0,0.5)',
                                            blur: 10,
                                            offsetX: 5,
                                            offsetY: 5
                                        });
                                    }
                                }}
                                className={`w-9 h-5 rounded-full transition-all relative ${selectedObject.shadow ? 'bg-accent' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${selectedObject.shadow ? 'translate-x-4' : ''}`} />
                            </button>
                        </div>

                        {selectedObject.shadow && (
                            <div className="space-y-3 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-1">
                                <div className="space-y-2">
                                    <span className="text-[10px] text-text-muted uppercase font-bold px-1">Shadow Color</span>
                                    <ColorPicker
                                        value={(selectedObject.shadow as any).color || '#000000'}
                                        onChange={(val) => {
                                            const s = selectedObject.shadow as any;
                                            onUpdateProperty('shadow', { ...s, color: val });
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] text-text-muted px-1 font-bold">
                                        <span>BLUR</span>
                                        <span>{(selectedObject.shadow as any).blur}</span>
                                    </div>
                                    <Slider
                                        min={0} max={50} step={1}
                                        value={(selectedObject.shadow as any).blur || 10}
                                        onChange={(e) => {
                                            const s = selectedObject.shadow as any;
                                            onUpdateProperty('shadow', { ...s, blur: parseInt(e.target.value as any) });
                                        }}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-text-muted px-1">Offset X</span>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-xs text-text-main outline-none focus:border-accent/50"
                                            value={(selectedObject.shadow as any).offsetX}
                                            onChange={(e) => {
                                                const s = selectedObject.shadow as any;
                                                onUpdateProperty('shadow', { ...s, offsetX: parseInt(e.target.value as any) });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-text-muted px-1">Offset Y</span>
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/5 rounded-lg px-2 py-1 text-xs text-text-main outline-none focus:border-accent/50"
                                            value={(selectedObject.shadow as any).offsetY}
                                            onChange={(e) => {
                                                const s = selectedObject.shadow as any;
                                                onUpdateProperty('shadow', { ...s, offsetY: parseInt(e.target.value as any) });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 px-1">
                        <div className="flex justify-between text-xs text-text-muted">
                            <span className="flex items-center gap-1 font-medium"><Focus size={12} /> Global Blur</span>
                            <span>{Math.round((selectedObject as any).blur || 0)}px</span>
                        </div>
                        <Slider
                            min={0} max={50} step={1}
                            value={(selectedObject as any).blur || 0}
                            onChange={(e) => onUpdateProperty('blur', parseInt(e.target.value as any))}
                        />
                    </div>
                </div>
            )}
        </GlassCard>
    );
}
