import { BarChart3, PieChart, LineChart, Activity, Box } from 'lucide-react';

interface ChartSidebarProps {
    activeChartType: string;
    onSelectChart: (type: string) => void;
}

const CHART_TYPES = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'pie', label: 'Pie Chart', icon: PieChart },
    { id: 'race-bar', label: 'Race Bar (Anim)', icon: Activity },
    { id: 'parliament', label: 'Parliament', icon: Box },
];

export function ChartSidebar({ activeChartType, onSelectChart }: ChartSidebarProps) {
    return (
        <div className="w-64 bg-surface/30 backdrop-blur-xl border-r border-white/5 flex flex-col">
            <div className="p-4 border-b border-white/5">
                <h2 className="font-bold text-lg text-text-main">Charts</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {CHART_TYPES.map((chart) => (
                    <button
                        key={chart.id}
                        onClick={() => onSelectChart(chart.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeChartType === chart.id
                                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                                : 'text-text-muted hover:text-text-main hover:bg-white/5'
                            }`}
                    >
                        <chart.icon size={18} />
                        {chart.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
