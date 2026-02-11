import React from 'react';

interface ArtboardProps {
    children: React.ReactNode;
    width: number;
    height: number;
    zoom: number;
    isExporting?: boolean;
    exportProgress?: number;
    backgroundColor?: string;
}

export function Artboard({
    children,
    width,
    height,
    zoom,
    isExporting = false,
    exportProgress = 0,
    backgroundColor = '#1a1a1a'
}: ArtboardProps) {
    // Stage container fills the available space
    const stageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundColor: '#111',
        backgroundImage: `
            linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
            linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
            linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative' as const,
        cursor: 'default'
    };

    // The actual "Sheet" or "Frame"
    const artboardStyle: React.CSSProperties = {
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: backgroundColor,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        transformOrigin: 'center center',
        transform: `scale(${zoom / 100})`,
        position: 'relative' as const,
        flexShrink: 0,
        transition: isExporting ? 'none' : 'transform 0.15s ease-out',
        zIndex: 1
    };

    return (
        <div className="artboard-stage" style={stageStyle}>
            <div className="artboard-sheet" style={artboardStyle}>
                {children}

                {/* Export Overlay */}
                {isExporting && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            border: '2px solid #3b82f6',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                            pointerEvents: 'none'
                        }}
                    >
                        <div className="flex flex-col items-center bg-black/80 px-6 py-4 rounded-xl border border-blue-500/30 backdrop-blur-md">
                            <div className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                RECORDING...
                            </div>
                            <div className="text-white text-2xl font-mono">
                                {Math.round(exportProgress)}%
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Scale Hint / Status */}
            {!isExporting && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '24px',
                    color: 'rgba(255,255,255,0.3)',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    pointerEvents: 'none'
                }}>
                    {width} x {height} @ {zoom}%
                </div>
            )}
        </div>
    );
}
