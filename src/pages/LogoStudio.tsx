import { useState, useRef } from 'react';
import { AssetPanel } from '../components/logo/AssetPanel';
import { PropertyPanel } from '../components/logo/PropertyPanel';
import { LogoCanvas, type LogoCanvasRef } from '../components/logo/LogoCanvas';
import { MobileDeck } from '../components/logo/MobileDeck';
import { fabric } from 'fabric';

export function LogoStudio() {
    const canvasRef = useRef<LogoCanvasRef>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

    return (
        <div className="h-[calc(100vh-6rem)] w-full flex bg-bg overflow-hidden relative">

            {/* Left: Ingredients (Desktop) */}
            <div className="hidden md:block h-full z-10">
                <AssetPanel
                    onAddShape={(type) => canvasRef.current?.addShape(type)}
                    onAddText={(type) => canvasRef.current?.addText(type)}
                    onAddIcon={(svg) => canvasRef.current?.addIcon(svg)}
                />
            </div>

            {/* Center: Workbench */}
            <LogoCanvas
                ref={canvasRef}
                onSelectionChange={setSelectedObject}
            />

            {/* Right: Refiner (Desktop) */}
            <div className="hidden md:block h-full z-10">
                <PropertyPanel
                    selectedObject={selectedObject}
                    onUpdateProperty={(k, v) => canvasRef.current?.updateProperty(k, v)}
                    onDelete={() => canvasRef.current?.deleteSelected()}
                    onDuplicate={() => canvasRef.current?.duplicateSelected()}
                    onReorder={(action) => canvasRef.current?.reorderSelected(action)}
                    onAlign={(action) => canvasRef.current?.alignSelected(action)}
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
