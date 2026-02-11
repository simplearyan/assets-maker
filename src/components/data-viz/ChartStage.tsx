import { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ParliamentChart } from './custom-charts/ParliamentChart';

interface ChartStageProps {
    type: string;
    data: any;
    config: any;
}

export function ChartStage({ type, data, config }: ChartStageProps) {
    const echartRef = useRef<any>(null);
    const [raceData, setRaceData] = useState<any>(null);

    // --- ANIMATION LOGIC (Race Charts) ---
    useEffect(() => {
        if (type !== 'race-bar') {
            setRaceData(null);
            return;
        }

        // Mock Race Data Generator if not provided
        let timer: any;
        const categories = ['A', 'B', 'C', 'D', 'E'];
        let currentValues = [10, 20, 30, 40, 50];

        const updateRace = () => {
            currentValues = currentValues.map(v => v + Math.random() * 10);

            setRaceData({
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
                            // Assign color based on category index (consistent colors)
                            const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
                            return colors[param.dataIndex % colors.length];
                        }
                    }
                }],
                animationDuration: 0,
                animationDurationUpdate: 3000,
                animationEasing: 'linear',
                animationEasingUpdate: 'linear'
            });
        };

        // Start Loop
        timer = setInterval(updateRace, 3000); // Update every 3s
        updateRace(); // Initial call

        return () => clearInterval(timer);
    }, [type]);


    // --- RENDER ---

    if (type === 'parliament') {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <ParliamentChart data={data} config={config} />
            </div>
        );
    }

    // Default ECharts Options
    const getOption = () => {
        if (type === 'race-bar' && raceData) return raceData;

        // Basic Charts
        return {
            title: {
                text: config.title,
                textStyle: { color: config.titleColor }
            },
            tooltip: { trigger: 'axis' },
            legend: { textStyle: { color: '#ccc' } },
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
                smooth: true
            })) : []
        };
    };

    return (
        <ReactECharts
            ref={echartRef}
            option={getOption()}
            style={{ width: '100%', height: '100%' }}
            theme="dark" // Or custom
            opts={{ renderer: 'svg' }}
        />
    );
}
