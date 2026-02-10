import { useState } from 'react';

import { Square, Circle, Triangle, Star, Shapes, Type, Upload, Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

interface AssetPanelProps {
    onAddShape: (type: 'rect' | 'circle' | 'triangle' | 'polygon') => void;
    onAddText: (type: 'heading' | 'subheading' | 'body') => void;
    onAddIcon: (svgString: string) => void;
    onAddImage?: (url: string) => void;
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

export function AssetPanel({ onAddShape, onAddText, onAddIcon, onAddImage }: AssetPanelProps) {
    const [activeTab, setActiveTab] = useState<'shapes' | 'icons' | 'text' | 'uploads' | 'emojis'>('shapes');
    const [uploadedAssets, setUploadedAssets] = useState<{ id: string, name: string, data: string, type: 'svg' | 'image' }[]>([]);

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

    const EMOJIS = ['😀', '😎', '🎉', '🔥', '🚀', '💡', '🎨', '✨', '❤️', '👍', '🐱', '🐶', '🍕', '☕', '⚽', '🎮', '🚗', '✈️', '🌈', '☀️', '🌙', '⭐', '💎', '🔔'];

    return (
        <div className="w-80 flex flex-col h-full bg-surface/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5">
            {/* Tabs */}
            <div className="flex p-1 gap-1 border-b border-white/5 bg-black/20">
                <button
                    onClick={() => setActiveTab('shapes')}
                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${activeTab === 'shapes' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-muted hover:bg-white/5 hover:text-text-main'}`}
                >
                    <Shapes size={18} />
                    <span className="text-[10px] font-medium mt-1">Shapes</span>
                </button>
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${activeTab === 'text' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-muted hover:bg-white/5 hover:text-text-main'}`}
                >
                    <Type size={18} />
                    <span className="text-[10px] font-medium mt-1">Text</span>
                </button>
                <button
                    onClick={() => setActiveTab('icons')}
                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${activeTab === 'icons' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-muted hover:bg-white/5 hover:text-text-main'}`}
                >
                    <Star size={18} />
                    <span className="text-[10px] font-medium mt-1">Icons</span>
                </button>
                <button
                    onClick={() => setActiveTab('emojis')}
                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${activeTab === 'emojis' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-muted hover:bg-white/5 hover:text-text-main'}`}
                >
                    <span className="text-lg leading-none mb-0.5">😀</span>
                    <span className="text-[10px] font-medium">Emojis</span>
                </button>
                <button
                    onClick={() => setActiveTab('uploads')}
                    className={`flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all ${activeTab === 'uploads' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-text-muted hover:bg-white/5 hover:text-text-main'}`}
                >
                    <Upload size={18} />
                    <span className="text-[10px] font-medium mt-1">Uploads</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">

                {/* Shapes Tab */}
                {activeTab === 'shapes' && (
                    <div className="grid grid-cols-2 gap-3">
                        {SHAPES.map((shape) => (
                            <button
                                key={shape.type}
                                onClick={() => onAddShape(shape.type as any)}
                                className="aspect-square flex flex-col items-center justify-center gap-2 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group"
                            >
                                <div className="text-accent group-hover:scale-110 transition-transform">
                                    <shape.icon size={32} />
                                </div>
                                <span className="text-xs text-text-muted font-medium">{shape.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Text Tab */}
                {activeTab === 'text' && (
                    <div className="space-y-3">
                        <button
                            onClick={() => onAddText('heading')}
                            className="w-full text-left p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group"
                        >
                            <h3 className="text-2xl font-bold text-text-main mb-1 group-hover:text-accent transition-colors">Add a Heading</h3>
                            <span className="text-xs text-text-muted">Bold & Impactful</span>
                        </button>
                        <button
                            onClick={() => onAddText('subheading')}
                            className="w-full text-left p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group"
                        >
                            <h4 className="text-xl font-semibold text-text-main mb-1 group-hover:text-accent transition-colors">Add a Subheading</h4>
                            <span className="text-xs text-text-muted">Clear & Concise</span>
                        </button>
                        <button
                            onClick={() => onAddText('body')}
                            className="w-full text-left p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group"
                        >
                            <p className="text-base text-text-main mb-1 group-hover:text-accent transition-colors">Add Body Text</p>
                            <span className="text-xs text-text-muted">Detailed Description</span>
                        </button>
                    </div>
                )}

                {/* Icons Tab */}
                {activeTab === 'icons' && (
                    <div className="grid grid-cols-4 gap-3">
                        {COMMON_ICONS.map((iconName) => {
                            // @ts-ignore
                            const Icon = LucideIcons[iconName];
                            if (!Icon) return null;
                            return (
                                <button
                                    key={iconName}
                                    onClick={() => handleIconClick(iconName)}
                                    className="aspect-square flex flex-col items-center justify-center bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group"
                                    title={iconName}
                                >
                                    <Icon size={24} className="text-text-muted group-hover:text-accent transition-colors" />
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Emojis Tab */}
                {activeTab === 'emojis' && (
                    <div className="grid grid-cols-4 gap-3">
                        {EMOJIS.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => {
                                    // Use Twemoji or simple text for now.
                                    // To allow boolean ops, these MUST be SVGs.
                                    // For now, let's load them as text, and user can 'Flatten' them using the new feature!
                                    // Or better: load from Twemoji CDN as SVG.
                                    const codePoint = emoji.codePointAt(0)?.toString(16);
                                    if (codePoint) {
                                        const url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoint}.svg`;
                                        fetch(url)
                                            .then(res => res.text())
                                            .then(svg => onAddIcon(svg))
                                            .catch(console.error);
                                    }
                                }}
                                className="aspect-square flex items-center justify-center text-2xl bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all hover:scale-110"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}

                {/* Uploads Tab */}
                {activeTab === 'uploads' && (
                    <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload size={32} className="text-text-muted mb-2 group-hover:text-accent transition-colors" />
                                <p className="text-xs text-text-muted font-medium">Click to upload assets</p>
                                <p className="text-[10px] text-text-muted opacity-50 mt-1">SVG, PNG, JPG supported</p>
                            </div>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*,.svg"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = Array.from(e.target.files || []);
                                    files.forEach(file => {
                                        const isSVG = file.type === 'image/svg+xml' || file.name.endsWith('.svg');
                                        const reader = new FileReader();

                                        reader.onload = (f) => {
                                            const result = f.target?.result as string;
                                            if (result) {
                                                const newAsset = {
                                                    id: Math.random().toString(36).substr(2, 9),
                                                    name: file.name,
                                                    data: result,
                                                    type: (isSVG ? 'svg' : 'image') as 'svg' | 'image'
                                                };
                                                setUploadedAssets(prev => [newAsset, ...prev]);
                                            }
                                        };

                                        if (isSVG) reader.readAsText(file);
                                        else reader.readAsDataURL(file);
                                    });
                                }}
                            />
                        </label>

                        {uploadedAssets.length > 0 && (
                            <div className="grid grid-cols-2 gap-3">
                                {uploadedAssets.map((asset) => (
                                    <div
                                        key={asset.id}
                                        className="group relative aspect-square bg-white/5 rounded-xl border border-white/5 overflow-hidden hover:border-accent/30 transition-all cursor-pointer"
                                        onClick={() => {
                                            if (asset.type === 'svg') onAddIcon(asset.data);
                                            else onAddImage?.(asset.data);
                                        }}
                                    >
                                        {/* Asset Preview */}
                                        <div className="absolute inset-0 p-2 flex items-center justify-center">
                                            {asset.type === 'svg' ? (
                                                <div
                                                    className="w-full h-full flex items-center justify-center text-text-main [&>svg]:w-full [&>svg]:h-full"
                                                    dangerouslySetInnerHTML={{ __html: asset.data }}
                                                />
                                            ) : (
                                                <img
                                                    src={asset.data}
                                                    alt={asset.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            )}
                                        </div>

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <div className="p-2 bg-accent rounded-full text-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200 delay-75">
                                                <Plus size={16} />
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUploadedAssets(prev => prev.filter(a => a.id !== asset.id));
                                                }}
                                                className="p-2 bg-red-500 rounded-full text-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200 delay-100 hover:bg-red-600"
                                                title="Delete Asset"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {uploadedAssets.length === 0 && (
                            <div className="text-center py-8 text-text-muted/30 text-xs italic">
                                Your library is empty
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
