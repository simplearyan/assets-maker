import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Transformer } from 'react-konva';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Square, Circle as CircleIcon, Type, MousePointer2, Download, Trash2, Undo2, Redo2, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import Konva from 'konva';

type Tool = 'select' | 'rect' | 'circle' | 'text';

interface LogoElement {
    id: string;
    type: Tool;
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    fill: string;
    text?: string;
    fontSize?: number;
}

export function LogoStudio() {
    const [elements, setElements] = useState<LogoElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<Tool>('select');

    const stageRef = useRef<Konva.Stage>(null);

    const addElement = (type: Tool) => {
        const id = crypto.randomUUID();
        const newElement: LogoElement = {
            id,
            type,
            x: 150,
            y: 150,
            fill: type === 'text' ? '#000000' : '#3b82f6',
        };

        if (type === 'rect') {
            newElement.width = 100;
            newElement.height = 100;
        } else if (type === 'circle') {
            newElement.radius = 50;
        } else if (type === 'text') {
            newElement.text = 'Logo Text';
            newElement.fontSize = 24;
        }

        setElements([...elements, newElement]);
        setSelectedId(id);
        setActiveTool('select');
    };

    const handleExport = () => {
        const uri = stageRef.current?.toDataURL();
        if (uri) {
            const link = document.createElement('a');
            link.download = 'logo.png';
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDelete = () => {
        if (selectedId) {
            setElements(elements.filter(el => el.id !== selectedId));
            setSelectedId(null);
        }
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
                <ToolButton
                    icon={Square}
                    onClick={() => addElement('rect')}
                    label="Rectangle"
                />
                <ToolButton
                    icon={CircleIcon}
                    onClick={() => addElement('circle')}
                    label="Circle"
                />
                <ToolButton
                    icon={Type}
                    onClick={() => addElement('text')}
                    label="Text"
                />
                <div className="mt-auto flex flex-col gap-4">
                    <ToolButton icon={Undo2} onClick={() => { }} label="Undo" />
                    <ToolButton icon={Redo2} onClick={() => { }} label="Redo" />
                </div>
            </GlassCard>

            {/* Canvas Area */}
            <div className="flex-1 bg-surface/30 rounded-3xl border border-border flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <Stage
                    width={800}
                    height={600}
                    className="bg-white shadow-2xl"
                    onMouseDown={(e) => {
                        const clickedOnEmpty = e.target === e.target.getStage();
                        if (clickedOnEmpty) {
                            setSelectedId(null);
                        }
                    }}
                    ref={stageRef}
                >
                    <Layer>
                        {elements.map((el) => (
                            <CanvasElement
                                key={el.id}
                                element={el}
                                isSelected={el.id === selectedId}
                                onSelect={() => setSelectedId(el.id)}
                                onChange={(newAttrs: Partial<LogoElement>) => {
                                    const newElements = elements.slice();
                                    const index = newElements.findIndex(e => e.id === el.id);
                                    newElements[index] = { ...newElements[index], ...newAttrs };
                                    setElements(newElements);
                                }}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>

            {/* Properties Panel */}
            <GlassCard className="w-72 flex flex-col gap-6">
                <h3 className="font-bold text-lg">Properties</h3>
                {selectedId ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-text-muted">Color</label>
                            <div className="flex gap-2 mt-2">
                                {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#ffffff', '#000000'].map(color => (
                                    <button
                                        key={color}
                                        className="w-8 h-8 rounded-full border border-white/10 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            const newElements = elements.map(el =>
                                                el.id === selectedId ? { ...el, fill: color } : el
                                            );
                                            setElements(newElements);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={handleDelete}>
                            <Trash2 size={16} /> Delete Element
                        </Button>
                    </div>
                ) : (
                    <p className="text-text-muted text-sm">Select an element to edit properties.</p>
                )}

                <div className="mt-auto">
                    <Button className="w-full" onClick={handleExport}>
                        <Download size={18} /> Export Logo
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

interface CanvasElementProps {
    element: LogoElement;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (attrs: Partial<LogoElement>) => void;
}

const CanvasElement = ({ element, isSelected, onSelect, onChange }: CanvasElementProps) => {
    const shapeRef = useRef<Konva.Shape>(null);
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            const nodes = [shapeRef.current];
            trRef.current.nodes(nodes);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    const props = {
        onClick: onSelect,
        onTap: onSelect,
        ref: shapeRef as any,
        ...element,
        draggable: true,
        onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
            onChange({
                x: e.target.x(),
                y: e.target.y(),
            });
        },
        onTransformEnd: () => {
            const node = shapeRef.current;
            if (node) {
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.scaleX(1);
                node.scaleY(1);

                const newAttrs: Partial<LogoElement> = {
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(5, node.width() * scaleX),
                    height: Math.max(5, node.height() * scaleY),
                };

                // @ts-expect-error - Konva Node types don't have radius by default, but we know it does for Circle
                if (node.radius) {
                    // @ts-expect-error
                    newAttrs.radius = Math.max(5, node.radius() * scaleX);
                }

                onChange(newAttrs);
            }
        }
    };

    return (
        <>
            {element.type === 'rect' && <Rect {...props} />}
            {element.type === 'circle' && <Circle {...props} />}
            {element.type === 'text' && <Text {...props} />}
            {isSelected && (
                <Transformer
                    ref={trRef}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </>
    );
};
