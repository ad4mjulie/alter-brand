"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Package, Truck, CreditCard, ShoppingBag, Mail } from 'lucide-react'

export default function OrderConfirmation({ order, dict, lang }: { order: any, dict: any, lang: string }) {
    return (
        <main className="min-h-screen bg-[var(--background)] py-32 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <CheckCircle className="w-16 h-16 text-brand-crimson mx-auto mb-6 opacity-80" strokeWidth={1} />
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-4">
                        {dict.thankYou.replace('{name}', order.fullName)}
                    </h1>
                    <p className="text-[var(--text-muted)] uppercase tracking-[0.2em] text-xs">
                        {dict.successMessage}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 space-y-8"
                    >
                        <div className="bg-[var(--panel-bg)] backdrop-blur-md border border-[var(--panel-border)] p-8 shadow-2xl">
                            <h2 className="font-serif text-xl text-[var(--foreground)] mb-8 flex items-center gap-3">
                                <Package size={20} className="text-brand-crimson" />
                                {dict.summary}
                            </h2>

                            <div className="space-y-6">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-start border-b border-[var(--panel-border)]/50 pb-4">
                                        <div className="flex-1">
                                            <h3 className="text-[var(--foreground)] font-serif">{item.name}</h3>
                                            <div className="flex gap-2 mt-1">
                                                {item.size && <span className="text-[10px] bg-[var(--foreground)]/5 text-[var(--text-muted)] px-2 py-0.5 uppercase tracking-widest">{item.size}</span>}
                                                {item.color && (
                                                    <div className="w-3 h-3 rounded-full border border-[var(--panel-border)]" style={{ backgroundColor: item.color }} />
                                                )}
                                            </div>
                                            <p className="text-[10px] text-[var(--text-muted)] opacity-60 uppercase mt-2">{dict.quantity}: {item.quantity}</p>
                                        </div>
                                        <div className="text-[var(--foreground)] font-sans text-sm">
                                            {item.price * item.quantity} DZD
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 space-y-2">
                                    <div className="flex justify-between text-xs uppercase tracking-widest text-[var(--text-muted)]">
                                        <span>{dict.orderNumber}</span>
                                        <span className="text-[var(--text-muted)]/80">#{order.id.split('-')[0].toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-serif text-[var(--foreground)] pt-4 border-t border-[var(--panel-border)]">
                                        <span>{dict.total}</span>
                                        <span className="text-brand-crimson">{order.total} DZD</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="bg-[var(--panel-bg)]/50 backdrop-blur-sm border border-[var(--panel-border)]/50 p-8">
                            <h2 className="font-serif text-xl text-[var(--foreground)] mb-6 flex items-center gap-3">
                                <Truck size={20} className="text-brand-crimson" />
                                {dict.nextSteps}
                            </h2>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <Mail className="text-[var(--text-muted)] opacity-60 shrink-0" size={18} />
                                    <p className="text-xs text-[var(--text-muted)]/80 leading-relaxed">
                                        {dict.emailNotice}
                                    </p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <Package className="text-[var(--text-muted)] opacity-60 shrink-0" size={18} />
                                    <p className="text-xs text-[var(--text-muted)]/80 leading-relaxed">
                                        {dict.estimatedDelivery}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Shipping & Payment Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-[var(--panel-bg)] backdrop-blur-md border border-[var(--panel-border)] p-8 shadow-2xl">
                            <h2 className="font-serif text-sm uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6 flex items-center gap-2">
                                <Truck size={14} />
                                {dict.shippingInfo}
                            </h2>
                            <div className="text-xs text-[var(--foreground)]/80 space-y-2 font-sans leading-relaxed">
                                <p className="font-bold text-[var(--foreground)]">{order.fullName}</p>
                                <p>{order.address}</p>
                                <p>{order.city}, {order.wilaya}</p>
                                <p className="pt-2 text-[var(--text-muted)]/60">{order.phoneNumber}</p>
                            </div>

                            <h2 className="font-serif text-sm uppercase tracking-[0.2em] text-[var(--text-muted)] mb-6 mt-12 flex items-center gap-2">
                                <CreditCard size={14} />
                                {dict.paymentMethod}
                            </h2>
                            <p className="text-xs text-[var(--foreground)]/80 font-sans">
                                {dict.cod}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <Link
                                href={`/${lang}/shop`}
                                className="block w-full py-4 bg-[var(--foreground)] text-[var(--background)] hover:bg-brand-crimson hover:text-white transition-all uppercase tracking-[0.2em] font-bold text-[10px] text-center shadow-lg"
                            >
                                <ShoppingBag className="inline-block mr-2 mb-1" size={14} />
                                {dict.continueShopping}
                            </Link>
                            <Link
                                href={`/${lang}/account`}
                                className="block w-full py-4 border border-[var(--panel-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all uppercase tracking-[0.2em] font-bold text-[10px] text-center"
                            >
                                {dict.viewOrders}
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Brand Touch & Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 pt-12 border-t border-[var(--panel-border)]/50 text-center"
                >
                    <div className="mb-8 opacity-20 hover:opacity-100 transition-opacity">
                        <span className="font-serif text-4xl tracking-[0.5em] text-[var(--foreground)] uppercase">ALTER</span>
                    </div>

                    <div className="space-y-2">
                        <p className="font-serif text-sm tracking-[0.25em] uppercase text-[var(--foreground)]/60">
                            More Darkness Awaits
                        </p>
                        <p className="text-[10px] tracking-[0.10em] font-normal uppercase text-[var(--text-muted)]/60">
                            © 2026 — made by a human, adam
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
