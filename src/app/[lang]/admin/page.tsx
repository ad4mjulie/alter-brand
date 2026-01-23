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

export default async function AdminDashboard() {
    const stats = await getAdminStats()

    if ('error' in stats) {
        return <div className="text-brand-crimson">{stats.error}</div>
    }

    const cards = [
        { label: 'Total Revenue', value: `${stats.totalRevenue.toLocaleString()} DZD`, icon: Wallet, color: 'text-green-500' },
        { label: 'Orders Received', value: stats.orderCount, icon: ShoppingBag, color: 'text-blue-500' },
        { label: 'Stock Alerts', value: stats.lowStockCount, icon: AlertTriangle, color: stats.lowStockCount > 0 ? 'text-brand-crimson' : 'text-brand-silver/40' },
        { label: 'Active Users', value: stats.userCount, icon: Users, color: 'text-purple-500' },
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
                    return (
                        <div key={i} className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 bg-[var(--background)] border border-[var(--panel-border)] ${card.color}`}>
                                    <Icon size={20} strokeWidth={1} />
                                </div>
                            </div>
                            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">{card.label}</p>
                            <h3 className="text-2xl font-serif text-[var(--foreground)]">{card.value}</h3>
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
                    <h2 className="font-serif text-xl text-[var(--foreground)] mb-6">Latest Rituals</h2>
                    <div className="space-y-4">
                        <p className="text-xs text-brand-silver/40 italic">Coming soon: A deeper look into the void...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
