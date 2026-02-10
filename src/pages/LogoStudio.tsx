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

    // Handle Vectorizer Import
    useEffect(() => {
        if (location.state?.importedSVG && canvasRef.current) {
            // Short delay to ensure canvas is ready
            setTimeout(() => {
                canvasRef.current?.addIcon(location.state.importedSVG);
                // Clear state so it doesn't re-add on refresh? 
                // React Router state persists on refresh usually, but clears on navigation.
                // We'll leave it simple for now.
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
