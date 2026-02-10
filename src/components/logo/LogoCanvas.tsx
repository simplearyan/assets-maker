import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { fabric } from 'fabric';
import { Settings, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface LogoCanvasProps {
    onSelectionChange: (obj: fabric.Object | null) => void;
    snapToGrid?: boolean;
    canvasBg?: string;
    isTransparent?: boolean;
    canvasWidth?: number;
    canvasHeight?: number;
}

export interface LogoCanvasRef {
    addShape: (type: 'rect' | 'circle' | 'triangle' | 'polygon') => void;
    addText: (type: 'heading' | 'subheading' | 'body') => void;
    addIcon: (svgString: string) => void;
    addImage: (url: string) => void;
    updateProperty: (key: string, value: any) => void;
    deleteSelected: () => void;
    duplicateSelected: () => void;
    reorderSelected: (action: 'front' | 'back' | 'forward' | 'backward') => void;
    alignSelected: (action: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
    toggleEdit: () => void;
    exportSVG: () => void;
    exportPNG: () => void;
    setZoom: (zoom: number) => void;
    setBackgroundColor: (color: string) => void;
    setTransparency: (isTransparent: boolean) => void;
    setDimensions: (width: number, height: number) => void;
    canvas: fabric.Canvas | null;
}

export const LogoCanvas = forwardRef<LogoCanvasRef, LogoCanvasProps>(({
    onSelectionChange,
    snapToGrid = true,
    canvasBg = '#ffffff',
    isTransparent = false,
    canvasWidth = 800,
    canvasHeight = 600
}, ref) => {
    const gridSize = 20;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const snapToGridRef = useRef(snapToGrid);
    const gridGroupRef = useRef<fabric.Group | null>(null);
    const verticalLineRef = useRef<fabric.Line | null>(null);
    const horizontalLineRef = useRef<fabric.Line | null>(null);

    const [zoom, setZoomState] = useState(1);

    // Update refs when props change
    useEffect(() => {
        snapToGridRef.current = snapToGrid;
    }, [snapToGrid]);

    // Reactively update Fabric when props change
    useEffect(() => {
        if (!fabricCanvasRef.current) return;
        const canvas = fabricCanvasRef.current;

        // Update Canvas Settings
        canvas.setDimensions({ width: canvasWidth, height: canvasHeight });
        canvas.setBackgroundColor(isTransparent ? 'transparent' : canvasBg, canvas.renderAll.bind(canvas));

        // Update Grid
        if (gridGroupRef.current) canvas.remove(gridGroupRef.current);
        const gridSize = 20;
        const gridColor = '#e5e7eb';
        const gridGroup = new fabric.Group([], {
            selectable: false,
            evented: false,
            excludeFromExport: true
        });

        for (let i = 0; i <= (canvasWidth / gridSize); i++) {
            gridGroup.addWithUpdate(new fabric.Line([i * gridSize, 0, i * gridSize, canvasHeight], {
                stroke: gridColor, strokeWidth: 1, selectable: false
            }));
        }
        for (let i = 0; i <= (canvasHeight / gridSize); i++) {
            gridGroup.addWithUpdate(new fabric.Line([0, i * gridSize, canvasWidth, i * gridSize], {
                stroke: gridColor, strokeWidth: 1, selectable: false
            }));
        }
        canvas.add(gridGroup);
        canvas.sendToBack(gridGroup);
        gridGroupRef.current = gridGroup;

        // Update Smart Guides
        if (verticalLineRef.current) {
            verticalLineRef.current.set({ x1: canvasWidth / 2, x2: canvasWidth / 2, y2: canvasHeight });
        }
        if (horizontalLineRef.current) {
            horizontalLineRef.current.set({ y1: canvasHeight / 2, y2: canvasHeight / 2, x2: canvasWidth });
        }

        canvas.renderAll();
    }, [canvasBg, isTransparent, canvasWidth, canvasHeight]);

    useImperativeHandle(ref, () => ({
        canvas: fabricCanvasRef.current,
        setZoom: (value) => {
            const newZoom = Math.max(0.1, Math.min(2.0, value));
            setZoomState(newZoom);
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.setZoom(newZoom);
            }
        },
        // These are now mostly handled by Props + useEffect, 
        // but we keep them for compatibility or imperative calls
        setBackgroundColor: (color) => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.setBackgroundColor(color, fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current));
            }
        },
        setTransparency: (transparent) => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.setBackgroundColor(transparent ? 'transparent' : canvasBg, fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current));
            }
        },
        setDimensions: (w, h) => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.setDimensions({ width: w, height: h });
                fabricCanvasRef.current.renderAll();
            }
        },
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
        addImage: (url: string) => {
            if (!fabricCanvasRef.current) return;
            fabric.Image.fromURL(url, (img) => {
                if (!img) return;
                img.set({
                    left: fabricCanvasRef.current!.getWidth() / 2,
                    top: fabricCanvasRef.current!.getHeight() / 2,
                    originX: 'center',
                    originY: 'center',
                });
                // Scale down if too big
                if (img.width! > 400) {
                    img.scaleToWidth(400);
                }
                fabricCanvasRef.current!.add(img);
                fabricCanvasRef.current!.setActiveObject(img);
                fabricCanvasRef.current!.renderAll();
                onSelectionChange(img);
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

                control.on('moving', () => {
                    const p = control;
                    const index = (p as any).pointIndex;
                    const parent = (p as any).parentPoly as fabric.Polygon;

                    // Convert absolute control position back to local polygon space
                    const invertedMatrix = fabric.util.invertTransform(parent.calcTransformMatrix());
                    const localPoint = fabric.util.transformPoint(new fabric.Point(p.left!, p.top!), invertedMatrix);

                    // Factor in the pathOffset (which Fabric uses internally for polygons)
                    parent.points![index] = new fabric.Point(
                        localPoint.x + parent.pathOffset.x,
                        localPoint.y + parent.pathOffset.y
                    );

                    parent.setCoords();
                    canvas.requestRenderAll();
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
            const originalViewport = canvas.viewportTransform;
            canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

            const svg = canvas.toSVG({
                suppressPreamble: true,
                width: canvasWidth,
                height: canvasHeight,
                viewBox: {
                    x: 0,
                    y: 0,
                    width: canvasWidth,
                    height: canvasHeight
                } as any
            });

            canvas.viewportTransform = originalViewport!;
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `logo-${canvasWidth}x${canvasHeight}.svg`;
            link.href = url;
            link.click();
        },
        exportPNG: () => {
            const url = fabricCanvasRef.current?.toDataURL({
                format: 'png',
                multiplier: 4 // Standard hi-res
            });
            if (url) {
                const link = document.createElement('a');
                link.download = `logo-${canvasWidth}x${canvasHeight}.png`;
                link.href = url;
                link.click();
            }
        }
    }));

    useEffect(() => {
        if (!canvasRef.current || fabricCanvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: isTransparent ? 'transparent' : canvasBg,
            preserveObjectStacking: true,
        });

        fabricCanvasRef.current = canvas;

        fabricCanvasRef.current = canvas;

        // Initialize Smart Guides
        const verticalLine = new fabric.Line([canvasWidth / 2, 0, canvasWidth / 2, canvasHeight], {
            stroke: '#f43f5e',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: 0,
            strokeDashArray: [4, 4]
        });
        const horizontalLine = new fabric.Line([0, canvasHeight / 2, canvasWidth, canvasHeight / 2], {
            stroke: '#f43f5e',
            strokeWidth: 1,
            selectable: false,
            evented: false,
            opacity: 0,
            strokeDashArray: [4, 4]
        });

        canvas.add(verticalLine, horizontalLine);
        verticalLineRef.current = verticalLine;
        horizontalLineRef.current = horizontalLine;

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

            // Checks ref current value
            if (snapToGridRef.current) {
                // Initial snap to grid
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
    }, []); // Empty deps to initialize once

    return (
        <div className={`flex-1 rounded-3xl border border-border flex items-center justify-center overflow-hidden relative ${isTransparent ? 'bg-white/5' : 'bg-surface/30'}`}>
            {isTransparent && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 20%, transparent 20%), radial-gradient(#000 20%, transparent 20%)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }} />
            )}
            {!isTransparent && (
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
            )}

            <div className="shadow-2xl transition-transform duration-200 ease-out origin-center" style={{ transform: `scale(${zoom})` }}>
                <canvas ref={canvasRef} />
            </div>

            <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-auto">
                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-surface/80 backdrop-blur p-1 rounded-full border border-white/10 shadow-lg">
                    <button
                        onClick={() => {
                            const newZoom = Math.max(0.1, zoom - 0.1);
                            setZoomState(newZoom);
                            fabricCanvasRef.current?.setZoom(newZoom);
                        }}
                        className="p-1 hover:bg-white/10 rounded-full text-text-muted hover:text-text-main transition-colors"
                        title="Zoom Out"
                    >
                        <ZoomOut size={14} />
                    </button>
                    <span className="text-[10px] font-mono w-10 text-center text-text-muted select-none">
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        onClick={() => {
                            const newZoom = Math.min(2.0, zoom + 0.1);
                            setZoomState(newZoom);
                            fabricCanvasRef.current?.setZoom(newZoom);
                        }}
                        className="p-1 hover:bg-white/10 rounded-full text-text-muted hover:text-text-main transition-colors"
                        title="Zoom In"
                    >
                        <ZoomIn size={14} />
                    </button>
                    <button
                        onClick={() => {
                            setZoomState(1);
                            fabricCanvasRef.current?.setZoom(1);
                        }}
                        className="p-1 hover:bg-white/10 rounded-full text-text-muted hover:text-text-main transition-colors border-l border-white/10 ml-1 pl-2"
                        title="Reset Zoom"
                    >
                        <Maximize2 size={14} />
                    </button>
                </div>

                <div className="bg-surface/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-mono border border-white/10 text-text-muted select-none shadow-lg">
                    {canvasWidth} x {canvasHeight}
                </div>

                <button
                    onClick={() => {
                        fabricCanvasRef.current?.discardActiveObject();
                        fabricCanvasRef.current?.renderAll();
                        onSelectionChange(null);
                    }}
                    className="p-2 bg-surface/80 backdrop-blur rounded-full border border-white/10 text-text-muted hover:text-text-main hover:bg-white/10 transition-colors shadow-lg"
                    title="Canvas Settings"
                >
                    <Settings size={14} />
                </button>
            </div>
        </div>
    );
});
