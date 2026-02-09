import { Type, Image as ImageIcon, Square, Circle as CircleIcon, LayoutTemplate, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ToolType } from '../../types/thumbnail';
import { useRef } from 'react';

interface ToolbarProps {
    onAddText: () => void;
    onAddShape: (type: 'rect' | 'circle') => void;
    onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenTemplates: () => void;
    onExport: () => void;
}

export function Toolbar({ onAddText, onAddShape, onUploadImage, onOpenTemplates, onExport }: ToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="h-16 bg-surface backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-4 px-4 z-50">
            <Button variant="ghost" onClick={onOpenTemplates} title="Templates">
                <LayoutTemplate size={20} />
                <span className="hidden md:inline ml-2">Templates</span>
            </Button>

            <div className="w-px h-8 bg-white/10 mx-2" />

            <Button variant="ghost" onClick={onAddText} title="Add Text">
                <Type size={20} />
                <span className="hidden md:inline ml-2">Text</span>
            </Button>

            <Button variant="ghost" onClick={() => fileInputRef.current?.click()} title="Upload Image">
                <ImageIcon size={20} />
                <span className="hidden md:inline ml-2">Image</span>
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={onUploadImage}
            />

            <Button variant="ghost" onClick={() => onAddShape('rect')} title="Rectangle">
                <Square size={20} />
            </Button>

            <Button variant="ghost" onClick={() => onAddShape('circle')} title="Circle">
                <CircleIcon size={20} />
            </Button>

            <div className="w-px h-8 bg-white/10 mx-2" />

            <Button variant="primary" onClick={onExport} title="Export">
                <Download size={20} />
                <span className="hidden md:inline ml-2">Export</span>
            </Button>
        </div>
    );
}
