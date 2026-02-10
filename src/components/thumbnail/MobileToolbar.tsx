import { Type, Image as ImageIcon, Square, LayoutTemplate, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRef } from 'react';

interface MobileToolbarProps {
    onAddText: () => void;
    onAddShape: (type: 'rect' | 'circle') => void;
    onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenTemplates: () => void;
    onExport: () => void;
}

export function MobileToolbar({ onAddText, onAddShape, onUploadImage, onOpenTemplates, onExport }: MobileToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-border z-30 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between px-4 py-3">
                <Button variant="ghost" size="sm" onClick={onOpenTemplates} className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-text-muted hover:text-text-main">
                    <LayoutTemplate size={24} />
                    <span className="text-[10px] font-medium">Templates</span>
                </Button>

                <Button variant="ghost" size="sm" onClick={onAddText} className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-text-muted hover:text-text-main">
                    <Type size={24} />
                    <span className="text-[10px] font-medium">Text</span>
                </Button>

                <div className="relative">
                    <Button
                        variant="primary"
                        size="lg"
                        className="h-14 w-14 rounded-full shadow-lg -mt-8 border-4 border-bg relative z-10 p-0 flex items-center justify-center"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon size={24} />
                    </Button>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-text-muted whitespace-nowrap">Image</span>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={onUploadImage}
                />

                <Button variant="ghost" size="sm" onClick={() => onAddShape('rect')} className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-text-muted hover:text-text-main">
                    <Square size={24} />
                    <span className="text-[10px] font-medium">Shapes</span>
                </Button>

                <Button variant="ghost" size="sm" onClick={onExport} className="flex flex-col items-center gap-1 h-auto py-1 px-2 text-text-muted hover:text-text-main">
                    <Download size={24} />
                    <span className="text-[10px] font-medium">Export</span>
                </Button>
            </div>
        </div>
    );
}
