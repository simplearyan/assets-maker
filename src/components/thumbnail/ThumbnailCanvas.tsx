import { useRef, useEffect, useState } from 'react';
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
}

const URLImage = ({ src, ...props }: any) => {
    const [image] = useImage(src);
    return <KonvaImage image={image} {...props} />;
};

export function ThumbnailCanvas({ elements, selectedId, onSelect, onChange, background }: ThumbnailCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [size, setSize] = useState({ width: 1280, height: 720 }); // Logical size

    // Responsive scaling logic
    useEffect(() => {
        const resize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const containerHeight = containerRef.current.offsetHeight;

                // Target aspect ratio 16:9 (1280x720)
                const targetRatio = 1280 / 720;
                const containerRatio = containerWidth / containerHeight;

                let newScale = 1;

                if (containerRatio < targetRatio) {
                    // Fit to width
                    newScale = containerWidth / 1280;
                } else {
                    // Fit to height
                    newScale = containerHeight / 720;
                }

                // Add some padding (e.g., 90% of available space)
                setScale(newScale * 0.9);
            }
        };

        window.addEventListener('resize', resize);
        resize();

        return () => window.removeEventListener('resize', resize);
    }, []);

    const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            onSelect(null);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center bg-zinc-900/50 overflow-hidden">
            <div
                style={{
                    width: 1280 * scale,
                    height: 720 * scale,
                    boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                }}
            >
                <Stage
                    width={1280 * scale}
                    height={720 * scale}
                    scaleX={scale}
                    scaleY={scale}
                    onMouseDown={checkDeselect}
                    onTouchStart={checkDeselect}
                >
                    <Layer>
                        {/* Background */}
                        <Rect
                            x={0}
                            y={0}
                            width={1280}
                            height={720}
                            fill={background}
                        />

                        {elements.map((el, i) => {
                            const commonProps = {
                                key: el.id,
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
                                return <Rect {...commonProps} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} />;
                            } else if (el.type === 'circle') {
                                return <Circle {...commonProps} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth} radius={(el.width || 50) / 2} />;
                            } else if (el.type === 'text') {
                                return (
                                    <Text
                                        {...commonProps}
                                        text={el.text}
                                        fontSize={el.fontSize}
                                        fill={el.fill}
                                        fontFamily={el.fontFamily}
                                        fontStyle={el.fontWeight}
                                    />
                                );
                            } else if (el.type === 'image' && el.src) {
                                return <URLImage {...commonProps} src={el.src} />;
                            }
                            return null;
                        })}

                        <TransformerComponent selectedId={selectedId} />
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}

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
