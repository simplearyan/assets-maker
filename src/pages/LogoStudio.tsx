import { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Square, Circle as CircleIcon, Type, MousePointer2, Download, Trash2, Upload, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { fabric } from 'fabric';

type Tool = 'select' | 'rect' | 'circle' | 'text';

export function LogoStudio() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [activeTool, setActiveTool] = useState<Tool>('select');
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

    // Initialize Fabric Canvas
    useEffect(() => {
        if (!canvasRef.current || fabricCanvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true,
        });

        fabricCanvasRef.current = canvas;

        // Event Listeners
        const updateSelection = () => {
            const active = canvas.getActiveObject();
            setSelectedObject(active);
        };

        canvas.on('selection:created', updateSelection);
        canvas.on('selection:updated', updateSelection);
        canvas.on('selection:cleared', updateSelection);

        return () => {
            canvas.dispose();
            fabricCanvasRef.current = null;
        };
    }, []);

    const addRectangle = () => {
        if (!fabricCanvasRef.current) return;
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: '#3b82f6',
            width: 100,
            height: 100,
        });
        fabricCanvasRef.current.add(rect);
        fabricCanvasRef.current.setActiveObject(rect);
    };

    const addCircle = () => {
        if (!fabricCanvasRef.current) return;
        const circle = new fabric.Circle({
            left: 250,
            top: 100,
            fill: '#ef4444',
            radius: 50,
        });
        fabricCanvasRef.current.add(circle);
        fabricCanvasRef.current.setActiveObject(circle);
    };

    const addText = () => {
        if (!fabricCanvasRef.current) return;
        const text = new fabric.IText('Logo Text', {
            left: 100,
            top: 250,
            fontFamily: 'Inter',
            fill: '#000000',
            fontSize: 40,
        });
        fabricCanvasRef.current.add(text);
        fabricCanvasRef.current.setActiveObject(text);
    };

    const deleteSelected = () => {
        if (!fabricCanvasRef.current) return;
        const active = fabricCanvasRef.current.getActiveObject();
        if (active) {
            fabricCanvasRef.current.remove(active);
            fabricCanvasRef.current.discardActiveObject();
            fabricCanvasRef.current.requestRenderAll();
            setSelectedObject(null);
        }
    };

    const updateProperty = (key: string, value: any) => {
        if (!fabricCanvasRef.current) return;
        const active = fabricCanvasRef.current.getActiveObject();
        if (active) {
            active.set(key as any, value);
            fabricCanvasRef.current.requestRenderAll();
            // Force update state to reflect changes if needed, though mostly visual
            setSelectedObject({ ...active } as fabric.Object);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !fabricCanvasRef.current) return;

        const reader = new FileReader();
        reader.onload = (f) => {
            const result = f.target?.result as string;
            if (file.type === 'image/svg+xml') {
                fabric.loadSVGFromString(result, (objects: fabric.Object[], options: fabric.IGroupOptions) => {
                    const obj = fabric.util.groupSVGElements(objects, options);
                    fabricCanvasRef.current?.add(obj);
                    fabricCanvasRef.current?.renderAll();
                });
            } else if (file.type.startsWith('image/')) {
                // Regular image
                fabric.Image.fromURL(result, (img: fabric.Image) => {
                    img.scaleToWidth(200);
                    fabricCanvasRef.current?.add(img);
                });
            }
        };
        reader.readAsText(file); // For SVG
        // Note: For regular images use readAsDataURL, but let's stick to SVG optimized workflow or handle both
        if (file.type !== 'image/svg+xml') {
            const urlReader = new FileReader();
            urlReader.onload = (f) => {
                fabric.Image.fromURL(f.target?.result as string, (img: fabric.Image) => {
                    img.scaleToWidth(200);
                    fabricCanvasRef.current?.add(img);
                });
            }
            urlReader.readAsDataURL(file);
            return;
        }
    };

    const exportSVG = () => {
        if (!fabricCanvasRef.current) return;
        const svg = fabricCanvasRef.current.toSVG();
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'logo.svg';
        link.href = url;
        link.click();
    };

    const exportPNG = () => {
        if (!fabricCanvasRef.current) return;
        const url = fabricCanvasRef.current.toDataURL({ format: 'png', multiplier: 2 });
        const link = document.createElement('a');
        link.download = 'logo.png';
        link.href = url;
        link.click();
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Tools Panel */}
            <GlassCard className="w-16 flex flex-col items-center gap-4 py-6 px-2">
                <ToolButton
                    icon={MousePointer2}
                    active={activeTool === 'select'}
                    onClick={() => setActiveTool('select')}
                    label="Select"
                />
                <div className="w-full h-px bg-white/10" />
                <ToolButton icon={Square} onClick={addRectangle} label="Rectangle" />
                <ToolButton icon={CircleIcon} onClick={addCircle} label="Circle" />
                <ToolButton icon={Type} onClick={addText} label="Text" />
                <div className="w-full h-px bg-white/10" />
                <label className="cursor-pointer p-3 rounded-xl text-text-muted hover:bg-white/5 hover:text-text-main transition-all relative group">
                    <Upload size={20} />
                    <input type="file" className="hidden" accept=".svg,image/*" onChange={handleFileUpload} />
                    <span className="absolute left-full ml-4 px-2 py-1 bg-surface border border-border rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        Import
                    </span>
                </label>
            </GlassCard>

            {/* Canvas Area */}
            <div className="flex-1 bg-surface/30 rounded-3xl border border-border flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="shadow-2xl">
                    <canvas ref={canvasRef} />
                </div>
            </div>

            {/* Properties Panel */}
            <GlassCard className="w-72 flex flex-col gap-6">
                <h3 className="font-bold text-lg">Properties</h3>
                {selectedObject ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-text-muted">Fill Color</label>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#ffffff', '#000000', 'transparent'].map(color => (
                                    <button
                                        key={color}
                                        className="w-8 h-8 rounded-full border border-white/10 hover:scale-110 transition-transform relative"
                                        style={{ backgroundColor: color === 'transparent' ? 'transparent' : color }}
                                        onClick={() => updateProperty('fill', color)}
                                    >
                                        {color === 'transparent' && <div className="absolute inset-0 border border-red-500 transform rotate-45" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Simple Opacity Slider */}
                        <div>
                            <label className="text-xs text-text-muted">Opacity</label>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={selectedObject.opacity || 1}
                                onChange={(e) => updateProperty('opacity', parseFloat(e.target.value))}
                                className="w-full mt-2 accent-accent"
                            />
                        </div>

                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={deleteSelected}>
                            <Trash2 size={16} className="mr-2" /> Delete Element
                        </Button>
                    </div>
                ) : (
                    <p className="text-text-muted text-sm">Select an element to edit properties.</p>
                )}

                <div className="mt-auto space-y-2">
                    <Button className="w-full" onClick={exportPNG}>
                        <Download size={18} className="mr-2" /> Export PNG
                    </Button>
                    <Button variant="glass" className="w-full" onClick={exportSVG}>
                        <Download size={18} className="mr-2" /> Export SVG
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
}

interface ToolButtonProps {
    icon: LucideIcon;
    active?: boolean;
    onClick: () => void;
    label: string;
}

const ToolButton = ({ icon: Icon, active, onClick, label }: ToolButtonProps) => (
    <button
        onClick={onClick}
        className={cn(
            "p-3 rounded-xl transition-all duration-300 relative group",
            active ? "bg-accent text-white shadow-lg shadow-accent/25" : "text-text-muted hover:bg-white/5 hover:text-text-main"
        )}
        title={label}
    >
        <Icon size={20} />
        <span className="absolute left-full ml-4 px-2 py-1 bg-surface border border-border rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
            {label}
        </span>
    </button>
);
