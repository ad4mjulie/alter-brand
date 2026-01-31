"use client"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'

const BRAND_CRIMSON = "#8B0000"
const BRAND_CRIMSON_SOFT = "rgba(139, 0, 0, 0.4)"

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--background)] border border-[var(--panel-border)] p-4 shadow-2xl backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm font-serif text-[var(--foreground)] flex justify-between gap-8">
                        <span className="opacity-60">{entry.name}:</span>
                        <span style={{ color: entry.color || BRAND_CRIMSON }}>{entry.value} {entry.name === 'revenue' ? 'DZD' : ''}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export function SalesChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={BRAND_CRIMSON} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={BRAND_CRIMSON} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="8 8" stroke="var(--panel-border)" vertical={false} opacity={0.3} />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-muted)"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'var(--text-muted)', dy: 10 }}
                        letterSpacing="0.1em"
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'var(--text-muted)', dx: -10 }}
                        tickFormatter={(value) => `${value}`}
                        letterSpacing="0.1em"
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: BRAND_CRIMSON, strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        name="revenue"
                        stroke={BRAND_CRIMSON}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export function OrdersChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="8 8" stroke="var(--panel-border)" vertical={false} opacity={0.3} />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-muted)"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'var(--text-muted)', dy: 10 }}
                        letterSpacing="0.1em"
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'var(--text-muted)', dx: -10 }}
                        letterSpacing="0.1em"
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--foreground)', opacity: 0.05 }} />
                    <Bar
                        dataKey="orders"
                        name="orders"
                        fill="var(--foreground)"
                        radius={[2, 2, 0, 0]}
                        animationDuration={1500}
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export function CategoryPieChart({ data }: { data: any[] }) {
    const COLORS = [BRAND_CRIMSON, '#A1A1A1', '#4A4A4A', '#1A1A1A', '#5B0000']

    return (
        <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                        animationDuration={1800}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] ml-2">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
