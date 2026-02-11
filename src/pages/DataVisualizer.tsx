import { useState } from 'react';
import { ChartSidebar } from '../components/data-viz/ChartSidebar';
import { ChartStage } from '../components/data-viz/ChartStage';
import { DataEditorPanel } from '../components/data-viz/DataEditorPanel';
import { DataVizBottomBar } from '../components/data-viz/DataVizBottomBar';
import { useUIStore } from '../store/uiStore';
import { cn } from '../lib/utils';

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

export function DataVisualizer() {
    const [activeChartType, setActiveChartType] = useState('bar');
    const [chartData, setChartData] = useState<any>(DEFAULT_DATA.bar);
    const { isNavVisible } = useUIStore();

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

    return (
        <div className={cn(
            "w-full bg-bg overflow-hidden text-text-main flex flex-row transition-all duration-300 md:p-4 md:gap-4",
            isNavVisible ? "h-[calc(100vh-6rem)]" : "h-screen"
        )}>
            {/* Left Panel: Sidebar */}
            <div className="hidden md:flex flex-col h-full z-10 w-72 shrink-0 rounded-3xl bg-surface/30 backdrop-blur-xl border border-white/5 overflow-hidden">
                <ChartSidebar
                    activeChartType={activeChartType}
                    onSelectChart={handleChartTypeChange}
                />
            </div>

            {/* Center Panel: Stage */}
            <div className="flex-1 h-full min-w-0 flex flex-col relative bg-[#0a0a0a]/50 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                {/* Viewport */}
                <div className="flex-1 overflow-auto flex items-center justify-center p-8 custom-scrollbar">
                    <div
                        className="bg-surface shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all duration-200 ease-out border border-white/5"
                        style={{
                            width: canvasConfig.width,
                            height: canvasConfig.height,
                            transform: `scale(${canvasConfig.zoom})`,
                            transformOrigin: 'center center',
                            flexShrink: 0
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

                {/* Floating Bottom Bar (Internal to center stage) */}
                <DataVizBottomBar
                    zoom={canvasConfig.zoom}
                    onZoomChange={(z) => setCanvasConfig(prev => ({ ...prev, zoom: z }))}
                />
            </div>

            {/* Right Panel: Editor */}
            <div className="hidden md:flex flex-col h-full z-10 w-80 shrink-0 rounded-3xl bg-surface/30 backdrop-blur-xl border border-white/5 overflow-hidden">
                <DataEditorPanel
                    chartData={chartData}
                    chartConfig={chartConfig}
                    canvasConfig={canvasConfig}
                    onUpdateData={setChartData}
                    onUpdateConfig={setChartConfig}
                    onUpdateCanvasConfig={setCanvasConfig}
                />
            </div>
        </div>
    );
}
