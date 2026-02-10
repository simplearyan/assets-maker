import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric';

interface LogoCanvasProps {
    onSelectionChange: (obj: fabric.Object | null) => void;
    snapToGrid?: boolean;
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
    toggleEdit: () => void;
    exportSVG: () => void;
    exportPNG: () => void;
    canvas: fabric.Canvas | null;
}

export const LogoCanvas = forwardRef<LogoCanvasRef, LogoCanvasProps>(({ onSelectionChange, snapToGrid = true }, ref) => {
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
                    // Recursive update for SVG groups:
                    (active as fabric.Group).getObjects().forEach(obj => obj.set('fill', value));
                } else {
                    active.set(key as any, value);
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
        toggleEdit: () => {
            const canvas = fabricCanvasRef.current;
            const active = canvas?.getActiveObject();
            if (!canvas || !active) return;

            // Only support Polygon for this POC
            if (active.type !== 'polygon') {
                alert("Point editing is currently only supported for Polygon shapes (Star, Triangle).");
                return;
            }

            const poly = active as fabric.Polygon;
            canvas.setActiveObject(poly);

            // If already editing, finish
            // @ts-ignore custom property
            if (poly.__editing) {
                // @ts-ignore
                poly.__editing = false;
                // Remove controls
                const controls = canvas.getObjects().filter(o => (o as any).id === 'poly-control');
                canvas.remove(...controls);
                return;
            }

            // Start editing
            // @ts-ignore
            poly.__editing = true;
            poly.selectable = false; // Disable moving the whole shape while editing points

            const points = poly.points!;
            // Calculate absolute positions
            const matrix = poly.calcTransformMatrix();
            const transformPoint = (p: { x: number, y: number }) => {
                return fabric.util.transformPoint(new fabric.Point(p.x - poly.pathOffset.x, p.y - poly.pathOffset.y), matrix);
            };

            points.forEach((point, index) => {
                const absPoint = transformPoint(point);
                const control = new fabric.Circle({
                    left: absPoint.x,
                    top: absPoint.y,
                    radius: 5,
                    fill: '#f43f5e',
                    originX: 'center',
                    originY: 'center',
                    hasControls: false,
                    hasBorders: false,
                    // @ts-ignore
                    id: 'poly-control',
                    pointIndex: index,
                    // @ts-ignore
                    parentPoly: poly
                });

                control.on('moving', (opt) => {
                    const p = opt.target as fabric.Circle;
                    // Placeholder for actual polygon point update logic
                    console.log("Moving point", (p as any).pointIndex);
                });

                canvas.add(control);
            });
            canvas.requestRenderAll();
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
            if (!fabricCanvasRef.current) return;
            const canvas = fabricCanvasRef.current;

            // Ensure viewport is reset for export to capture full canvas
            const originalViewport = canvas.viewportTransform;
            canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

            const svg = canvas.toSVG({
                suppressPreamble: true,
                width: 800,
                height: 600,
                viewBox: {
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 600
                } as any // fabric types might be slightly off here
            });

            // Restore viewport
            canvas.viewportTransform = originalViewport!;

            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'logo-export.svg';
            link.href = url;
            link.click();
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

        // Visual Grid
        const gridSize = 20;
        const gridColor = '#e5e7eb'; // light gray
        // Create grid lines
        const gridGroup = new fabric.Group([], {
            selectable: false,
            evented: false,
            excludeFromExport: true
        });

        for (let i = 0; i < (canvas.width! / gridSize); i++) {
            gridGroup.addWithUpdate(new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height!], {
                stroke: gridColor,
                strokeWidth: 1,
                selectable: false
            }));
        }
        for (let i = 0; i < (canvas.height! / gridSize); i++) {
            gridGroup.addWithUpdate(new fabric.Line([0, i * gridSize, canvas.width!, i * gridSize], {
                stroke: gridColor,
                strokeWidth: 1,
                selectable: false
            }));
        }
        canvas.add(gridGroup);
        canvas.sendToBack(gridGroup);

        // Smart Guides Lines
        const verticalLine = new fabric.Line([canvas.width! / 2, 0, canvas.width! / 2, canvas.height!], {
            stroke: '#f43f5e', // rose-500
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: 0,
            strokeDashArray: [4, 4]
        });
        const horizontalLine = new fabric.Line([0, canvas.height! / 2, canvas.width!, canvas.height! / 2], {
            stroke: '#f43f5e',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: 0,
            strokeDashArray: [4, 4]
        });

        canvas.add(verticalLine);
        canvas.add(horizontalLine);

        // Event Listeners
        const updateSelection = () => {
            onSelectionChange(canvas.getActiveObject());
        };

        // Snap to Grid & Smart Guides Logic
        canvas.on('object:moving', (options) => {
            const target = options.target;
            if (!target) return;

            const centerX = canvas.width! / 2;
            const centerY = canvas.height! / 2;
            const targetCenterX = target.left! + (target.width! * target.scaleX! / 2);
            const targetCenterY = target.top! + (target.height! * target.scaleY! / 2);

            const snapDist = 10; // Distance to snap to center

            // Snap to Grid (Conditional)
            if (snapToGrid) {
                target.set({
                    left: Math.round(target.left! / gridSize) * gridSize,
                    top: Math.round(target.top! / gridSize) * gridSize
                });

                // Smart Guide: Vertical Center
                if (Math.abs(targetCenterX - centerX) < snapDist) {
                    target.set({ left: centerX - (target.width! * target.scaleX! / 2) });
                    verticalLine.set('opacity', 1);
                    verticalLine.bringToFront();
                } else {
                    verticalLine.set('opacity', 0);
                }

                // Smart Guide: Horizontal Center
                if (Math.abs(targetCenterY - centerY) < snapDist) {
                    target.set({ top: centerY - (target.height! * target.scaleY! / 2) });
                    horizontalLine.set('opacity', 1);
                    horizontalLine.bringToFront();
                } else {
                    horizontalLine.set('opacity', 0);
                }
            } else {
                verticalLine.set('opacity', 0);
                horizontalLine.set('opacity', 0);
            }
        });

        canvas.on('mouse:up', () => {
            verticalLine.set('opacity', 0);
            horizontalLine.set('opacity', 0);
            canvas.requestRenderAll();
        });

        canvas.on('selection:created', updateSelection);
        canvas.on('selection:updated', updateSelection);
        canvas.on('selection:cleared', () => onSelectionChange(null));

        return () => {
            canvas.off('object:moving');
            canvas.dispose();
            fabricCanvasRef.current = null;
        };
    }, [onSelectionChange, snapToGrid]); // Re-run effect when snapToGrid changes

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
