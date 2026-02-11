import { useState } from 'react';
import { ChartSidebar } from '../components/data-viz/ChartSidebar';
import { ChartStage } from '../components/data-viz/ChartStage';
import { DataEditorPanel } from '../components/data-viz/DataEditorPanel';

// Default Data Sets
const DEFAULT_DATA = {
    bar: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [{ name: 'Sales', data: [120, 200, 150, 80, 70, 110, 130] }]
    },
    pie: {
        series: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
        ]
    },
    parliament: [
        { name: 'Party A', count: 120, color: '#FF5733' },
        { name: 'Party B', count: 80, color: '#33FF57' },
        { name: 'Party C', count: 45, color: '#3357FF' },
        { name: 'Ind', count: 15, color: '#F3FF33' }
    ]
};

const ASPECT_RATIOS = [
    { label: '16:9 (1920x1080)', width: 1920, height: 1080 },
    { label: '9:16 (1080x1920)', width: 1080, height: 1920 },
    { label: '1:1 (1080x1080)', width: 1080, height: 1080 },
    { label: '4:3 (1600x1200)', width: 1600, height: 1200 },
];

export function DataVisualizer() {
    const [activeChartType, setActiveChartType] = useState('bar');
    const [chartData, setChartData] = useState<any>(DEFAULT_DATA.bar);

    // Canvas & Chart Config
    const [canvasConfig, setCanvasConfig] = useState({
        width: 1920,
        height: 1080,
        zoom: 0.5,
        padding: { top: 40, right: 40, bottom: 40, left: 40 }
    });

    const [chartConfig, setChartConfig] = useState<any>({
        title: 'My Awesome Chart',
        titleColor: '#ffffff',
        animationDuration: 1000,
        fillColor: '#3b82f6', // For single color charts
    });

    const handleChartTypeChange = (type: string) => {
        setActiveChartType(type);
        // Reset data based on type (simplified)
        if (type === 'pie') setChartData(DEFAULT_DATA.pie);
        else if (type === 'parliament') setChartData(DEFAULT_DATA.parliament);
        else setChartData(DEFAULT_DATA.bar);
    };

    const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [w, h] = e.target.value.split('x').map(Number);
        setCanvasConfig(prev => ({ ...prev, width: w, height: h }));
    };

    return (
        <div className="h-screen w-full flex bg-bg overflow-hidden text-text-main">
            {/* Sidebar */}
            <ChartSidebar
                activeChartType={activeChartType}
                onSelectChart={handleChartTypeChange}
            />

            {/* Main Stage Area */}
            <div className="flex-1 flex flex-col relative bg-black/50 overflow-hidden">
                {/* Toolbar */}
                <div className="h-14 border-b border-white/5 bg-surface/30 backdrop-blur flex items-center px-4 gap-4 justify-between z-10">
                    <div className="flex items-center gap-4">
                        {/* Aspect Ratio Selector */}
                        <select
                            className="bg-black/40 border border-white/10 rounded px-3 py-1 text-xs text-text-main focus:outline-none focus:border-accent"
                            onChange={handleResolutionChange}
                            value={`${canvasConfig.width}x${canvasConfig.height}`}
                        >
                            {ASPECT_RATIOS.map(ar => (
                                <option key={ar.label} value={`${ar.width}x${ar.height}`}>
                                    {ar.label}
                                </option>
                            ))}
                        </select>

                        {/* Zoom Controls */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted">Zoom:</span>
                            <input
                                type="range"
                                min="0.1"
                                max="2"
                                step="0.1"
                                value={canvasConfig.zoom}
                                onChange={(e) => setCanvasConfig(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                                className="w-24"
                            />
                            <span className="text-xs w-8 text-right">{Math.round(canvasConfig.zoom * 100)}%</span>
                        </div>
                    </div>
                    <div className="text-xs text-text-muted">
                        {canvasConfig.width} x {canvasConfig.height} px
                    </div>
                </div>

                {/* Viewport */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-black/20"
                    style={{
                        backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}>

                    <div
                        className="bg-surface border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-200 ease-out"
                        style={{
                            width: canvasConfig.width,
                            height: canvasConfig.height,
                            transform: `scale(${canvasConfig.zoom})`,
                            transformOrigin: 'center center',
                            flexShrink: 0 // Prevent flex shrinking
                        }}
                    >
                        <ChartStage
                            type={activeChartType}
                            data={chartData}
                            config={chartConfig}
                            padding={canvasConfig.padding}
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <DataEditorPanel
                chartData={chartData}
                chartConfig={chartConfig}
                canvasConfig={canvasConfig}
                onUpdateData={setChartData}
                onUpdateConfig={setChartConfig}
                onUpdateCanvasConfig={setCanvasConfig}
            />
        </div>
    );
}
