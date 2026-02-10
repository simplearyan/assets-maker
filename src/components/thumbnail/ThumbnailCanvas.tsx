import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Transformer, Group } from 'react-konva';
import useImage from 'use-image';
import type { ThumbnailElement } from '../../types/thumbnail';
import Konva from 'konva';

interface ThumbnailCanvasProps {
    elements: ThumbnailElement[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onChange: (id: string, attrs: Partial<ThumbnailElement>) => void;
    background: string;
    zoom: number;
    canvasWidth: number;
    canvasHeight: number;
    isTransparent: boolean;
    clipContent?: boolean;
}

const URLImage = ({ src, ...props }: any) => {
    const [image] = useImage(src);
    return <KonvaImage image={image} {...props} />;
};

export const ThumbnailCanvas = forwardRef<any, ThumbnailCanvasProps>(({
    elements, selectedId, onSelect, onChange, background, zoom,
    canvasWidth = 1280, canvasHeight = 720, isTransparent = false, clipContent = false
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const stageInternalRef = useRef<Konva.Stage>(null);
    const [scale, setScale] = useState(1);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Center Offset calculation
    const offsetX = (dimensions.width - canvasWidth * scale) / 2;
    const offsetY = (dimensions.height - canvasHeight * scale) / 2;

    // Responsive scaling logic
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                const { width: containerWidth, height: containerHeight } = entry.contentRect;

                // Target aspect ratio
                const targetRatio = canvasWidth / canvasHeight;
                const containerRatio = containerWidth / containerHeight;

                let autoScale = 1;

                if (containerRatio < targetRatio) {
                    // Fit to width
                    autoScale = containerWidth / canvasWidth;
                } else {
                    // Fit to height
                    autoScale = containerHeight / canvasHeight;
                }

                // Add some padding (e.g., 90% of available space)
                // Apply user zoom
                setScale(autoScale * 0.9 * zoom);
                setDimensions({ width: containerWidth, height: containerHeight });
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, [zoom, canvasWidth, canvasHeight]);

    useImperativeHandle(ref, () => ({
        toDataURL: (config: any) => {
            if (!stageInternalRef.current) return '';

            return stageInternalRef.current.toDataURL({
                ...config,
                x: offsetX,
                y: offsetY,
                width: canvasWidth * scale,
                height: canvasHeight * scale,
            });
        },
        getStage: () => stageInternalRef.current
    }));

    const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        // The stage is the empty space, but we also want to deselect if we click the background rects
        const target = e.target;
        const isStage = target === target.getStage();
        const isBackground = target.name() === 'canvas-background';

        if (isStage || isBackground) {
            onSelect(null);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
            <Stage
                ref={stageInternalRef}
                width={dimensions.width}
                height={dimensions.height}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
            >
                <Layer>
                    {/* Workspace background - helps visualize clipping area */}
                    <Rect
                        x={0}
                        y={0}
                        width={dimensions.width}
                        height={dimensions.height}
                        fill={isTransparent ? 'transparent' : 'rgba(0,0,0,0.05)'}
                        listening={false}
                    />

                    {/* Centered Workspace Group */}
                    <Group x={offsetX} y={offsetY} scaleX={scale} scaleY={scale}>
                        {/* Canvas Shadow & Border */}
                        <Rect
                            x={-5 / scale}
                            y={-5 / scale}
                            width={canvasWidth + 10 / scale}
                            height={canvasHeight + 10 / scale}
                            fill="rgba(0,0,0,0.1)"
                            cornerRadius={4 / scale}
                        />

                        {/* Content Group - Clipped if requested */}
                        <Group clip={clipContent ? { x: 0, y: 0, width: canvasWidth, height: canvasHeight } : undefined}>

                            {/* Exportable Area Background */}
                            <Rect
                                name="canvas-background"
                                x={0}
                                y={0}
                                width={canvasWidth}
                                height={canvasHeight}
                                fill={isTransparent ? 'transparent' : background}
                                shadowColor="black"
                                shadowBlur={20}
                                shadowOpacity={0.2}
                                // Checkerboard for transparency
                                {...(isTransparent ? {
                                    fillPriority: 'pattern',
                                    fillPatternImage: (() => {
                                        const canvas = document.createElement('canvas');
                                        canvas.width = 20;
                                        canvas.height = 20;
                                        const ctx = canvas.getContext('2d');
                                        if (ctx) {
                                            ctx.fillStyle = '#333';
                                            ctx.fillRect(0, 0, 10, 10);
                                            ctx.fillRect(10, 10, 10, 10);
                                            ctx.fillStyle = '#444';
                                            ctx.fillRect(10, 0, 10, 10);
                                            ctx.fillRect(0, 10, 10, 10);
                                        }
                                        return canvas;
                                    })(),
                                } as any : {})}
                            />

                            {elements.map((el) => {
                                const commonProps = {
                                    id: el.id,
                                    x: el.x,
                                    y: el.y,
                                    rotation: el.rotation,
                                    width: el.width,
                                    height: el.height,
                                    scaleX: el.scaleX,
                                    scaleY: el.scaleY,
                                    opacity: el.opacity,
                                    draggable: true,
                                    onClick: () => onSelect(el.id),
                                    onTap: () => onSelect(el.id),
                                    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
                                        onChange(el.id, {
                                            x: e.target.x(),
                                            y: e.target.y(),
                                        });
                                    },
                                    onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
                                        const node = e.target;
                                        onChange(el.id, {
                                            x: node.x(),
                                            y: node.y(),
                                            rotation: node.rotation(),
                                            scaleX: node.scaleX(),
                                            scaleY: node.scaleY(),
                                        });
                                    }
                                };

                                if (el.type === 'rect') {
                                    return <Rect key={el.id} {...commonProps} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
                                } else if (el.type === 'circle') {
                                    return <Circle key={el.id} {...commonProps} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} radius={(el.width || 50) / 2} />;
                                } else if (el.type === 'text') {
                                    return (
                                        <Text
                                            key={el.id}
                                            {...commonProps}
                                            text={el.text}
                                            fontSize={el.fontSize}
                                            fill={el.fill}
                                            fontFamily={el.fontFamily}
                                            fontStyle={el.fontWeight}
                                        />
                                    );
                                } else if (el.type === 'image' && el.src) {
                                    return <URLImage key={el.id} {...commonProps} src={el.src} />;
                                }
                                return null;
                                return null;
                            })}
                        </Group>

                        <TransformerComponent selectedId={selectedId} />
                    </Group>
                </Layer>
            </Stage>
        </div>
    );
});

const TransformerComponent = ({ selectedId }: { selectedId: string | null }) => {
    const trRef = useRef<Konva.Transformer>(null);
    const layer = trRef.current?.getLayer();

    useEffect(() => {
        if (selectedId) {
            const node = layer?.findOne('#' + selectedId);
            if (node) {
                trRef.current?.nodes([node]);
                trRef.current?.getLayer()?.batchDraw();
            }
        } else {
            trRef.current?.nodes([]);
        }
    }, [selectedId, layer]);

    return (
        <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                }
                return newBox;
            }}
        />
    );
};
