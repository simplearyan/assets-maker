import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Square, Circle, Triangle, Star, Shapes, Type } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'shapes' | 'icons' | 'text' | 'uploads'>('shapes');
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

    return (
        <GlassCard className="w-80 flex flex-col h-full bg-surface/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5">
            <div className="p-4 pb-0">
                <div className="flex p-1 bg-surface/50 rounded-xl mb-6 border border-white/5">
                    <button
                        onClick={() => setActiveTab('shapes')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'shapes' ? 'bg-accent/20 text-accent ring-1 ring-accent/50 shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]' : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}
                    >
                        <Shapes size={16} className="mx-auto mb-1" />
                        Shapes
                    </button>
                    <button
                        onClick={() => setActiveTab('icons')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'icons' ? 'bg-accent/20 text-accent ring-1 ring-accent/50 shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]' : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}
                    >
                        <LucideIcons.Smile size={16} className="mx-auto mb-1" />
                        Icons
                    </button>
                    <button
                        onClick={() => setActiveTab('text')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'text' ? 'bg-accent/20 text-accent ring-1 ring-accent/50 shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]' : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}
                    >
                        <Type size={16} className="mx-auto mb-1" />
                        Text
                    </button>
                    <button
                        onClick={() => setActiveTab('uploads')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'uploads' ? 'bg-accent/20 text-accent ring-1 ring-accent/50 shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]' : 'text-text-muted hover:text-text-main hover:bg-white/5'}`}
                    >
                        <LucideIcons.Upload size={16} className="mx-auto mb-1" />
                        Upload
                    </button>
                </div>
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

                {activeTab === 'uploads' && (
                    <div className="space-y-6 p-2">
                        <div
                            className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-text-muted hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer group"
                            onClick={() => document.getElementById('image-upload')?.click()}
                        >
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <LucideIcons.CloudUpload size={24} />
                            </div>
                            <p className="text-sm font-medium">Click to Upload</p>
                            <p className="text-xs opacity-50">PNG, JPG, SVG</p>
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
                                                // Automatically add to canvas on first upload? 
                                                // Better to just let user click if they want multiple.
                                            }
                                        };

                                        if (isSVG) reader.readAsText(file);
                                        else reader.readAsDataURL(file);
                                    });
                                }}
                            />
                        </div>

                        {uploadedAssets.length > 0 && (
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-1">Library ({uploadedAssets.length})</label>
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
                                            <div className="absolute inset-0 flex items-center justify-center p-2">
                                                {asset.type === 'svg' ? (
                                                    <div className="w-full h-full opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center" dangerouslySetInnerHTML={{ __html: asset.data.includes('<svg') ? asset.data : '' }} />
                                                ) : (
                                                    <img src={asset.data} alt={asset.name} className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                                                )}
                                            </div>

                                            {/* Delete Overlay */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUploadedAssets(prev => prev.filter(a => a.id !== asset.id));
                                                }}
                                                className="absolute top-1 right-1 p-1.5 rounded-lg bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                                            >
                                                <LucideIcons.Trash2 size={12} />
                                            </button>

                                            <div className="absolute bottom-0 inset-x-0 p-1 bg-black/40 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform">
                                                <p className="text-[9px] text-white truncate text-center">{asset.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </GlassCard >
    );
}
