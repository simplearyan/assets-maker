import { useState, useEffect, useRef } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { ThumbnailCanvas } from '../components/thumbnail/ThumbnailCanvas';
import { Toolbar } from '../components/thumbnail/Toolbar';
import { PropertiesPanel } from '../components/thumbnail/PropertiesPanel';
import { MobilePropertyDeck } from '../components/thumbnail/MobilePropertyDeck';
import type { ThumbnailElement, ToolType } from '../types/thumbnail';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/inputs/Textarea';
import { ColorPicker } from '../components/ui/inputs/ColorPicker';
import { Label } from '../components/ui/inputs/Label';
import { Input } from '../components/ui/inputs/Input';
import { Slider } from '../components/ui/inputs/Slider';
import { ZoomIn, ZoomOut, RotateCcw, ArrowUpToLine, ArrowDownToLine, ChevronUp, ChevronDown, LayoutGrid as LayoutGridIcon, Maximize, Minimize } from 'lucide-react';
import { cn, downloadFile } from '../lib/utils';
import { useUIStore } from '../store/uiStore';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarContent } from '../components/thumbnail/SidebarContent';
import { MobileToolbar } from '../components/thumbnail/MobileToolbar';
import { MobileContextBar, type PropertyTab } from '../components/thumbnail/MobileContextBar';
import { MobileCanvasBar, type CanvasTab } from '../components/thumbnail/MobileCanvasBar';
import { type Template } from '../data/templates';
import { AlertModal } from '../components/ui/AlertModal';

