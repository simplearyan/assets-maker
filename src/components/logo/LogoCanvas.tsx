import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric';

interface LogoCanvasProps {
    onSelectionChange: (obj: fabric.Object | null) => void;
}

export interface LogoCanvasRef {
    addShape: (type: 'rect' | 'circle' | 'triangle' | 'polygon') => void;
    addText: (type: 'heading' | 'subheading' | 'body') => void;
    addIcon: (svgString: string) => void;
    updateProperty: (key: string, value: any) => void;
    deleteSelected: () => void;
    duplicateSelected: () => void;
    reorderSelected: (action: 'front' | 'back' | 'forward' | 'backward') => void;
    alignSelected: (action: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
    exportSVG: () => void;
    exportPNG: () => void;
    canvas: fabric.Canvas | null;
}

export const LogoCanvas = forwardRef<LogoCanvasRef, LogoCanvasProps>(({ onSelectionChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

    useImperativeHandle(ref, () => ({
        canvas: fabricCanvasRef.current,
        addShape: (type) => {
            if (!fabricCanvasRef.current) return;
            let obj: fabric.Object;
            const center = fabricCanvasRef.current.getCenter();
            const common = { left: center.left, top: center.top, originX: 'center', originY: 'center', fill: '#3b82f6' };

            switch (type) {
                case 'rect':
                    obj = new fabric.Rect({ ...common, width: 100, height: 100 });
                    break;
                case 'circle':
                    obj = new fabric.Circle({ ...common, radius: 50, fill: '#ef4444' });
                    break;
                case 'triangle':
                    obj = new fabric.Triangle({ ...common, width: 100, height: 100, fill: '#10b981' });
                    break;
                case 'polygon': // Star for now
                    // Simple Star points
                    const points = [
                        { x: 0, y: -50 }, { x: 14, y: -20 }, { x: 47, y: -15 }, { x: 23, y: 7 },
                        { x: 29, y: 40 }, { x: 0, y: 25 }, { x: -29, y: 40 }, { x: -23, y: 7 },
                        { x: -47, y: -15 }, { x: -14, y: -20 }
                    ].map(p => ({ x: p.x + 50, y: p.y + 50 })); // Offset
                    obj = new fabric.Polygon(points, { ...common, fill: '#f59e0b', scaleX: 1, scaleY: 1 });
                    break;
                default: return;
            }
            fabricCanvasRef.current.add(obj);
            fabricCanvasRef.current.setActiveObject(obj);
        },
        addText: (type) => {
            if (!fabricCanvasRef.current) return;
            const center = fabricCanvasRef.current.getCenter();
            const textMap = {
                heading: { text: 'Heading', size: 40, weight: 'bold' },
                subheading: { text: 'Subheading', size: 24, weight: '600' },
                body: { text: 'Body Text', size: 16, weight: 'normal' },
            };
            const config = textMap[type];
            const text = new fabric.IText(config.text, {
                left: center.left,
                top: center.top,
                originX: 'center',
                originY: 'center',
                fontFamily: 'Inter',
                fontSize: config.size,
                fontWeight: config.weight,
                fill: '#000000',
            });
            fabricCanvasRef.current.add(text);
            fabricCanvasRef.current.setActiveObject(text);
        },
        addIcon: (svgString) => {
            if (!fabricCanvasRef.current) return;
            fabric.loadSVGFromString(svgString, (objects, options) => {
                const obj = fabric.util.groupSVGElements(objects, options);
                obj.set({
                    left: fabricCanvasRef.current!.getWidth() / 2,
                    top: fabricCanvasRef.current!.getHeight() / 2,
                    originX: 'center',
                    originY: 'center',
                });
                obj.scaleToWidth(100);
                fabricCanvasRef.current!.add(obj);
                fabricCanvasRef.current!.setActiveObject(obj);
                fabricCanvasRef.current!.renderAll();
            });
        },
        updateProperty: (key, value) => {
            const active = fabricCanvasRef.current?.getActiveObject();
            if (active) {
                // Handle special cases
                if (key === 'fill' && active.type === 'group') {
                    // For groups (icons), we might want to update all paths? 
                    // Or just set fill on group? Group fill acts as overlay sometimes.
                    // Recursive update for SVG groups:
                    (active as fabric.Group).getObjects().forEach(obj => obj.set('fill', value));
                } else {
                    active.set(key as any, value);
                }

                // If direct property set didn't work for group, try setting it on the group itself too
                if (active.type === 'group' && key === 'fill') {
                    // active.set('fill', value); // Usually not needed if children updated
                }

                fabricCanvasRef.current?.requestRenderAll();
                onSelectionChange(active); // Trigger update
            }
        },
        deleteSelected: () => {
            const active = fabricCanvasRef.current?.getActiveObject();
            if (active) {
                fabricCanvasRef.current?.remove(active);
                fabricCanvasRef.current?.discardActiveObject();
                onSelectionChange(null);
            }
        },
        duplicateSelected: () => {
            const active = fabricCanvasRef.current?.getActiveObject();
            if (active) {
                active.clone((cloned: fabric.Object) => {
                    fabricCanvasRef.current?.discardActiveObject();
                    cloned.set({
                        left: cloned.left! + 20,
                        top: cloned.top! + 20,
                        evented: true,
                    });
                    if (cloned.type === 'activeSelection') {
                        // active selection needs a canvas to render correctly
                        const selection = cloned as fabric.ActiveSelection;
                        selection.canvas = fabricCanvasRef.current!;
                        selection.forEachObject((obj: fabric.Object) => {
                            fabricCanvasRef.current?.add(obj);
                        });
                        selection.setCoords();
                    } else {
                        fabricCanvasRef.current?.add(cloned);
                    }
                    fabricCanvasRef.current?.setActiveObject(cloned);
                    fabricCanvasRef.current?.requestRenderAll();
                    onSelectionChange(cloned);
                });
            }
        },
        reorderSelected: (action) => {
            const active = fabricCanvasRef.current?.getActiveObject();
            if (!active) return;
            switch (action) {
                case 'front': active.bringToFront(); break;
                case 'back': active.sendToBack(); break;
                case 'forward': active.bringForward(); break;
                case 'backward': active.sendBackwards(); break;
            }
            fabricCanvasRef.current?.requestRenderAll();
        },
        alignSelected: (action) => {
            const active = fabricCanvasRef.current?.getActiveObject();
            if (!active || !fabricCanvasRef.current) return;
            const canvasW = fabricCanvasRef.current.getWidth();
            const canvasH = fabricCanvasRef.current.getHeight();

            switch (action) {
                case 'left':
                    // @ts-ignore - originX and width type safety
                    active.set({ left: 0 + (active.width! * active.scaleX! / 2) });
                    break;
                case 'center': active.centerH(); break;
                case 'right':
                    // @ts-ignore
                    active.set({ left: canvasW - (active.width! * active.scaleX! / 2) });
                    break;
                case 'top':
                    // @ts-ignore
                    active.set({ top: 0 + (active.height! * active.scaleY! / 2) });
                    break;
                case 'middle': active.centerV(); break;
                case 'bottom':
                    // @ts-ignore
                    active.set({ top: canvasH - (active.height! * active.scaleY! / 2) });
                    break;
            }

            active.setCoords();
            fabricCanvasRef.current.requestRenderAll();
        },
        exportSVG: () => {
            const svg = fabricCanvasRef.current?.toSVG();
            if (svg) {
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = 'logo-export.svg';
                link.href = url;
                link.click();
            }
        },
        exportPNG: () => {
            const url = fabricCanvasRef.current?.toDataURL({ format: 'png', multiplier: 3 });
            if (url) {
                const link = document.createElement('a');
                link.download = 'logo-export.png';
                link.href = url;
                link.click();
            }
        }
    }));

    useEffect(() => {
        if (!canvasRef.current || fabricCanvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 600,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true,
        });

        fabricCanvasRef.current = canvas;

        // Grid Lines (Visual)
        // ... (Optional: Draw grid)

        // Event Listeners
        const updateSelection = () => {
            onSelectionChange(canvas.getActiveObject());
        };

        // Snap to Grid Logic
        const gridSize = 20;
        canvas.on('object:moving', (options) => {
            if (options.target) {
                options.target.set({
                    left: Math.round(options.target.left! / gridSize) * gridSize,
                    top: Math.round(options.target.top! / gridSize) * gridSize
                });
            }
        });

        canvas.on('selection:created', updateSelection);
        canvas.on('selection:updated', updateSelection);
        canvas.on('selection:cleared', () => onSelectionChange(null));

        return () => {
            canvas.dispose();
            fabricCanvasRef.current = null;
        };
    }, [onSelectionChange]);

    return (
        <div className="flex-1 bg-surface/30 rounded-3xl border border-border flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
            <div className="shadow-2xl">
                <canvas ref={canvasRef} />
            </div>

            <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono border border-white/10 text-text-muted pointer-events-none">
                800 x 600
            </div>
        </div>
    );
});
