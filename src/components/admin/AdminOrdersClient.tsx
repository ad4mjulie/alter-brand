"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Filter,
    ChevronDown,
    Package,
    Truck,
    CheckCircle,
    Clock,
    Download,
    ExternalLink,
    X
} from 'lucide-react'
import { updateOrderStatus } from '@/app/actions/admin'

export default function AdminOrdersClient({ orders, lang }: { orders: any[], lang: string }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [selectedOrder, setSelectedOrder] = useState<any>(null)

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        const res = await updateOrderStatus(orderId, newStatus)
        if (res.error) alert(res.error)
        else setSelectedOrder((prev: any) => prev ? { ...prev, status: newStatus } : null)
    }

    const statuses = ["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">Order Rituals</h1>
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Manage the flow of physical artifacts</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--panel-bg)] border border-[var(--panel-border)] pl-12 pr-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors text-xs uppercase tracking-widest"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {statuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all ${statusFilter === status
                                ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                                : 'bg-transparent text-[var(--text-muted)] border-[var(--panel-border)] hover:border-[var(--text-muted)]'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--panel-border)] text-[var(--text-muted)] text-[10px] uppercase tracking-[0.2em]">
                            <th className="py-4 px-6 font-normal">Order ID</th>
                            <th className="py-4 px-6 font-normal">Client</th>
                            <th className="py-4 px-6 font-normal">Date</th>
                            <th className="py-4 px-6 font-normal">Total</th>
                            <th className="py-4 px-6 font-normal">Status</th>
                            <th className="py-4 px-6 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--panel-border)]/50">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-[var(--panel-bg)] transition-colors">
                                <td className="py-4 px-6 font-mono text-[10px] text-[var(--text-muted)] opacity-60">
                                    #{order.id.split('-')[0].toUpperCase()}
                                </td>
                                <td className="py-4 px-6 text-xs text-[var(--foreground)]">
                                    {order.fullName}
                                </td>
                                <td className="py-4 px-6 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-6 text-xs text-[var(--foreground)] font-sans">
                                    {order.total} DZD
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`text-[9px] uppercase tracking-widest px-2 py-1 border ${order.status === 'DELIVERED' ? 'border-green-500/50 text-green-600 bg-green-500/5' :
                                        order.status === 'SHIPPED' ? 'border-blue-500/50 text-blue-600 bg-blue-500/5' :
                                            order.status === 'PENDING' ? 'border-brand-crimson/50 text-brand-crimson bg-brand-crimson/5' :
                                                'border-[var(--text-muted)]/20 text-[var(--text-muted)]'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                                    >
                                        <ExternalLink size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl bg-[var(--background)] border border-[var(--panel-border)] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8 border-b border-[var(--panel-border)] pb-4">
                                <div>
                                    <h2 className="font-serif text-2xl text-[var(--foreground)]">Order Details</h2>
                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">#{selectedOrder.id}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Shipping Information</h3>
                                    <div className="text-xs text-[var(--foreground)]/80 space-y-1 font-sans">
                                        <p className="font-bold text-[var(--foreground)]">{selectedOrder.fullName}</p>
                                        <p>{selectedOrder.address}</p>
                                        <p>{selectedOrder.city}, {selectedOrder.wilaya}</p>
                                        <p className="pt-2 text-[var(--text-muted)]">{selectedOrder.phoneNumber}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Status Control</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                                                className={`py-2 text-[9px] uppercase tracking-widest border transition-all ${selectedOrder.status === s
                                                    ? 'bg-brand-crimson text-white border-brand-crimson'
                                                    : 'border-[var(--panel-border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-[var(--panel-border)] pb-2">Artifacts</h3>
                                {selectedOrder.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-xs">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-8 h-10 bg-[var(--panel-bg)] border border-[var(--panel-border)] flex items-center justify-center">
                                                <Package size={14} className="text-[var(--text-muted)]/20" />
                                            </div>
                                            <div>
                                                <p className="text-[var(--foreground)] font-serif">{item.name}</p>
                                                <p className="text-[9px] text-[var(--text-muted)] uppercase">{item.size} • {item.quantity} QTY</p>
                                            </div>
                                        </div>
                                        <p className="text-[var(--foreground)] font-sans">{item.price * item.quantity} DZD</p>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-4 border-t border-[var(--panel-border)] font-serif text-lg text-[var(--foreground)]">
                                    <span>Total</span>
                                    <span className="text-brand-crimson">{selectedOrder.total} DZD</span>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="w-full flex items-center justify-center gap-2 border border-[var(--panel-border)] py-3 text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--panel-bg)] transition-all"
                            >
                                <Download size={14} />
                                Download Manifest
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
