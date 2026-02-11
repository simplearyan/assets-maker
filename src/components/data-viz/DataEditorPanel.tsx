import { useState, useEffect } from 'react';
// import { Button } from '../ui/Button'; 

interface DataEditorPanelProps {
    chartData: any;
    chartConfig: any;
    onUpdateData: (data: any) => void;
    onUpdateConfig: (config: any) => void;
}

export function DataEditorPanel({ chartData, chartConfig, onUpdateData, onUpdateConfig }: DataEditorPanelProps) {
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

    return (
        <div className="w-80 bg-surface/30 backdrop-blur-xl border-l border-white/5 flex flex-col h-full">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-bold text-lg text-text-main">Data Editor</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
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

                {/* Basic Config (Example) */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Quick Config
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
                    </div>
                </div>
            </div>
        </div>
    );
}
