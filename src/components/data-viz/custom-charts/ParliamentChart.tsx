import { motion } from 'framer-motion';

interface ParliamentChartProps {
    data: { name: string; count: number; color: string }[];
    config: any;
    currentTime?: number;
    duration?: number;
}

export function ParliamentChart({ data, config: _config, currentTime = 0, duration = 5000 }: ParliamentChartProps) {
    // 1. Calculate total seats
    const totalSeats = data.reduce((sum, item) => sum + item.count, 0);

    const generateSeats = () => {
        const seats: any[] = [];

        // Configuration
        const rows = 8;
        const radiusStep = 30; // px
        const baseRadius = 100; // px
        const centerX = 400; // px (centered in 800)
        const centerY = 500; // px (bottom center of arch)

        // Flatten data into a list of colors (sorted by group)
        const seatColors: string[] = [];
        data.forEach(group => {
            for (let i = 0; i < group.count; i++) seatColors.push(group.color);
        });

        let seatIndex = 0;
        for (let r = 1; r <= rows; r++) {
            const currentRadius = baseRadius + (r * radiusStep);
            const arcLength = Math.PI * currentRadius;
            const seatSpacing = 16; // 15px + gap
            const seatsInRow = Math.floor(arcLength / seatSpacing);

            const angleStep = Math.PI / (seatsInRow - 1);

            for (let s = 0; s < seatsInRow; s++) {
                if (seatIndex >= totalSeats) break;

                const angle = Math.PI - (s * angleStep);
                const x = centerX + currentRadius * Math.cos(angle);
                const y = centerY - currentRadius * Math.sin(angle);

                // Animation calculation
                // Total duration for all seats to appear is duration
                // Each seat starts at a certain time
                const appearanceStartTime = (seatIndex / totalSeats) * (duration * 0.8); // Appearance finishes by 80% of total duration
                const appearanceDuration = 300; // ms

                let progress = 0;
                if (currentTime >= appearanceStartTime) {
                    progress = Math.min(1, (currentTime - appearanceStartTime) / appearanceDuration);
                }

                seats.push({
                    id: `seat-${seatIndex}`,
                    x,
                    y,
                    color: seatColors[seatIndex] || '#ccc',
                    progress // Scale/Opacity derived from this
                });
                seatIndex++;
            }
        }
        return seats;
    };

    const seats = generateSeats();

    return (
        <div className="w-[800px] h-[600px] relative flex items-center justify-center">
            <svg width="800" height="600" className="overflow-visible">
                {seats.map((seat) => (
                    <circle
                        key={seat.id}
                        cx={seat.x}
                        cy={seat.y}
                        r={6 * seat.progress} // Driven by time
                        fill={seat.color}
                        opacity={seat.progress}
                    />
                ))}
            </svg>
            {/* Center Stats */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <motion.h2
                    className="text-4xl font-bold text-white mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {Math.round(totalSeats * Math.min(1, currentTime / (duration * 0.8)))}
                </motion.h2>
                <p className="text-sm text-text-muted">Total Seats</p>
                <div className="flex justify-center gap-4 mt-4">
                    {data.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="w-3 h-3 rounded-full" style={{ background: d.color }}></span>
                            {d.name} ({Math.round(d.count * Math.min(1, currentTime / (duration * 0.8)))})
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