export function ThumbnailMaker() {
    const [elements, setElements] = useState<ThumbnailElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [background, setBackground] = useState('#ffffff');
    const [canvasWidth, setCanvasWidth] = useState(1280);
    const [canvasHeight, setCanvasHeight] = useState(720);
    const [isTransparent, setIsTransparent] = useState(false);
    const [clipContent, setClipContent] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isCompact, setIsCompact] = useState(false);
    const [showSidebarDrawer, setShowSidebarDrawer] = useState(false);
    const [activeTab, setActiveTab] = useState<PropertyTab>(null);
    const [showTemplates, setShowTemplates] = useState(true);
    const [isEditingCanvas, setIsEditingCanvas] = useState(false);
    const [activeCanvasTab, setActiveCanvasTab] = useState<CanvasTab>(null);
    const [zoom, setZoom] = useState(1);
    const [showTemplateWarning, setShowTemplateWarning] = useState(false);
    const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);
    const { isNavVisible, toggleNavVisible } = useUIStore();
    const stageRef = useRef<any>(null);

    const handleApplyTemplate = (template: Template) => {
        if (elements.length > 0) {
            setPendingTemplate(template);
            setShowTemplateWarning(true);
        } else {
            confirmApplyTemplate(template);
        }
    };

    const confirmApplyTemplate = (template: Template) => {
        // Deep copy elements to avoid reference issues and assign new IDs
        const newElements = template.elements.map(el => ({
            ...el,
            id: crypto.randomUUID()
        }));

        setElements(newElements);
        setSelectedId(null);
        if (template.background) {
            setBackground(template.background);
        }
        setShowTemplateWarning(false);
        setPendingTemplate(null);
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        const checkCompact = () => {
            const compact = window.innerWidth < 1280;
            setIsCompact(compact);
            if (!compact) setShowSidebarDrawer(false);
        };

        checkMobile();
        checkCompact();

        window.addEventListener('resize', checkMobile);
        window.addEventListener('resize', checkCompact);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('resize', checkCompact);
        };
    }, []);

    const handleAddElement = (type: ToolType, src?: string, extraArgs: Partial<ThumbnailElement> = {}) => {
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

        Object.assign(newElement, extraArgs);

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

    const handleReorderElement = (id: string, type: 'front' | 'back' | 'forward' | 'backward') => {
        const index = elements.findIndex((el) => el.id === id);
        if (index === -1) return;

        const newElements = [...elements];
        const element = newElements.splice(index, 1)[0];

        if (type === 'front') {
            newElements.push(element);
        } else if (type === 'back') {
            newElements.unshift(element);
        } else if (type === 'forward') {
            const newIndex = Math.min(index + 1, elements.length - 1);
            newElements.splice(newIndex, 0, element);
        } else if (type === 'backward') {
            const newIndex = Math.max(index - 1, 0);
            newElements.splice(newIndex, 0, element);
        }

        setElements(newElements);
    };

    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                handleAddElement('image', url, {
                    width: 200, // Default display width
                    height: 200 * (img.height / img.width), // Maintain aspect ratio
                    originalWidth: img.width,
                    originalHeight: img.height
                });
            };
            img.src = url;
        }
    };

    const handleExport = () => {
        if (!stageRef.current) return;

        // Deselect any selected element before export
        setSelectedId(null);

        // Wait for a tick for Transformer to disappear
        setTimeout(() => {
            const uri = stageRef.current?.toDataURL({
                pixelRatio: 3, // High quality export
            });
            if (uri) {
                downloadFile(uri, 'kenichi-thumbnail.png');
            }
        }, 50);
    };

    const handleUpdateCanvas = (settings: Partial<{ width: number; height: number; background: string; isTransparent: boolean; clipContent: boolean }>) => {
        if (settings.width !== undefined) setCanvasWidth(settings.width);
        if (settings.height !== undefined) setCanvasHeight(settings.height);
        if (settings.background !== undefined) setBackground(settings.background);
        if (settings.isTransparent !== undefined) setIsTransparent(settings.isTransparent);
        if (settings.clipContent !== undefined) setClipContent(settings.clipContent);
    };

    const selectedElement = elements.find((el) => el.id === selectedId) || null;

    if (isMobile) {
        return (
            <div className={cn(
                "w-full bg-bg font-sans text-text-main flex flex-col relative overflow-hidden transition-all duration-300",
                isNavVisible ? "h-[calc(100vh-6rem)]" : "h-screen"
            )}>
                <div className="flex-1 w-full overflow-hidden relative">
                    <ThumbnailCanvas
                        ref={stageRef}
                        elements={elements}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onChange={handleUpdateElement}
                        background={background}
                        zoom={zoom}
                        canvasWidth={canvasWidth}
                        canvasHeight={canvasHeight}
                        isTransparent={isTransparent}
                        clipContent={clipContent}
                    />

                    {/* Mobile Zoom Controls - Moved to Top Right */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-surface/60 backdrop-blur-xl backdrop-saturate-150 border border-border p-1 rounded-2xl shadow-lg z-20 scale-90 origin-top-right">
                        <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} className="h-8 w-8 p-0">
                            <ZoomOut size={16} />
                        </Button>
                        <span className="text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
                        <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))} className="h-8 w-8 p-0">
                            <ZoomIn size={16} />
                        </Button>
                        <div className="w-px h-4 bg-border mx-1" />
                        <Button variant="ghost" size="sm" onClick={toggleNavVisible} className="h-8 w-8 p-0">
                            {isNavVisible ? <Maximize size={16} /> : <Minimize size={16} />}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {selectedElement ? (
                            <motion.div
                                key="context-bar"
                                initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
                            >
                                <div className="pointer-events-auto">
                                    <MobileContextBar
                                        element={selectedElement}
                                        activeTab={activeTab as PropertyTab}
                                        onTabChange={(tab) => setActiveTab(tab)}
                                        onDelete={() => handleDeleteElement(selectedElement.id)}
                                        onDuplicate={() => handleDuplicateElement(selectedElement.id)}
                                        onClose={() => setSelectedId(null)}
                                    />
                                </div>
                            </motion.div>
                        ) : isEditingCanvas ? (
                            <motion.div
                                key="canvas-bar"
                                initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
                            >
                                <div className="pointer-events-auto">
                                    <MobileCanvasBar
                                        canvasSettings={{ width: canvasWidth, height: canvasHeight, background, isTransparent, clipContent }}
                                        activeTab={activeCanvasTab}
                                        onTabChange={setActiveCanvasTab}
                                        onClose={() => setIsEditingCanvas(false)}
                                        onUpdateCanvas={(settings) => {
                                            if (settings.width) setCanvasWidth(settings.width);
                                            if (settings.height) setCanvasHeight(settings.height);
                                            if (settings.background) setBackground(settings.background);
                                            if (settings.isTransparent !== undefined) setIsTransparent(settings.isTransparent);
                                            if (settings.clipContent !== undefined) setClipContent(settings.clipContent);
                                        }}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="toolbar"
                                initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="fixed bottom-0 left-0 right-0 z-30"
                            >
                                <MobileToolbar
                                    onAddText={() => handleAddElement('text')}
                                    onAddShape={(type) => type === 'rect' ? handleAddElement('rect') : handleAddElement('circle')}
                                    onUploadImage={handleUploadImage}
                                    onOpenTemplates={() => setShowSidebarDrawer(true)}
                                    onEditCanvas={() => {
                                        setIsEditingCanvas(true);
                                        setActiveCanvasTab('size');
                                    }}
                                    onExport={handleExport}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Sidebar Content Drawer */}
                <AnimatePresence>
                    {showSidebarDrawer && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowSidebarDrawer(false)}
                                className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute bottom-0 left-0 right-0 h-[80vh] z-50 bg-surface rounded-t-2xl shadow-2xl overflow-hidden"
                            >
                                <div className="h-full flex flex-col">
                                    <div className="flex items-center justify-center p-2 border-b border-border">
                                        <div className="w-12 h-1 bg-border rounded-full" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <SidebarContent
                                            elements={elements}
                                            selectedId={selectedId}
                                            onSelect={(id) => {
                                                setSelectedId(id);
                                                setShowSidebarDrawer(false);
                                            }}
                                            onReorder={handleReorderElement}
                                            onDelete={handleDeleteElement}
                                            onAddTemplate={(t) => {
                                                handleApplyTemplate(t);
                                                setShowSidebarDrawer(false);
                                            }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {
                    selectedElement && (
                        <MobilePropertyDeck
                            isOpen={!!activeTab}
                            onClose={() => setActiveTab(null)}
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

                            {activeTab === 'radius' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Corner Radius</span>
                                        <span>{selectedElement.cornerRadius || 0}px</span>
                                    </div>
                                    <Slider
                                        min={0}
                                        max={100}
                                        value={selectedElement.cornerRadius || 0}
                                        onChange={(e) => handleUpdateElement(selectedElement.id, { cornerRadius: Number(e.target.value) })}
                                    />
                                </div>
                            )}

                            {activeTab === 'layers' && (
                                <div className="grid grid-cols-4 gap-2 py-4">
                                    <Button variant="glass" className="flex flex-col gap-2 h-20" onClick={() => handleReorderElement(selectedElement.id, 'front')}>
                                        <ArrowUpToLine size={24} />
                                        <span className="text-[10px] uppercase font-bold text-text-muted">Front</span>
                                    </Button>
                                    <Button variant="glass" className="flex flex-col gap-2 h-20" onClick={() => handleReorderElement(selectedElement.id, 'forward')}>
                                        <ChevronUp size={24} />
                                        <span className="text-[10px] uppercase font-bold text-text-muted">Forward</span>
                                    </Button>
                                    <Button variant="glass" className="flex flex-col gap-2 h-20" onClick={() => handleReorderElement(selectedElement.id, 'backward')}>
                                        <ChevronDown size={24} />
                                        <span className="text-[10px] uppercase font-bold text-text-muted">Back</span>
                                    </Button>
                                    <Button variant="glass" className="flex flex-col gap-2 h-20" onClick={() => handleReorderElement(selectedElement.id, 'back')}>
                                        <ArrowDownToLine size={24} />
                                        <span className="text-[10px] uppercase font-bold text-text-muted">Bottom</span>
                                    </Button>
                                </div>
                            )}
                        </MobilePropertyDeck>
                    )
                }
            </div >
        );
    }
    return (
        <div className={cn(
            "w-full bg-bg font-sans text-text-main transition-all duration-300",
            isNavVisible ? "h-[calc(100vh-6rem)]" : "h-screen"
        )}>
            {/* Compact Mode Sidebar Toggle */}
            {isCompact && (
                <div className="absolute top-4 left-4 z-30">
                    <Button
                        variant="glass"
                        size="sm"
                        onClick={() => setShowSidebarDrawer(true)}
                        className="bg-surface/80 backdrop-blur-md shadow-lg border-border"
                    >
                        <LayoutGridIcon size={20} className="mr-2" />
                        Templates & Layers
                    </Button>
                </div>
            )}

            {/* Floating Sidebar Drawer (Compact Mode) */}
            <AnimatePresence>
                {isCompact && showSidebarDrawer && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSidebarDrawer(false)}
                            className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 bottom-0 w-80 z-50 bg-surface border-r border-border shadow-2xl"
                        >
                            <SidebarContent
                                elements={elements}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                                onReorder={handleReorderElement}
                                onDelete={handleDeleteElement}
                                onAddTemplate={(t) => {
                                    handleApplyTemplate(t);
                                    setShowSidebarDrawer(false);
                                }}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* @ts-expect-error - Group component type definition is missing direction prop in this version */}
            <Group direction="horizontal">
                {/* Desktop Left Sidebar */}
                {!isCompact && showTemplates && (
                    <>
                        <Panel defaultSize="20" minSize="15" maxSize="30" className="bg-surface border-r border-border rounded-l-lg hidden lg:block overflow-hidden shadow-sm z-10">
                            <SidebarContent
                                elements={elements}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                                onReorder={handleReorderElement}
                                onDelete={handleDeleteElement}
                                onAddTemplate={handleApplyTemplate}
                            />
                        </Panel>
                        <Separator className="w-1 bg-border hover:bg-accent/50 transition-colors cursor-col-resize" />
                    </>
                )}

                {/* Center Canvas */}
                <Panel defaultSize="60" minSize="40">
                    <div className="w-full h-full relative flex flex-col">
                        <ThumbnailCanvas
                            ref={stageRef}
                            elements={elements}
                            selectedId={selectedId}
                            onSelect={setSelectedId}
                            onChange={handleUpdateElement}
                            background={background}
                            zoom={zoom}
                            canvasWidth={canvasWidth}
                            canvasHeight={canvasHeight}
                            isTransparent={isTransparent}
                            clipContent={clipContent}
                        />

                        {/* Zoom Controls */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-surface/90 backdrop-blur-md border border-border p-1 rounded-lg shadow-lg z-20">
                            <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(0.1, zoom - 0.1))} title="Zoom Out" className="h-8 w-8 p-0">
                                <ZoomOut size={16} />
                            </Button>
                            <span className="text-xs font-mono w-12 text-center select-none">{Math.round(zoom * 100)}%</span>
                            <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))} title="Zoom In" className="h-8 w-8 p-0">
                                <ZoomIn size={16} />
                            </Button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <Button variant="ghost" size="sm" onClick={() => setZoom(1)} title="Reset Zoom" className="h-8 w-8 p-0">
                                <RotateCcw size={14} />
                            </Button>
                        </div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 shadow-2xl rounded-full">
                            <Toolbar
                                onAddText={() => handleAddElement('text')}
                                onAddShape={(type) => type === 'rect' ? handleAddElement('rect') : handleAddElement('circle')}
                                onUploadImage={handleUploadImage}
                                onOpenTemplates={() => setShowTemplates(!showTemplates)}
                                onExport={handleExport}
                            />
                        </div>
                    </div>
                </Panel>

                <Separator className="w-1 bg-border hover:bg-accent/50 transition-colors cursor-col-resize" />

                {/* Right Properties Panel */}
                <Panel defaultSize="20" minSize="20" maxSize="30" className="bg-surface border-l border-border rounded-r-lg">
                    <PropertiesPanel
                        element={selectedElement}
                        onChange={handleUpdateElement}
                        onDelete={handleDeleteElement}
                        onDuplicate={handleDuplicateElement}
                        onReorder={handleReorderElement}
                        onClose={() => setSelectedId(null)}
                        canvasSettings={{
                            width: canvasWidth,
                            height: canvasHeight,
                            background: background,
                            isTransparent: isTransparent,
                            clipContent: clipContent
                        }}
                        onUpdateCanvas={handleUpdateCanvas}
                    />
                </Panel>
            </Group>

            <AlertModal
                isOpen={showTemplateWarning}
                title="Replace Current Design?"
                description="Applying this template will discard your current work. This action cannot be undone."
                confirmText="Replace"
                cancelText="Cancel"
                variant="warning"
                onConfirm={() => pendingTemplate && confirmApplyTemplate(pendingTemplate)}
                onCancel={() => {
                    setShowTemplateWarning(false);
                    setPendingTemplate(null);
                }}
            />
        </div>
    );
}
