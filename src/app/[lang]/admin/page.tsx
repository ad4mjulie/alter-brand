import { getAdminStats } from '@/app/actions/admin'
import {
    ShoppingBag,
    Wallet,
    Users,
    AlertTriangle,
    BarChart3,
    PieChart as PieChartIcon,
    History
} from 'lucide-react'
import { SalesChart, OrdersChart, CategoryPieChart } from '@/components/admin/DashboardCharts'

export default async function AdminDashboard({ params }: { params: { lang: string } }) {
    const { lang } = params
    const stats = await getAdminStats()

    if ('error' in stats) {
        return <div className="text-brand-crimson">{stats.error}</div>
    }

    const cards = [
        {
            label: 'Total Revenue',
            value: `${stats.totalRevenue.toLocaleString()} DZD`,
            subValue: `Avg. ${Math.round(stats.averageOrderValue).toLocaleString()} per order`,
            icon: Wallet,
            color: 'text-green-500',
            trend: stats.revenueTrend,
            link: `/${lang}/admin/orders`,
            actionLabel: 'View Ledger'
        },
        {
            label: 'Orders Received',
            value: stats.orderCount,
            icon: ShoppingBag,
            color: 'text-blue-500',
            trend: stats.orderTrend,
            link: `/${lang}/admin/orders`,
            actionLabel: 'Process Orders'
        },
        {
            label: 'Stock Alerts',
            value: stats.lowStockCount,
            icon: AlertTriangle,
            color: stats.lowStockCount > 0 ? 'text-brand-crimson' : 'text-brand-silver/40',
            trend: stats.lowStockCount > 0 ? -1 : 0, // Negative for stock alerts is bad
            link: `/${lang}/admin/products?filter=low-stock`,
            actionLabel: 'Restock'
        },
        {
            label: 'Active Users',
            value: stats.userCount,
            icon: Users,
            color: 'text-purple-500',
            link: `/${lang}/admin/users`,
            actionLabel: 'View Initiates'
        },
    ]

    return (
        <div className="space-y-12">
            <div>
                <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">Sanctum Dashboard</h1>
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Oversee the ritual's progress</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => {
                    const Icon = card.icon
                    const trend = card.trend
                    return (
                        <div key={i} className="group relative bg-[var(--panel-bg)] border border-[var(--panel-border)] p-6 backdrop-blur-md overflow-hidden hover:border-brand-crimson/50 transition-all duration-500">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-3 bg-[var(--background)] border border-[var(--panel-border)] ${card.color} group-hover:scale-110 transition-transform`}>
                                    <Icon size={20} strokeWidth={1.5} />
                                </div>
                                {trend !== undefined && trend !== 0 && (
                                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">{card.label}</p>
                                <h3 className="text-2xl font-serif text-[var(--foreground)]">{card.value}</h3>
                                {card.subValue && <p className="text-[9px] text-[var(--text-muted)] italic">{card.subValue}</p>}
                            </div>

                            <a
                                href={card.link}
                                className="mt-6 flex items-center justify-between group/link text-[9px] uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-colors border-t border-[var(--panel-border)] pt-4"
                            >
                                <span>{card.actionLabel}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-crimson opacity-0 group-hover/link:opacity-100 transition-opacity shadow-[0_0_8px_#f00]" />
                            </a>

                            {/* Background Glow */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-crimson/5 rounded-full blur-3xl group-hover:bg-brand-crimson/10 transition-colors" />
                        </div>
                    )
                })}
            </div>

            {/* Visualizations Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[var(--panel-bg)] border border-[var(--panel-border)] p-8 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="text-brand-crimson" size={20} />
                            <h2 className="font-serif text-xl text-[var(--foreground)]">Financial Flux</h2>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Last 7 Days</p>
                    </div>
                    <SalesChart data={stats.dailyStats} />
                </div>

                <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <PieChartIcon className="text-brand-crimson" size={20} />
                        <h2 className="font-serif text-xl text-[var(--foreground)]">Artifact Distribution</h2>
                    </div>
                    <CategoryPieChart data={stats.categoryStats} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <History className="text-[var(--text-muted)]" size={20} />
                        <h2 className="font-serif text-xl text-[var(--foreground)]">Temporal Orders</h2>
                    </div>
                    <OrdersChart data={stats.dailyStats} />
                </div>

                <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-serif text-xl text-[var(--foreground)]">Latest Rituals</h2>
                        <a href={`/${lang}/admin/orders`} className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-colors">Manifest All</a>
                    </div>
                    <div className="space-y-6">
                        {stats.latestOrders && stats.latestOrders.length > 0 ? (
                            stats.latestOrders.map((order: any) => (
                                <div key={order.id} className="group relative flex items-center justify-between py-3 border-b border-[var(--panel-border)]/50 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-xs font-serif text-[var(--foreground)]">{order.fullName}</p>
                                        <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-mono">
                                            <span>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="text-brand-crimson/40 opacity-40">|</span>
                                            <span>{new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-[var(--foreground)]">{order.total.toLocaleString()} DZD</p>
                                        <p className={`text-[8px] uppercase tracking-tighter ${order.status === 'DELIVERED' ? 'text-green-500' :
                                                order.status === 'PENDING' ? 'text-orange-500' : 'text-brand-crimson'
                                            }`}>{order.status}</p>
                                    </div>

                                    {/* Hover Indicator */}
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-0 bg-brand-crimson group-hover:h-1/2 transition-all duration-300" />
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-brand-silver/40 italic">The void is silent...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
