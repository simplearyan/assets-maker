import { useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { ParliamentChart } from './custom-charts/ParliamentChart';

interface ChartStageProps {
    type: string;
    data: any;
    config: any;
    padding?: { top: number; right: number; bottom: number; left: number };
    currentTime?: number;
    duration?: number;
}

export function ChartStage({ type, data, config, padding, currentTime = 0, duration = 5000 }: ChartStageProps) {
    const echartRef = useRef<any>(null);

    // --- RENDER ---
    const containerStyle = {
        width: '100%',
        height: '100%',
        paddingTop: padding?.top || 0,
        paddingRight: padding?.right || 0,
        paddingBottom: padding?.bottom || 0,
        paddingLeft: padding?.left || 0,
        boxSizing: 'border-box' as const
    };

    if (type === 'parliament') {
        return (
            <div style={containerStyle} className="flex items-center justify-center">
                <ParliamentChart data={data} config={config} currentTime={currentTime} duration={duration} />
            </div>
        );
    }

    // Default ECharts Options
    const getOption = () => {
        if (type === 'race-bar') {
            const categories = ['A', 'B', 'C', 'D', 'E'];
            // Interpolate values based on currentTime
            const progress = currentTime / duration;
            const currentValues = [10, 20, 30, 40, 50].map(v => v + progress * 100);

            return {
                xAxis: { max: 'dataMax' },
                yAxis: {
                    type: 'category',
                    data: categories,
                    inverse: true,
                    animationDuration: 300,
                    animationDurationUpdate: 300,
                },
                series: [{
                    realtimeSort: true,
                    name: 'Race',
                    type: 'bar',
                    data: currentValues,
                    label: { show: true, position: 'right', valueAnimation: true },
                    itemStyle: {
                        color: (param: any) => {
                            const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
                            return colors[param.dataIndex % colors.length];
                        }
                    }
                }],
                animation: false // Disable e-charts internal animation to sync with our playback
            };
        }

        // Basic Charts
        return {
            title: {
                text: config.title,
                textStyle: { color: config.titleColor },
                left: 'center'
            },
            tooltip: { trigger: 'axis' },
            legend: { textStyle: { color: '#ccc' }, top: 30 },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: type === 'bar' || type === 'line' ? {
                type: 'category',
                data: data.categories || [],
                axisLabel: { color: '#ccc' }
            } : {},
            yAxis: type === 'bar' || type === 'line' ? {
                type: 'value',
                axisLabel: { color: '#ccc' }
            } : {},
            series: data.series ? data.series.map((s: any) => ({
                ...s,
                type: type, // Force type from prop
                smooth: true,
                itemStyle: { color: config.fillColor || undefined }
            })) : []
        };
    };

    return (
        <div style={containerStyle}>
            <ReactECharts
                ref={echartRef}
                option={getOption()}
                style={{ width: '100%', height: '100%' }}
                theme="dark" // Or custom
                opts={{ renderer: 'canvas' }} // Use canvas for easier video capture
            />
        </div>
    );
}
