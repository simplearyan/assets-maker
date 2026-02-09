import { useState, useEffect } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { ThumbnailCanvas } from '../components/thumbnail/ThumbnailCanvas';
import { Toolbar } from '../components/thumbnail/Toolbar';
import { PropertiesPanel } from '../components/thumbnail/PropertiesPanel';
import { MobilePropertyBar, type PropertyTab } from '../components/thumbnail/MobilePropertyBar';
import { MobilePropertyDeck } from '../components/thumbnail/MobilePropertyDeck';
import type { ThumbnailElement, ToolType } from '../types/thumbnail';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/inputs/Textarea';
import { ColorPicker } from '../components/ui/inputs/ColorPicker';
import { Label } from '../components/ui/inputs/Label';
import { Input } from '../components/ui/inputs/Input';
import { Slider } from '../components/ui/inputs/Slider';

export function ThumbnailMaker() {
    const [elements, setElements] = useState<ThumbnailElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [background] = useState('#ffffff');
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState<PropertyTab>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleAddElement = (type: ToolType, src?: string) => {
        const id = crypto.randomUUID();
        const newElement: ThumbnailElement = {
            id,
            type,
            x: 1280 / 2 - 100,
            y: 720 / 2 - 100,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
        };

        if (type === 'text') {
            newElement.text = 'Double Click to Edit';
            newElement.fontSize = 60;
            newElement.fill = '#000000';
            newElement.fontFamily = 'Inter';
            newElement.fontWeight = 'bold';
            newElement.x = 1280 / 2 - 200;
            newElement.y = 720 / 2 - 50;
        } else if (type === 'rect') {
            newElement.width = 200;
            newElement.height = 200;
            newElement.fill = '#3b82f6';
        } else if (type === 'circle') {
            newElement.width = 200;
            newElement.height = 200;
            newElement.fill = '#ec4899';
        } else if (type === 'image' && src) {
            newElement.src = src;
        }

        setElements([...elements, newElement]);
        setSelectedId(id);
    };

    const handleUpdateElement = (id: string, attrs: Partial<ThumbnailElement>) => {
        setElements(elements.map((el) => (el.id === id ? { ...el, ...attrs } : el)));
    };

    const handleDeleteElement = (id: string) => {
        setElements(elements.filter((el) => el.id !== id));
        setSelectedId(null);
    };

    const handleDuplicateElement = (id: string) => {
        const element = elements.find((el) => el.id === id);
        if (element) {
            const newId = crypto.randomUUID();
            const newElement = { ...element, id: newId, x: element.x + 20, y: element.y + 20 };
            setElements([...elements, newElement]);
            setSelectedId(newId);
        }
    };

    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            // In a real app, you'd upload this to a server or convert to base64
            handleAddElement('image', url);
        }
    };

    const handleExport = () => {
        alert('Export functionality will be implemented in the next step!');
    };

    const selectedElement = elements.find((el) => el.id === selectedId) || null;

    if (isMobile) {
        return (
            <div className="h-[calc(100vh-6rem)] w-full flex flex-col relative bg-bg">
                <div className="flex-1 relative overflow-hidden">
                    <ThumbnailCanvas
                        elements={elements}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onChange={handleUpdateElement}
                        background={background}
                    />
                </div>

                {!selectedElement ? (
                    <Toolbar
                        onAddText={() => handleAddElement('text')}
                        onAddShape={(type) => type === 'rect' ? handleAddElement('rect') : handleAddElement('circle')}
                        onUploadImage={handleUploadImage}
                        onOpenTemplates={() => { }}
                        onExport={handleExport}
                    />
                ) : (
                    <MobilePropertyBar
                        element={selectedElement}
                        activeTab={activeTab}
                        onTabChange={(tab) => setActiveTab(tab)}
                        onDelete={() => handleDeleteElement(selectedElement.id)}
                        onDuplicate={() => handleDuplicateElement(selectedElement.id)}
                        onClose={() => setSelectedId(null)}
                    />
                )}

                {/* Mobile Property Decks */}
                {selectedElement && (
                    <MobilePropertyDeck
                        isOpen={!!activeTab}
                        onClose={() => setActiveTab(null)}
                        title={
                            activeTab === 'text' ? 'Edit Text' :
                                activeTab === 'color' ? 'Color' :
                                    activeTab === 'position' ? 'Position' :
                                        activeTab === 'size' ? (selectedElement.type === 'text' ? 'Font Size' : 'Size') :
                                            activeTab === 'opacity' ? 'Opacity' :
                                                activeTab === 'stroke' ? 'Stroke' : ''
                        }
                    >
                        {activeTab === 'text' && (
                            <Textarea
                                value={selectedElement.text || ''}
                                onChange={(e) => handleUpdateElement(selectedElement.id, { text: e.target.value })}
                                className="h-32 text-lg"
                                autoFocus
                            />
                        )}

                        {activeTab === 'color' && (
                            <ColorPicker
                                value={selectedElement.fill || '#000000'}
                                onChange={(value) => handleUpdateElement(selectedElement.id, { fill: value })}
                            />
                        )}

                        {activeTab === 'position' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="mb-2">X Coordinate</Label>
                                    <Input
                                        type="number"
                                        value={Math.round(selectedElement.x)}
                                        onChange={(e) => handleUpdateElement(selectedElement.id, { x: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2">Y Coordinate</Label>
                                    <Input
                                        type="number"
                                        value={Math.round(selectedElement.y)}
                                        onChange={(e) => handleUpdateElement(selectedElement.id, { y: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'size' && (
                            selectedElement.type === 'text' ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Size</span>
                                        <span>{selectedElement.fontSize}px</span>
                                    </div>
                                    <Slider
                                        min={10}
                                        max={200}
                                        value={selectedElement.fontSize || 20}
                                        onChange={(e) => handleUpdateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Width</span>
                                        <span>{Math.round(selectedElement.width || 0)}px</span>
                                    </div>
                                    <Slider
                                        min={10}
                                        max={800}
                                        value={selectedElement.width || 100}
                                        onChange={(e) => handleUpdateElement(selectedElement.id, { width: Number(e.target.value), height: Number(e.target.value) })}
                                    />
                                </div>
                            )
                        )}

                        {activeTab === 'opacity' && (
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Opacity</span>
                                    <span>{Math.round((selectedElement.opacity !== undefined ? selectedElement.opacity : 1) * 100)}%</span>
                                </div>
                                <Slider
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={selectedElement.opacity !== undefined ? selectedElement.opacity : 1}
                                    onChange={(e) => handleUpdateElement(selectedElement.id, { opacity: Number(e.target.value) })}
                                />
                            </div>
                        )}

                        {activeTab === 'stroke' && (
                            <div className="space-y-4">
                                <Label>Stroke Color</Label>
                                <ColorPicker
                                    value={selectedElement.stroke || '#000000'}
                                    onChange={(value) => handleUpdateElement(selectedElement.id, { stroke: value })}
                                />
                                <div className="pt-2">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Stroke Width</span>
                                        <span>{selectedElement.strokeWidth || 0}px</span>
                                    </div>
                                    <Slider
                                        min={0}
                                        max={20}
                                        value={selectedElement.strokeWidth || 0}
                                        onChange={(e) => handleUpdateElement(selectedElement.id, { strokeWidth: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        )}
                    </MobilePropertyDeck>
                )}
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-6rem)] w-full bg-bg font-sans text-text-main">
            <Group direction="horizontal">
                {/* Left Sidebar */}
                <Panel defaultSize="20" minSize="15" maxSize="30" className="bg-surface border-r border-border hidden lg:block">
                    <div className="p-4 h-full overflow-y-auto">
                        <h2 className="text-sm font-bold uppercase text-text-muted mb-4">Templates</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-video bg-surface-card rounded hover:bg-border/50 cursor-pointer border border-border hover:border-accent/50 transition-colors" />
                            ))}
                        </div>
                    </div>
                </Panel>

                <Separator className="w-1 bg-border hover:bg-accent/50 transition-colors cursor-col-resize" />

                {/* Center Canvas */}
                <Panel defaultSize="60" minSize="40">
                    <div className="w-full h-full relative flex flex-col">
                        <ThumbnailCanvas
                            elements={elements}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onChange={handleUpdateElement}
                            background={background}
                        />

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 shadow-2xl rounded-full">
                            <Toolbar
                                onAddText={() => handleAddElement('text')}
                                onAddShape={(type) => type === 'rect' ? handleAddElement('rect') : handleAddElement('circle')}
                                onUploadImage={handleUploadImage}
                                onOpenTemplates={() => { }}
                                onExport={handleExport}
                            />
                        </div>
                    </div>
                </Panel>

                <Separator className="w-1 bg-border hover:bg-accent/50 transition-colors cursor-col-resize" />

                {/* Right Properties Panel */}
                <Panel defaultSize="20" minSize="20" maxSize="30" className="bg-surface border-l border-border">
                    <PropertiesPanel
                        element={selectedElement}
                        onChange={handleUpdateElement}
                        onDelete={handleDeleteElement}
                        onDuplicate={handleDuplicateElement}
                    />
                </Panel>
            </Group>
        </div>
    );
}
