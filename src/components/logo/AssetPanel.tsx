import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Square, Circle, Triangle, Star, Shapes, Type, Image as ImageIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

interface AssetPanelProps {
    onAddShape: (type: 'rect' | 'circle' | 'triangle' | 'polygon') => void;
    onAddText: (type: 'heading' | 'subheading' | 'body') => void;
    onAddIcon: (svgString: string) => void;
}

const SHAPES = [
    { type: 'rect', icon: Square, label: 'Rectangle' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'triangle', icon: Triangle, label: 'Triangle' },
    { type: 'polygon', icon: Star, label: 'Star' },
];

const COMMON_ICONS = [
    'Zap', 'Heart', 'Star', 'User', 'Home', 'Settings', 'Search', 'Menu',
    'Check', 'X', 'ArrowRight', 'ChevronRight', 'Plus', 'Minus', 'Trash',
    'Edit', 'Share', 'Download', 'Upload', 'Camera', 'Video', 'Music',
    'Smartphone', 'Laptop', 'Monitor', 'Globe', 'Map', 'MapPin', 'Calendar',
    'Clock', 'Bell', 'Mail', 'MessageCircle', 'Phone', 'ShoppingBag', 'CreditCard'
] as const;

export function AssetPanel({ onAddShape, onAddText, onAddIcon }: AssetPanelProps) {
    const [activeTab, setActiveTab] = useState<'shapes' | 'icons' | 'text'>('shapes');

    const handleIconClick = (iconName: string) => {
        // @ts-ignore - Dynamic access to Lucide icons
        const IconComponent = LucideIcons[iconName];
        if (!IconComponent) return;

        // Convert icon to SVG string
        const container = document.createElement('div');
        const root = createRoot(container);

        flushSync(() => {
            root.render(<IconComponent size={100} color="#000000" />);
        });

        const svgString = container.innerHTML;
        // Clean up root needed? React 18 createRoot doesn't return unmount, but root.unmount() exists.
        setTimeout(() => root.unmount(), 0);

        if (svgString) {
            onAddIcon(svgString);
        }
    };

    return (
        <GlassCard className="w-80 flex flex-col">
            <div className="flex gap-1 p-1 bg-surface/50 rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab('shapes')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'shapes' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}
                >
                    <Shapes size={16} className="mx-auto mb-1" />
                    Shapes
                </button>
                <button
                    onClick={() => setActiveTab('icons')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'icons' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}
                >
                    <ImageIcon size={16} className="mx-auto mb-1" />
                    Icons
                </button>
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-accent text-white shadow-lg' : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}
                >
                    <Type size={16} className="mx-auto mb-1" />
                    Text
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 px-1">
                {activeTab === 'shapes' && (
                    <div className="grid grid-cols-2 gap-3">
                        {SHAPES.map((shape) => (
                            <button
                                key={shape.type}
                                onClick={() => onAddShape(shape.type as any)}
                                className="aspect-square flex flex-col items-center justify-center gap-2 bg-surface border border-white/5 rounded-xl hover:border-accent/50 hover:bg-accent/10 transition-all group"
                            >
                                <shape.icon size={32} className="text-text-muted group-hover:text-accent transition-colors" />
                                <span className="text-xs text-text-muted group-hover:text-text-main">{shape.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'icons' && (
                    <div className="grid grid-cols-4 gap-2">
                        {COMMON_ICONS.map((name) => {
                            // @ts-ignore
                            const Icon = LucideIcons[name];
                            if (!Icon) return null;
                            return (
                                <button
                                    key={name}
                                    onClick={() => handleIconClick(name)}
                                    className="aspect-square flex items-center justify-center bg-surface border border-white/5 rounded-xl hover:border-accent/50 hover:bg-accent/10 transition-all text-text-muted hover:text-accent"
                                    title={name}
                                >
                                    <Icon size={24} />
                                </button>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'text' && (
                    <div className="space-y-3">
                        <button
                            onClick={() => onAddText('heading')}
                            className="w-full text-left p-4 bg-surface border border-white/5 rounded-xl hover:border-accent/50 hover:bg-accent/10 transition-all group"
                        >
                            <h1 className="text-2xl font-bold text-text-main mb-1">Add Heading</h1>
                            <span className="text-xs text-text-muted">Inter Bold, 40px</span>
                        </button>
                        <button
                            onClick={() => onAddText('subheading')}
                            className="w-full text-left p-4 bg-surface border border-white/5 rounded-xl hover:border-accent/50 hover:bg-accent/10 transition-all group"
                        >
                            <h2 className="text-lg font-semibold text-text-main mb-1">Add Subheading</h2>
                            <span className="text-xs text-text-muted">Inter Semibold, 24px</span>
                        </button>
                        <button
                            onClick={() => onAddText('body')}
                            className="w-full text-left p-4 bg-surface border border-white/5 rounded-xl hover:border-accent/50 hover:bg-accent/10 transition-all group"
                        >
                            <p className="text-sm text-text-main mb-1">Add Body Text</p>
                            <span className="text-xs text-text-muted">Inter Regular, 16px</span>
                        </button>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
