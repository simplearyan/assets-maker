import { useRef, useEffect, useState, forwardRef } from 'react';
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Transformer } from 'react-konva';
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
}

const URLImage = ({ src, ...props }: any) => {
    const [image] = useImage(src);
    return <KonvaImage image={image} {...props} />;
};

export const ThumbnailCanvas = forwardRef<Konva.Stage, ThumbnailCanvasProps>(({
    elements, selectedId, onSelect, onChange, background, zoom,
    canvasWidth = 1280, canvasHeight = 720, isTransparent = false
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

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
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, [zoom]);

    const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            onSelect(null);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-bg/50 overflow-hidden">
            <div
                className="shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50_rgba(0,0,0,0.5)] transition-shadow duration-500 overflow-hidden"
                style={{
                    width: canvasWidth * scale,
                    height: canvasHeight * scale,
                    backgroundImage: isTransparent ? 'conic-gradient(#333 90deg, #444 90deg 180deg, #333 180deg 270deg, #444 270deg)' : 'none',
                    backgroundSize: '20px 20px'
                }}
            >
                <Stage
                    ref={ref}
                    width={canvasWidth * scale}
                    height={canvasHeight * scale}
                    scaleX={scale}
                    scaleY={scale}
                    onMouseDown={checkDeselect}
                    onTouchStart={checkDeselect}
                >
                    <Layer>
                        {/* Background */}
                        {!isTransparent && (
                            <Rect
                                x={0}
                                y={0}
                                width={canvasWidth}
                                height={canvasHeight}
                                fill={background}
                            />
                        )}

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
                        })}

                        <TransformerComponent selectedId={selectedId} />
                    </Layer>
                </Stage>
            </div>
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
