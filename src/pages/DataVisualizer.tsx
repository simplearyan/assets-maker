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

export function DataVisualizer() {
    const [activeChartType, setActiveChartType] = useState('bar');
    const [chartData, setChartData] = useState<any>(DEFAULT_DATA.bar);
    const [chartConfig, setChartConfig] = useState<any>({
        title: 'My Awesome Chart',
        titleColor: '#ffffff',
        animationDuration: 1000
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

            {/* Main Stage */}
            <div className="flex-1 flex flex-col relative bg-black/20">
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full h-full max-w-5xl max-h-[800px] bg-surface/20 border border-white/5 rounded-2xl shadow-2xl relative overflow-hidden flex items-center justify-center">
                        <ChartStage
                            type={activeChartType}
                            data={chartData}
                            config={chartConfig}
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <DataEditorPanel
                chartData={chartData}
                chartConfig={chartConfig}
                onUpdateData={setChartData}
                onUpdateConfig={setChartConfig}
            />
        </div>
    );
}
