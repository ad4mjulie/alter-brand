"use client"

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useState } from 'react'
import { ShoppingBag, MoreVertical, Languages, X } from 'lucide-react'
import clsx from 'clsx'
import BrandLogo from '@/components/ui/BrandLogo'
import { useCart } from '@/context/CartContext'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Navigation({ lang, dict, user }: { lang: string, dict: any, user: any }) {
    const { setIsOpen, total } = useCart()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 150], [1, 0])
    const pointerEvents = useTransform(scrollY, (y) => y > 150 ? 'none' : 'auto')

    const getTogglePath = () => {
        const segments = pathname.split('/')
        segments[1] = lang === 'en' ? 'ar' : 'en'
        return segments.join('/')
    }

    const navLinks = [
        { href: `/${lang}/shop`, label: dict.shop },
        { href: `/${lang}/about`, label: dict.manifesto },
        { href: `/${lang}/lookbook`, label: dict.lookbook },
    ]

    return (
        <>
            <motion.header
                style={{ opacity, pointerEvents }}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between mix-blend-difference"
            >
                {/* Left: Universal Menu Icon & Theme Toggle */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="text-brand-silver hover:text-brand-crimson transition-colors"
                    >
                        <MoreVertical size={20} strokeWidth={1} />
                    </button>
                    <ThemeToggle />
                </div>

                {/* Center: Brand Logo */}
                <Link href={`/${lang}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-12">
                    <BrandLogo />
                </Link>

                {/* Right: Cart & Actions */}
                <div className="flex items-center gap-3 md:gap-6 text-brand-silver">
                    <Link
                        href={getTogglePath()}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest hover:text-brand-crimson transition-colors"
                    >
                        <Languages size={14} strokeWidth={1} />
                        {lang === 'en' ? 'العربية' : 'EN'}
                    </Link>
                    <Link href={`/${lang}/account`} className="hidden md:block text-xs uppercase tracking-widest hover:text-brand-crimson transition-colors">{dict.account}</Link>
                    <button onClick={() => setIsOpen(true)} className="hover:text-brand-crimson transition-colors relative">
                        <ShoppingBag size={20} strokeWidth={1} />
                        {total > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-crimson rounded-full" />}
                    </button>
                </div>
            </motion.header>

            {/* Menu Overlay (Universal) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-[90] bg-brand-black/40"
                        />
                        <motion.div
                            initial={{ x: lang === 'ar' ? '100%' : '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: lang === 'ar' ? '100%' : '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            /* Translucent panel with narrowed width and backdrop blur. Using logical properties for LTR/RTL. */
                            className={clsx(
                                "fixed inset-y-0 z-[100] w-[280px] md:w-[320px] bg-[var(--panel-bg)] backdrop-blur-md flex flex-col p-6 shadow-2xl border-[var(--panel-border)]",
                                lang === 'ar' ? 'end-0 border-s' : 'start-0 border-e'
                            )}
                        >
                            <div className="flex justify-end items-center mb-12">

                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-brand-silver/60 hover:text-brand-crimson transition-colors"
                                >
                                    <X size={24} strokeWidth={1} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-6">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-xl md:text-3xl font-serif text-brand-silver/90 hover:text-brand-silver transition-colors uppercase tracking-widest"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link
                                    href={`/${lang}/account`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-xl md:text-3xl font-serif text-brand-silver/90 hover:text-brand-silver transition-colors uppercase tracking-widest"
                                >
                                    {dict.account}
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link
                                        href={`/${lang}/admin`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-xl md:text-3xl font-serif text-brand-crimson hover:text-brand-crimson/80 transition-colors uppercase tracking-widest"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                            </nav>

                            <div className="mt-auto pt-8 border-t border-[var(--panel-border)]">
                                <Link
                                    href={getTogglePath()}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 text-sm uppercase tracking-widest text-brand-silver/50 hover:text-brand-silver transition-colors"
                                >
                                    <Languages size={18} strokeWidth={1} />
                                    {lang === 'en' ? 'العربية' : 'English'}
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
