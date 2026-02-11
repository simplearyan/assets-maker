import { motion } from 'framer-motion';

interface ParliamentChartProps {
    data: { name: string; count: number; color: string }[];
    config: any;
}

export function ParliamentChart({ data, config: _config }: ParliamentChartProps) {
    // 1. Calculate total seats
    const totalSeats = data.reduce((sum, item) => sum + item.count, 0);

    // 2. Generate seat positions (Simple Semicircle/Arch logic)
    // We want N points distributed in an arch.
    // Rows logic: we can have multiple rows.

    // Simplified Arch Algorithm:
    // Distribute points along concentric semicircles.

    const generateSeats = () => {
        const seats: any[] = [];
        // let currentCount = 0;

        // Configuration
        const rows = 8;
        const radiusStep = 30; // px
        const baseRadius = 100; // px
        const centerX = 300; // px
        const centerY = 350; // px (bottom center of arch)

        // Flatten data into a list of colors (sorted by group)
        const seatColors: string[] = [];
        data.forEach(group => {
            for (let i = 0; i < group.count; i++) seatColors.push(group.color);
        });

        // Generate positions
        // We fill from outer row inwards or inner outwards? Usually inner to outer or vice-versa.
        // Let's do a simple approach: Calculate capacity of each row based on arc length.

        let seatIndex = 0;
        for (let r = 1; r <= rows; r++) {
            const currentRadius = baseRadius + (r * radiusStep);
            const arcLength = Math.PI * currentRadius;
            const seatSpacing = 16; // 15px + gap
            const seatsInRow = Math.floor(arcLength / seatSpacing);

            // Distribute seatsInRow evenly from 0 to PI radians
            const angleStep = Math.PI / (seatsInRow - 1);

            for (let s = 0; s < seatsInRow; s++) {
                if (seatIndex >= totalSeats) break;

                const angle = Math.PI - (s * angleStep); // Start from left (PI) to right (0)
                const x = centerX + currentRadius * Math.cos(angle);
                const y = centerY - currentRadius * Math.sin(angle); // Canvas Y is inverted

                seats.push({
                    id: `seat-${seatIndex}`,
                    x,
                    y,
                    color: seatColors[seatIndex] || '#ccc',
                    delay: seatIndex * 0.005 // Staggered delay
                });
                seatIndex++;
            }
        }
        return seats;
    };

    const seats = generateSeats();

    return (
        <div className="w-[600px] h-[400px] relative flex items-center justify-center">
            <svg width="600" height="400" className="overflow-visible">
                {seats.map((seat) => (
                    <motion.circle
                        key={seat.id}
                        cx={seat.x}
                        cy={seat.y}
                        r={6}
                        fill={seat.color}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: seat.delay,
                            type: 'spring',
                            stiffness: 200
                        }}
                        whileHover={{ scale: 1.5, zIndex: 10 }}
                    />
                ))}
            </svg>
            {/* Center Stats */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <h2 className="text-4xl font-bold text-white mb-2">{totalSeats}</h2>
                <p className="text-sm text-text-muted">Total Seats</p>
                <div className="flex justify-center gap-4 mt-4">
                    {data.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="w-3 h-3 rounded-full" style={{ background: d.color }}></span>
                            {d.name} ({d.count})
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
