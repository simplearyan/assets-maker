import { useState } from 'react';
import { ChartSidebar } from '../components/data-viz/ChartSidebar';
import { ChartStage } from '../components/data-viz/ChartStage';
import { DataEditorPanel } from '../components/data-viz/DataEditorPanel';
import { DataVizBottomBar } from '../components/data-viz/DataVizBottomBar';

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
        <div className="h-screen w-full flex bg-bg overflow-hidden text-text-main">
            {/* Sidebar */}
            <ChartSidebar
                activeChartType={activeChartType}
                onSelectChart={handleChartTypeChange}
            />

            {/* Main Stage Area */}
            <div className="flex-1 flex flex-col relative bg-[#111] overflow-hidden">

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

                {/* Floating Bottom Bar */}
                <DataVizBottomBar
                    zoom={canvasConfig.zoom}
                    onZoomChange={(z) => setCanvasConfig(prev => ({ ...prev, zoom: z }))}
                />
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
