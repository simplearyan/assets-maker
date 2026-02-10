import { useState, useRef, useEffect } from 'react';
import { AssetPanel } from '../components/logo/AssetPanel';
import { PropertyPanel } from '../components/logo/PropertyPanel';
import { LogoCanvas, type LogoCanvasRef } from '../components/logo/LogoCanvas';
import { MobileDeck } from '../components/logo/MobileDeck';
import { fabric } from 'fabric';
import { useLocation } from 'react-router-dom';

const GOOGLE_FONTS = [
    'Inter', 'Roboto', 'Playfair Display', 'Montserrat', 'Lora',
    'Open Sans', 'Bebas Neue', 'Pacifico', 'Caveat', 'Oswald',
    'Raleway', 'Merriweather', 'Quicksand', 'Dancing Script',
    'Abril Fatface', 'Righteous', 'Cinzel', 'Orbitron', 'Satisfy', 'Bangers'
];

export function LogoStudio() {
    const canvasRef = useRef<LogoCanvasRef>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
    const [version, setVersion] = useState(0);
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [canvasBg, setCanvasBg] = useState('#ffffff');
    const [isTransparent, setIsTransparent] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const location = useLocation();
    const [isLoaded, setIsLoaded] = useState(false);

    // Persistence Keys
    const PROJECT_KEY = 'kenichi-studio-project';
    const TIME_KEY = 'kenichi-studio-timestamp';

    // Dynamically load Google Fonts
    const loadFont = (fontFamily: string) => {
        if (!GOOGLE_FONTS.includes(fontFamily)) return;
        const fontId = `font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
        if (document.getElementById(fontId)) return;

        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
        document.head.appendChild(link);
    };

    // Auto-Save Effect
    useEffect(() => {
        if (!isLoaded || !canvasRef.current) return;

        const saveProject = () => {
            const data = canvasRef.current?.serialize();
            if (data) {
                localStorage.setItem(PROJECT_KEY, JSON.stringify(data));
                localStorage.setItem(TIME_KEY, Date.now().toString());
            }
        };

        const timeout = setTimeout(saveProject, 1000); // Debounce saves
        return () => clearTimeout(timeout);
    }, [version, canvasBg, isTransparent, dimensions, isLoaded]);

    // Initial Load Logic
    useEffect(() => {
        const loadSaved = () => {
            const savedData = localStorage.getItem(PROJECT_KEY);
            const savedTime = localStorage.getItem(TIME_KEY);

            if (savedData && savedTime) {
                const now = Date.now();
                const diff = now - parseInt(savedTime);
                const oneDay = 24 * 60 * 60 * 1000;

                if (diff < oneDay) {
                    try {
                        const parsed = JSON.parse(savedData);
                        // Restore metadata states
                        setCanvasBg(parsed.metadata.background);
                        setIsTransparent(parsed.metadata.isTransparent);
                        setDimensions({ width: parsed.metadata.width, height: parsed.metadata.height });

                        // Load Canvas Objects after a short delay
                        setTimeout(() => {
                            canvasRef.current?.deserialize(parsed);
                            setIsLoaded(true);
                        }, 100);
                        return;
                    } catch (e) {
                        console.error('Failed to parse saved project', e);
                    }
                }
            }
            setIsLoaded(true);
        };

        if (canvasRef.current) {
            loadSaved();
        }
    }, []);

    // Handle Vectorizer Import
    useEffect(() => {
        if (location.state?.importedSVG && canvasRef.current) {
            // Short delay to ensure canvas is ready
            setTimeout(() => {
                canvasRef.current?.addIcon(location.state.importedSVG);
                window.history.replaceState({}, '');
            }, 500);
        }
    }, [location.state]);

    const handleSelectionChange = (obj: fabric.Object | null) => {
        setSelectedObject(obj);
        setVersion(v => v + 1);
    };

    const handleUpdateProperty = (k: string, v: any) => {
        canvasRef.current?.updateProperty(k, v);
        setVersion(v => v + 1);
    };

    return (
        <div className="h-[calc(100vh-6rem)] w-full flex bg-bg overflow-hidden relative md:p-4 md:gap-4">

            {/* Left: Ingredients (Desktop) */}
            <div className="hidden md:block h-full z-10">
                <AssetPanel
                    onAddShape={(type) => canvasRef.current?.addShape(type)}
                    onAddText={(type) => canvasRef.current?.addText(type)}
                    onAddIcon={(svg) => canvasRef.current?.addIcon(svg)}
                    onAddImage={(url) => canvasRef.current?.addImage(url)}
                />
            </div>

            {/* Center: Workbench */}
            <LogoCanvas
                ref={canvasRef}
                onSelectionChange={handleSelectionChange}
                snapToGrid={snapToGrid}
                canvasBg={canvasBg}
                isTransparent={isTransparent}
                canvasWidth={dimensions.width}
                canvasHeight={dimensions.height}
            />

            {/* Right: Refiner (Desktop) */}
            <div className="hidden md:block h-full z-10">
                <PropertyPanel
                    selectedObject={selectedObject}
                    version={version}
                    onUpdateProperty={handleUpdateProperty}
                    onDelete={() => canvasRef.current?.deleteSelected()}
                    onDuplicate={() => canvasRef.current?.duplicateSelected()}
                    onReorder={(action) => canvasRef.current?.reorderSelected(action)}
                    onAlign={(action) => canvasRef.current?.alignSelected(action)}
                    snapToGrid={snapToGrid}
                    onToggleGrid={() => setSnapToGrid(!snapToGrid)}
                    onExportSVG={() => canvasRef.current?.exportSVG()}
                    onExportPNG={() => canvasRef.current?.exportPNG()}
                    canvasBg={canvasBg}
                    isTransparent={isTransparent}
                    canvasWidth={dimensions.width}
                    canvasHeight={dimensions.height}
                    onUpdateCanvasBg={(color) => {
                        setCanvasBg(color);
                        canvasRef.current?.setBackgroundColor(color);
                    }}
                    onUpdateCanvasTransparency={(transparent) => {
                        setIsTransparent(transparent);
                        canvasRef.current?.setTransparency(transparent);
                    }}
                    onUpdateCanvasDimensions={(w, h) => {
                        setDimensions({ width: w, height: h });
                        canvasRef.current?.setDimensions(w, h);
                    }}
                    fonts={GOOGLE_FONTS}
                    onLoadFont={loadFont}
                    onSaveProject={() => {
                        const data = canvasRef.current?.serialize();
                        if (data) {
                            localStorage.setItem(PROJECT_KEY, JSON.stringify(data));
                            localStorage.setItem(TIME_KEY, Date.now().toString());
                        }
                    }}
                    onClearProject={() => {
                        if (window.confirm('Clear all canvas objects and delete saved memory?')) {
                            localStorage.removeItem(PROJECT_KEY);
                            localStorage.removeItem(TIME_KEY);
                            window.location.reload();
                        }
                    }}
                />
            </div>

            {/* Mobile Contextual Deck */}
            <div className="md:hidden block">
                <MobileDeck
                    selectedObject={selectedObject}
                    canvasRef={canvasRef}
                />
            </div>
        </div>
    );
}
