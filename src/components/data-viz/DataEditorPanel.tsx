import { useState, useEffect } from 'react';
// import { Button } from '../ui/Button'; 

interface DataEditorPanelProps {
    chartData: any;
    chartConfig: any;
    canvasConfig: any;
    onUpdateData: (data: any) => void;
    onUpdateConfig: (config: any) => void;
    onUpdateCanvasConfig: (config: any) => void;
}

export function DataEditorPanel({ chartData, chartConfig, canvasConfig, onUpdateData, onUpdateConfig, onUpdateCanvasConfig }: DataEditorPanelProps) {
    const [jsonText, setJsonText] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setJsonText(JSON.stringify(chartData, null, 2));
    }, [chartData]);

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setJsonText(text);
        try {
            const parsed = JSON.parse(text);
            onUpdateData(parsed);
            setError(null);
        } catch (err) {
            setError('Invalid JSON');
        }
    };

    const handlePaddingChange = (key: string, value: number) => {
        onUpdateCanvasConfig({
            ...canvasConfig,
            padding: { ...canvasConfig.padding, [key]: value }
        });
    };

    return (
        <div className="w-full h-full bg-surface/30 backdrop-blur-xl border-l border-white/5 flex flex-col">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-lg text-text-main">Data Editor</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                {/* Canvas Settings */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Canvas Settings
                    </label>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-text-muted">Aspect Ratio</label>
                            <select
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-text-main focus:border-accent outline-none"
                                onChange={(e) => {
                                    const [w, h] = e.target.value.split('x').map(Number);
                                    onUpdateCanvasConfig({ ...canvasConfig, width: w, height: h });
                                }}
                                value={`${canvasConfig.width}x${canvasConfig.height}`}
                            >
                                <option value="1920x1080">16:9 (1920x1080)</option>
                                <option value="1080x1920">9:16 (1080x1920)</option>
                                <option value="1080x1080">1:1 (1080x1080)</option>
                                <option value="1600x1200">4:3 (1600x1200)</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-text-muted">Canvas Background</label>
                            <input
                                type="color"
                                className="w-full h-8 bg-transparent border border-white/10 rounded cursor-pointer"
                                value={canvasConfig.backgroundColor || '#1a1a1a'}
                                onChange={(e) => onUpdateCanvasConfig({ ...canvasConfig, backgroundColor: e.target.value })}
                            />
                        </div>
                        <div className="text-[10px] text-text-muted text-right">
                            {canvasConfig.width} x {canvasConfig.height} px
                        </div>
                    </div>
                </div>

                {/* Basic Config */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Chart Styling
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-text-muted">Title Color</label>
                            <input
                                type="color"
                                className="w-full h-8 bg-transparent border border-white/10 rounded cursor-pointer"
                                value={chartConfig.titleColor || '#ffffff'}
                                onChange={(e) => onUpdateConfig({ ...chartConfig, titleColor: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] text-text-muted">Fill Color</label>
                            <input
                                type="color"
                                className="w-full h-8 bg-transparent border border-white/10 rounded cursor-pointer"
                                value={chartConfig.fillColor || '#3b82f6'}
                                onChange={(e) => onUpdateConfig({ ...chartConfig, fillColor: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Padding / Sizing */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Chart Margins (Resize)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {['top', 'right', 'bottom', 'left'].map(side => (
                            <div key={side} className="flex flex-col gap-1">
                                <label className="text-[10px] text-text-muted capitalize">{side}</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-text-main focus:border-accent outline-none"
                                    value={canvasConfig.padding?.[side] || 0}
                                    onChange={(e) => handlePaddingChange(side, parseInt(e.target.value) || 0)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* JSON Data Editor */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        JSON Data
                    </label>
                    <textarea
                        value={jsonText}
                        onChange={handleJsonChange}
                        className={`w-full h-64 bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-xs font-mono text-text-main focus:outline-none focus:border-accent resize-none`}
                    />
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>

            </div>
        </div>
    );
}
