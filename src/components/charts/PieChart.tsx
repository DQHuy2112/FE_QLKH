"use client";

interface PieChartItem {
    label: string;
    percentage: number;
    color: string;
}

interface Segment extends PieChartItem {
    startAngle: number;
    endAngle: number;
}

interface PieChartProps {
    title: string;
    data: PieChartItem[];
}

export default function PieChart({ title, data }: PieChartProps) {
    // ✔ Tính segments không dùng biến mutable → Không lỗi ESLint
    const segments: Segment[] = data.reduce((acc, item) => {
        const prev = acc[acc.length - 1];
        const startAngle = prev ? prev.endAngle : 0;
        const angle = (item.percentage / 100) * 360;
        const endAngle = startAngle + angle;

        acc.push({
            ...item,
            startAngle,
            endAngle,
        });

        return acc;
    }, [] as Segment[]);

    return (
        <div className="flex items-center gap-6 animate-fade-in">
            {/* ==================== PIE CHART ==================== */}
            <div className="relative w-[240px] h-[240px] group flex-shrink-0">
                <svg
                    width="240"
                    height="240"
                    viewBox="0 0 240 240"
                    className="-rotate-90 drop-shadow-2xl"
                    role="img"
                    aria-label={title}
                >
                    {/* Outer glow ring */}
                    <circle
                        cx="120"
                        cy="120"
                        r="125"
                        fill="none"
                        stroke="url(#glow)"
                        strokeWidth="8"
                        opacity="0.2"
                    />

                    {/* Pie segments */}
                    {segments.map((segment, index) => {
                        const r = 120; // radius
                        const start = (segment.startAngle * Math.PI) / 180;
                        const end = (segment.endAngle * Math.PI) / 180;
                        const largeArc = segment.percentage > 50 ? 1 : 0;

                        const x1 = 120 + r * Math.cos(start);
                        const y1 = 120 + r * Math.sin(start);
                        const x2 = 120 + r * Math.cos(end);
                        const y2 = 120 + r * Math.sin(end);

                        return (
                            <g
                                key={index}
                                className="transition-all hover:opacity-90 cursor-pointer"
                            >
                                <path
                                    d={`M 120 120 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                    fill={segment.color}
                                    className="transition-transform hover:scale-105 origin-center"
                                />
                            </g>
                        );
                    })}

                    {/* Center Circle */}
                    <circle
                        cx="120"
                        cy="120"
                        r="42"
                        fill="white"
                        className="drop-shadow-xl"
                    />

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0046ff" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#0b08ab" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* ==================== LABELS ==================== */}
                {segments.map((segment, index) => {
                    const midAngle =
                        ((segment.startAngle + segment.endAngle) / 2 - 90) *
                        (Math.PI / 180);
                    const labelRadius = 85;
                    const x = 120 + labelRadius * Math.cos(midAngle);
                    const y = 120 + labelRadius * Math.sin(midAngle);

                    return (
                        <div
                            key={index}
                            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{
                                left: `${x}px`,
                                top: `${y}px`,
                            }}
                        >
                            <div className="bg-white px-2.5 py-1 rounded-full shadow-xl border-2 border-gray-100">
                                <p className="text-sm font-bold text-gray-800">
                                    {segment.percentage}%
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ==================== LEGEND ==================== */}
            <div className="flex flex-col gap-3">
                <p className="text-base font-bold text-gray-700 mb-1">{title}</p>

                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer group"
                    >
                        <div
                            className="w-7 h-7 rounded-lg shadow-md group-hover:scale-110 transition-transform flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                        />

                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
