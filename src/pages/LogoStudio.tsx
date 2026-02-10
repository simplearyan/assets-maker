import { useState, useRef, useEffect } from 'react';
import { AssetPanel } from '../components/logo/AssetPanel';
import { PropertyPanel } from '../components/logo/PropertyPanel';
import { LogoCanvas, type LogoCanvasRef } from '../components/logo/LogoCanvas';
import { MobileDeck } from '../components/logo/MobileDeck';
import { fabric } from 'fabric';
import { useLocation } from 'react-router-dom';

export function LogoStudio() {
    const canvasRef = useRef<LogoCanvasRef>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
    const [version, setVersion] = useState(0);
    const [snapToGrid, setSnapToGrid] = useState(true);
    const location = useLocation();

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
        <div className="h-[calc(100vh-6rem)] w-full flex bg-bg overflow-hidden relative">

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
