import { useState, useEffect } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { ThumbnailCanvas } from '../components/thumbnail/ThumbnailCanvas';
import { Toolbar } from '../components/thumbnail/Toolbar';
import { PropertiesPanel } from '../components/thumbnail/PropertiesPanel';
import { PropertiesDrawer } from '../components/thumbnail/PropertiesDrawer';
import type { ThumbnailElement, ToolType } from '../types/thumbnail';
import { Button } from '../components/ui/Button';

export function ThumbnailMaker() {
    const [elements, setElements] = useState<ThumbnailElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [background] = useState('#ffffff');
    const [isMobile, setIsMobile] = useState(false);

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

                <Toolbar
                    onAddText={() => handleAddElement('text')}
                    onAddShape={(type) => type === 'rect' ? handleAddElement('rect') : handleAddElement('circle')}
                    onUploadImage={handleUploadImage}
                    onOpenTemplates={() => { }}
                    onExport={handleExport}
                />

                <PropertiesDrawer
                    element={selectedElement}
                    isOpen={!!selectedId}
                    onOpenChange={(open) => !open && setSelectedId(null)}
                    onChange={handleUpdateElement}
                    onDelete={handleDeleteElement}
                    onDuplicate={handleDuplicateElement}
                />
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-6rem)] w-full bg-bg font-sans text-text-main">
            <Group direction="horizontal">
                {/* Left Sidebar */}
                <Panel defaultSize="20" minSize="15" maxSize="30" className="bg-zinc-950 border-r border-white/5 hidden lg:block">
                    <div className="p-4 h-full overflow-y-auto">
                        <h2 className="text-sm font-bold uppercase text-text-muted mb-4">Templates</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-video bg-white/5 rounded hover:bg-white/10 cursor-pointer border border-white/5 hover:border-accent/50 transition-colors" />
                            ))}
                        </div>
                    </div>
                </Panel>

                <Separator className="w-1 bg-white/5 hover:bg-accent/50 transition-colors cursor-col-resize" />

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

                <Separator className="w-1 bg-white/5 hover:bg-accent/50 transition-colors cursor-col-resize" />

                {/* Right Properties Panel */}
                <Panel defaultSize="20" minSize="20" maxSize="30" className="bg-zinc-950 border-l border-white/5">
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
