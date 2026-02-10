import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import {
    Square, Circle, Triangle, Star, Type, Image as ImageIcon,
    Palette, Layers, Type as TypeIcon, Trash2, X, Edit3
} from 'lucide-react';
import { Slider } from '../ui/inputs/Slider';
import { ColorPicker } from '../ui/inputs/ColorPicker';
import { type LogoCanvasRef } from './LogoCanvas';
import { fabric } from 'fabric';

interface MobileDeckProps {
    selectedObject: fabric.Object | null;
    canvasRef: React.RefObject<LogoCanvasRef | null>;
}

type Tab = 'add' | 'style' | 'text' | 'layers';

export function MobileDeck({ selectedObject, canvasRef }: MobileDeckProps) {
    const [activeTab, setActiveTab] = useState<Tab>('add');
    const [isExpanded, setIsExpanded] = useState(false);

    // Reset tab when selection changes
    if (!selectedObject && activeTab !== 'add') {
        setActiveTab('add');
        setIsExpanded(false);
    } else if (selectedObject && activeTab === 'add') {
        setActiveTab(selectedObject.type === 'i-text' ? 'text' : 'style');
    }

    const isText = selectedObject?.type === 'i-text' || selectedObject?.type === 'text';

    const renderAddTools = () => (
        <div className="flex gap-4 overflow-x-auto pb-2 px-2 snap-x">
            <ToolButton
                icon={Square}
                label="Rect"
                onClick={() => canvasRef.current?.addShape('rect')}
            />
            <ToolButton
                icon={Circle}
                label="Circle"
                onClick={() => canvasRef.current?.addShape('circle')}
            />
            <ToolButton
                icon={Triangle}
                label="Triangle"
                onClick={() => canvasRef.current?.addShape('triangle')}
            />
            <ToolButton
                icon={Star}
                label="Star"
                onClick={() => canvasRef.current?.addShape('polygon')}
            />
            <ToolButton
                icon={Type}
                label="Text"
                onClick={() => canvasRef.current?.addText('heading')}
            />
            {/* Simple Icon placeholder for now - extensive library on mobile might need a modal */}
            <ToolButton
                icon={ImageIcon}
                label="Icon"
                onClick={() => alert("Icon library on mobile coming soon!")}
            />
        </div>
    );

    const renderStyleTools = () => (
        <div className="space-y-4 p-4">
            <div className="space-y-2">
                <label className="text-xs text-text-muted">Fill Color</label>
                <ColorPicker
                    value={selectedObject?.fill as string || '#000000'}
                    onChange={(val) => canvasRef.current?.updateProperty('fill', val)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs text-text-muted">Opacity</label>
                <Slider
                    min={0} max={1} step={0.01}
                    value={selectedObject?.opacity || 1}
                    onChange={(e) => canvasRef.current?.updateProperty('opacity', e.target.value)}
                />
            </div>
            <div className="flex justify-end pt-2 gap-2">
                <Button
                    variant="ghost"
                    className="text-text-main"
                    onClick={() => (canvasRef.current as any)?.toggleEdit?.()}
                >
                    <Edit3 size={16} className="mr-2" /> Edit Points
                </Button>
                <Button
                    variant="ghost"
                    className="text-red-400"
                    onClick={() => canvasRef.current?.deleteSelected()}
                >
                    <Trash2 size={16} className="mr-2" /> Delete
                </Button>
            </div>
        </div>
    );

    const renderTextTools = () => (
        <div className="space-y-4 p-4">
            <div className="space-y-2">
                <label className="text-xs text-text-muted">Size</label>
                <Slider
                    min={8} max={200} step={1}
                    value={(selectedObject as any)?.fontSize || 40}
                    onChange={(e) => canvasRef.current?.updateProperty('fontSize', e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs text-text-muted">Color</label>
                <ColorPicker
                    value={selectedObject?.fill as string || '#000000'}
                    onChange={(val) => canvasRef.current?.updateProperty('fill', val)}
                />
            </div>
        </div>
    );

    const renderLayerTools = () => (
        <div className="grid grid-cols-4 gap-2 p-4">
            <Button variant="ghost" onClick={() => canvasRef.current?.reorderSelected('front')}>
                Front
            </Button>
            <Button variant="ghost" onClick={() => canvasRef.current?.reorderSelected('forward')}>
                Up
            </Button>
            <Button variant="ghost" onClick={() => canvasRef.current?.reorderSelected('backward')}>
                Down
            </Button>
            <Button variant="ghost" onClick={() => canvasRef.current?.reorderSelected('back')}>
                Back
            </Button>
        </div>
    );

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none flex flex-col justify-end">
            <GlassCard className={`pointer-events-auto transition-all duration-300 ease-in-out ${isExpanded ? 'h-64' : 'h-auto'} overflow-hidden flex flex-col`}>
                {/* Header / Tabs */}
                <div className="flex items-center justify-between p-2 border-b border-white/5 bg-surface/50 backdrop-blur-md">
                    {selectedObject ? (
                        <div className="flex gap-1">
                            <TabButton
                                active={activeTab === 'style'}
                                onClick={() => { setActiveTab('style'); setIsExpanded(true); }}
                                icon={Palette}
                                label="Style"
                            />
                            {isText && (
                                <TabButton
                                    active={activeTab === 'text'}
                                    onClick={() => { setActiveTab('text'); setIsExpanded(true); }}
                                    icon={TypeIcon}
                                    label="Text"
                                />
                            )}
                            <TabButton
                                active={activeTab === 'layers'}
                                onClick={() => { setActiveTab('layers'); setIsExpanded(true); }}
                                icon={Layers}
                                label="Layers"
                            />
                            <button
                                onClick={() => canvasRef.current?.deleteSelected()}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 ml-2"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ) : (
                        <span className="text-sm font-medium text-text-muted px-2">Add Elements</span>
                    )}

                    {isExpanded && (
                        <button onClick={() => setIsExpanded(false)} className="p-1 text-text-muted hover:text-white">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface/80 scroll-smooth">
                    {activeTab === 'add' && !selectedObject && (
                        <div className="p-4">
                            {renderAddTools()}
                        </div>
                    )}
                    {activeTab === 'style' && selectedObject && renderStyleTools()}
                    {activeTab === 'text' && selectedObject && renderTextTools()}
                    {activeTab === 'layers' && selectedObject && renderLayerTools()}
                </div>
            </GlassCard>
        </div>
    );
}

const ToolButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl hover:bg-white/5 transition-colors group"
    >
        <div className="p-2 rounded-lg bg-surface border border-white/10 group-hover:border-accent/50 group-hover:text-accent transition-all">
            <Icon size={20} />
        </div>
        <span className="text-[10px] text-text-muted group-hover:text-text-main">{label}</span>
    </button>
);

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? 'bg-accent text-white' : 'text-text-muted hover:bg-white/5'
            }`}
    >
        <Icon size={14} />
        {label}
    </button>
);
