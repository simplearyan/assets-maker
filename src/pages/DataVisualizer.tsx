import { useState, useRef } from 'react';
import { ChartSidebar } from '../components/data-viz/ChartSidebar';
import { ChartStage } from '../components/data-viz/ChartStage';
import { DataEditorPanel } from '../components/data-viz/DataEditorPanel';
import { DataVizBottomBar } from '../components/data-viz/DataVizBottomBar';
import { ExportPanel, type ExportConfig } from '../components/data-viz/ExportPanel';
import { useUIStore } from '../store/uiStore';
import { cn } from '../lib/utils';
import { useChartPlayback } from '../hooks/useChartPlayback';
import { Settings, Download } from 'lucide-react';
import { Artboard } from '../components/data-viz/Artboard';
import { ExportEngine } from '../utils/ExportEngine';
import html2canvas from 'html2canvas';

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
    const [activeTab, setActiveTab] = useState<'editor' | 'export'>('editor');
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const stageRef = useRef<HTMLDivElement>(null);
    const captureStageRef = useRef<HTMLDivElement>(null);
    const [exportResolution, setExportResolution] = useState({ width: 1920, height: 1080 });

    // Playback Controller
    const playback = useChartPlayback(5000); // 5s default animation

    // Canvas & Chart Config
    const [canvasConfig, setCanvasConfig] = useState({
        width: 1920,
        height: 1080,
        zoom: 0.5,
        padding: { top: 40, right: 40, bottom: 40, left: 40 }
    });

    const [chartConfig, setChartConfig] = useState<any>({
        title: 'Sales Trends',
        titleColor: '#ffffff',
        fillColor: '#3b82f6', // For single color charts
    });

    const handleExportVideo = async (config: ExportConfig) => {
        if (!captureStageRef.current) return;

        setIsExporting(true);
        setExportProgress(0);
        setExportResolution({ width: config.resolution.width, height: config.resolution.height });

        try {
            const blob = await ExportEngine.exportVideo({
                element: captureStageRef.current,
                duration: playback.duration,
                fps: config.fps,
                width: config.resolution.width,
                height: config.resolution.height,
                format: config.format,
                onProgress: setExportProgress,
                seek: playback.seek
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `kenichi-viz-${activeChartType}-${config.resolution.width}x${config.resolution.height}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Export failed:", err);
            alert("Export failed: " + (err as Error).message);
        } finally {
            setIsExporting(false);
            setExportProgress(0);
        }
    };

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
                <div className="flex-1 overflow-auto custom-scrollbar">
                    <Artboard
                        width={canvasConfig.width}
                        height={canvasConfig.height}
                        zoom={canvasConfig.zoom * 100}
                        isExporting={isExporting}
                        exportProgress={exportProgress}
                    >
                        <div ref={stageRef} className="w-full h-full relative overflow-hidden">
                            <ChartStage
                                type={activeChartType}
                                data={chartData}
                                config={chartConfig}
                                padding={canvasConfig.padding}
                                currentTime={playback.currentTime}
                                duration={playback.duration}
                            />
                        </div>
                    </Artboard>
                </div>

                {/* Floating Bottom Bar (Internal to center stage) */}
                <DataVizBottomBar
                    zoom={canvasConfig.zoom}
                    onZoomChange={(z) => setCanvasConfig(prev => ({ ...prev, zoom: z }))}
                    playback={playback}
                    onExport={() => setActiveTab('export')}
                />
            </div>

            {/* Right Panel: Editor / Export */}
            <div className="hidden md:flex flex-col h-full z-10 w-80 shrink-0 rounded-3xl bg-surface/30 backdrop-blur-xl border border-white/5 overflow-hidden">
                {/* Tab Triggers */}
                <div className="flex border-b border-white/5 bg-black/20 p-1 m-2 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                            activeTab === 'editor' ? "bg-white/10 text-white shadow-sm" : "text-text-muted hover:text-white"
                        )}
                    >
                        <Settings size={14} />
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('export')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all",
                            activeTab === 'export' ? "bg-white/10 text-white shadow-sm" : "text-text-muted hover:text-white"
                        )}
                    >
                        <Download size={14} />
                        Export
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    {activeTab === 'editor' ? (
                        <DataEditorPanel
                            chartData={chartData}
                            chartConfig={chartConfig}
                            canvasConfig={canvasConfig}
                            onUpdateData={setChartData}
                            onUpdateConfig={setChartConfig}
                            onUpdateCanvasConfig={setCanvasConfig}
                        />
                    ) : (
                        <ExportPanel
                            onExportVideo={handleExportVideo}
                            onExportImage={async (format) => {
                                if (!stageRef.current) return;
                                if (format === 'png') {
                                    const canvas = await html2canvas(stageRef.current, {
                                        backgroundColor: null,
                                        useCORS: true
                                    });
                                    const dataUrl = canvas.toDataURL('image/png');
                                    const a = document.createElement('a');
                                    a.href = dataUrl;
                                    a.download = `kenichi-viz-${activeChartType}.png`;
                                    a.click();
                                } else {
                                    alert("SVG export is not yet supported for custom DOM charts. Use PNG or Video Export.");
                                }
                            }}
                            isExporting={isExporting}
                            progress={exportProgress}
                        />
                    )}
                </div>
            </div>

            {/* Hidden Capture Buffer Stage (Off-screen, 1:1 Scale) */}
            <div
                style={{
                    position: 'fixed',
                    left: '-10000px',
                    top: '-10000px',
                    pointerEvents: 'none',
                    zIndex: -1
                }}
            >
                <div
                    ref={captureStageRef}
                    style={{
                        width: isExporting ? exportResolution.width : 1920,
                        height: isExporting ? exportResolution.height : 1080,
                        backgroundColor: '#1a1a1a',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    {/* Resolution sync note: We should ideally use the resolution from the export config here */}
                    {/* For now, let's just make sure it's rendered when isExporting or for safety always */}
                    <ChartStage
                        type={activeChartType}
                        data={chartData}
                        config={chartConfig}
                        padding={canvasConfig.padding}
                        currentTime={playback.currentTime}
                        duration={playback.duration}
                    />
                </div>
            </div>
        </div>
    );
}
