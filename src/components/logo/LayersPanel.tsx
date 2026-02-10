import { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { Eye, EyeOff, Lock, Unlock, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface LayersPanelProps {
    canvas: fabric.Canvas | null;
    selectedObject: fabric.Object | null;
    onSelect: (obj: fabric.Object) => void;
    onUpdate: () => void; // Trigger for parent to refresh (if needed)
}

export function LayersPanel({ canvas, selectedObject, onSelect, onUpdate }: LayersPanelProps) {
    const [layers, setLayers] = useState<fabric.Object[]>([]);
    const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

    // Sync layers with canvas
    useEffect(() => {
        if (!canvas) return;

        const updateLayers = () => {
            // Fabric stores objects bottom-to-top (0 is bottom)
            // We want to display top-to-bottom (0 is top)
            setLayers([...canvas.getObjects()].reverse());
        };

        updateLayers();

        canvas.on('object:added', updateLayers);
        canvas.on('object:removed', updateLayers);
        canvas.on('object:modified', updateLayers);
        // 'order:changed' isn't a standard event, but we might manually trigger updates

        return () => {
            canvas.off('object:added', updateLayers);
            canvas.off('object:removed', updateLayers);
            canvas.off('object:modified', updateLayers);
        };
    }, [canvas, selectedObject]); // Re-run when selection changes to highlight correct layer

    if (!canvas) return null;

    const toggleVisibility = (obj: fabric.Object, e: React.MouseEvent) => {
        e.stopPropagation();
        obj.visible = !obj.visible;
        if (!obj.visible) {
            canvas.discardActiveObject();
        }
        canvas.requestRenderAll();
        // Force update local state
        setLayers([...canvas.getObjects()].reverse());
    };

    const toggleLock = (obj: fabric.Object, e: React.MouseEvent) => {
        e.stopPropagation();
        const isLocked = !!obj.lockMovementX;

        obj.set({
            lockMovementX: !isLocked,
            lockMovementY: !isLocked,
            lockRotation: !isLocked,
            lockScalingX: !isLocked,
            lockScalingY: !isLocked,
            selectable: isLocked // If locked, not selectable (or keep selectable but immutable?)
            // Usually locked layers are still selectable in layer panel, but not on canvas.
            // Fabric doesn't strictly support "selectable via code but not mouse" easily without overrides.
            // Let's keep it selectable but locked movement.
        });

        canvas.requestRenderAll();
        setLayers([...canvas.getObjects()].reverse());
    };

    const deleteLayer = (obj: fabric.Object, e: React.MouseEvent) => {
        e.stopPropagation();
        canvas.remove(obj);
        canvas.requestRenderAll();
        onUpdate();
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIdx(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, _index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIdx === null || draggedIdx === dropIndex || !canvas) return;

        // Calculate new z-index logic
        // UI list is reversed (0 is top), Fabric list is normal (length-1 is top)

        const objects = canvas.getObjects();
        const movedObj = layers[draggedIdx];

        // Move to specific index
        // Since layers list is reversed:
        // dragging from `draggedIdx` to `dropIndex` in UI
        // means moving from `len - 1 - draggedIdx` to `len - 1 - dropIndex` in Fabric

        // Simpler approach: Reconstruct the entire fabric objects array based on new UI order
        const newLayers = [...layers];
        newLayers.splice(draggedIdx, 1);
        newLayers.splice(dropIndex, 0, movedObj);

        // Apply new order to canvas (bottom-up)
        // const bottomUpOrder = [...newLayers].reverse();

        // This is heavy-handed but reliable: remove all and add back in order?
        // Or use moveTo? moveTo is better.

        // Let's iterate and use moveTo for the specific object?
        // Actually, re-sorting the whole stack is safest to match UI exactly.
        // But removing/adding breaks references sometimes.

        // Best fabric way: moveTo(obj, index)
        const targetFabricIndex = objects.length - 1 - dropIndex;
        canvas.moveTo(movedObj, targetFabricIndex);

        setDraggedIdx(null);
        setLayers(newLayers);
        canvas.requestRenderAll();
        onUpdate();
    };

    const getLayerName = (obj: fabric.Object, _idx: number) => {
        if (obj.type === 'i-text' || obj.type === 'text') {
            return (obj as fabric.Text).text?.substring(0, 15) || 'Text Layer';
        }
        if (obj.type === 'image') return 'Image Layer';
        if (obj.type === 'path') return 'Vector Path';
        if (obj.type === 'group') return 'Group';
        return `${obj.type?.charAt(0).toUpperCase()}${obj.type?.slice(1)} Layer`;
    };

    return (
        <div className="flex flex-col h-full bg-surface/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-lg text-text-main">Layers</h3>
                <span className="text-xs text-text-muted">{layers.length} items</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {layers.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50 space-y-2">
                        <Layers size={32} />
                        <span className="text-xs">No layers yet</span>
                    </div>
                ) : (
                    layers.map((obj, idx) => {
                        // Check for multi-selection
                        const isSelected = obj === selectedObject ||
                            (selectedObject?.type === 'activeSelection' && (selectedObject as fabric.ActiveSelection).getObjects().includes(obj));

                        return (
                            <div
                                key={idx} // Use distinct ID if available? Fabric objects don't enforce IDs.
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragOver={(e) => handleDragOver(e, idx)}
                                onDrop={(e) => handleDrop(e, idx)}
                                onClick={(e) => {
                                    if (e.ctrlKey || e.metaKey || e.shiftKey) {
                                        // Multi-selection logic
                                        const activeObject = canvas.getActiveObject();
                                        let newSelection: fabric.Object[] = [];

                                        if (activeObject?.type === 'activeSelection') {
                                            newSelection = [...(activeObject as fabric.ActiveSelection).getObjects()];
                                        } else if (activeObject) {
                                            newSelection = [activeObject];
                                        }

                                        if (newSelection.includes(obj)) {
                                            newSelection = newSelection.filter(o => o !== obj);
                                        } else {
                                            newSelection.push(obj);
                                        }

                                        if (newSelection.length === 0) {
                                            canvas.discardActiveObject();
                                            onSelect(null as any); // Type cast or handle null
                                        } else if (newSelection.length === 1) {
                                            canvas.setActiveObject(newSelection[0]);
                                            onSelect(newSelection[0]);
                                        } else {
                                            const selection = new fabric.ActiveSelection(newSelection, {
                                                canvas: canvas
                                            });
                                            canvas.setActiveObject(selection);
                                            onSelect(selection);
                                        }
                                    } else {
                                        // Single selection
                                        canvas.setActiveObject(obj);
                                        onSelect(obj);
                                    }
                                    canvas.requestRenderAll();
                                }}
                                className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer group ${isSelected
                                    ? 'bg-accent/10 border-accent/30'
                                    : 'bg-white/5 border-transparent hover:border-white/10'
                                    }`}
                            >
                                <div className="cursor-grab text-text-muted hover:text-text-main">
                                    <GripVertical size={14} />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col">
                                    <span className={`text-xs font-medium truncate ${isSelected ? 'text-accent' : 'text-text-main'}`}>
                                        {getLayerName(obj, idx)}
                                    </span>
                                    <span className="text-[9px] text-text-muted uppercase tracking-wider">
                                        {obj.type}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 text-text-muted hover:text-text-main hover:bg-white/10"
                                        onClick={(e) => toggleLock(obj, e)}
                                    >
                                        {obj.lockMovementX ? <Lock size={12} /> : <Unlock size={12} />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 text-text-muted hover:text-text-main hover:bg-white/10"
                                        onClick={(e) => toggleVisibility(obj, e)}
                                    >
                                        {obj.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 text-text-muted hover:text-text-main hover:bg-white/10"
                                        onClick={(e) => deleteLayer(obj, e)}
                                    >
                                        <Trash2 size={12} />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// Helper icon
function Layers({ size }: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </svg>
    );
}
