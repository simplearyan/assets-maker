import { Type, Image as ImageIcon, Square, Circle as CircleIcon, LayoutTemplate, Download, Maximize, Minimize } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRef } from 'react';
import { useUIStore } from '../../store/uiStore';

interface ToolbarProps {
    onAddText: () => void;
    onAddShape: (type: 'rect' | 'circle') => void;
    onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenTemplates: () => void;
    onExport: () => void;
}

export function Toolbar({ onAddText, onAddShape, onUploadImage, onOpenTemplates, onExport }: ToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isNavVisible, toggleNavVisible } = useUIStore();

    return (
        <div className="h-16 bg-surface backdrop-blur-md border-t border-border rounded-lg flex items-center justify-center gap-4 px-4 z-50">
            <Button variant="ghost" onClick={onOpenTemplates} title="Templates">
                <LayoutTemplate size={20} />
                <span className="hidden xl:inline ml-2">Templates</span>
            </Button>

            <div className="w-px h-8 bg-border mx-2" />

            <Button variant="ghost" onClick={onAddText} title="Add Text">
                <Type size={20} />
                <span className="hidden xl:inline ml-2">Text</span>
            </Button>

            <Button variant="ghost" onClick={() => fileInputRef.current?.click()} title="Upload Image">
                <ImageIcon size={20} />
                <span className="hidden lg:inline ml-2">Image</span>
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

            <div className="w-px h-8 bg-border mx-2" />

            <Button variant="ghost" onClick={toggleNavVisible} title={isNavVisible ? "Focus Mode (Hide Nav)" : "Show Navigation"}>
                {isNavVisible ? <Minimize size={20} /> : <Maximize size={20} />}
                <span className="hidden xl:inline ml-2">{isNavVisible ? "Focus" : "Nav"}</span>
            </Button>

            <Button variant="primary" onClick={onExport} title="Export">
                <Download size={20} />
                <span className="hidden lg:inline ml-2">Export</span>
            </Button>
        </div>
    );
}
