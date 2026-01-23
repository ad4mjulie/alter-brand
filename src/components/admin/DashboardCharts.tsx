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
const BRAND_SILVER = "#C0C0C0"
const BRAND_CHARCOAL = "#2A2A2A"

export function SalesChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={BRAND_CRIMSON} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={BRAND_CRIMSON} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="var(--foreground)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'var(--text-muted)' }}
                    />
                    <YAxis
                        stroke="var(--foreground)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'var(--text-muted)' }}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--panel-bg)',
                            border: '1px solid var(--panel-border)',
                            borderRadius: '0px',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                        itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={BRAND_CRIMSON}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export function OrdersChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="var(--foreground)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'var(--text-muted)' }}
                    />
                    <YAxis
                        stroke="var(--foreground)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'var(--text-muted)' }}
                    />
                    <Tooltip
                        cursor={{ fill: 'var(--card-bg)', opacity: 0.2 }}
                        contentStyle={{
                            backgroundColor: 'var(--panel-bg)',
                            border: '1px solid var(--panel-border)',
                            borderRadius: '0px',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    />
                    <Bar dataKey="orders" fill="var(--foreground)" radius={[2, 2, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export function CategoryPieChart({ data }: { data: any[] }) {
    const COLORS = [BRAND_CRIMSON, BRAND_SILVER, '#4A4A4A', '#1A1A1A', '#6B0000']

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--panel-bg)',
                            border: '1px solid var(--panel-border)',
                            borderRadius: '0px',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
