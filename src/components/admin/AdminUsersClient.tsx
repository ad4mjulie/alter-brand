"use client"

import { useState } from 'react'
import {
    Search,
    User,
    Calendar,
    ShoppingBag,
    Mail,
    ChevronRight,
    X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminUsersClient({ users, lang }: { users: any[], lang: string }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(null)

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">Initiate Directory</h1>
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Observe the members of the Order</p>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--panel-bg)] border border-[var(--panel-border)] pl-12 pr-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors text-xs uppercase tracking-widest"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedUser(user)}
                        className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-6 hover:border-brand-crimson/40 transition-colors cursor-pointer group backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-[var(--background)] border border-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-brand-crimson transition-colors">
                                <User size={20} strokeWidth={1} />
                            </div>
                            <div>
                                <h3 className="font-serif text-[var(--foreground)]">{user.username}</h3>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{user.role}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                <Mail size={14} className="text-[var(--text-muted)] opacity-30" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                <Calendar size={14} className="text-[var(--text-muted)] opacity-30" />
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                <ShoppingBag size={14} className="text-[var(--text-muted)] opacity-30" />
                                {user.orders.length} Order Rituals
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedUser(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-xl bg-[var(--background)] border border-[var(--panel-border)] p-8 shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8 border-b border-[var(--panel-border)] pb-4">
                                <div>
                                    <h2 className="font-serif text-2xl text-[var(--foreground)]">{selectedUser.username}</h2>
                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest leading-none mt-1">{selectedUser.email}</p>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] border-b border-[var(--panel-border)] pb-2">Ritual History</h3>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {selectedUser.orders.length === 0 ? (
                                        <p className="text-xs text-[var(--text-muted)] opacity-50 italic py-8 text-center">No rituals performed yet.</p>
                                    ) : (
                                        selectedUser.orders.map((order: any) => (
                                            <div key={order.id} className="flex justify-between items-center p-3 border border-[var(--panel-border)]/30 bg-[var(--panel-bg)]">
                                                <div>
                                                    <p className="font-mono text-[9px] text-[var(--text-muted)] opacity-60 uppercase tracking-tighter mb-1">#{order.id.split('-')[0]}</p>
                                                    <p className="text-[10px] text-[var(--text-muted)] font-sans">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[var(--foreground)] font-sans text-xs mb-1">{order.total} DZD</p>
                                                    <p className={`text-[8px] uppercase tracking-[0.2em] font-bold ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-[var(--text-muted)] opacity-60'
                                                        }`}>{order.status}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
