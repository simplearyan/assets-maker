export type ToolType = 'select' | 'text' | 'image' | 'rect' | 'circle' | 'background';

export interface ThumbnailElement {
    id: string;
    type: ToolType;
    x: number;
    y: number;
    width?: number;
    height?: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    align?: 'left' | 'center' | 'right';
    src?: string; // For images
    opacity?: number;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOpacity?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
}
