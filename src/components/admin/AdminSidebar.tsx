"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Package,
    FolderTree,
    ImageIcon
} from 'lucide-react'
import { useState } from 'react'
import { logout } from '@/app/actions/auth'

export default function AdminSidebar({ lang }: { lang: string }) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const links = [
        { href: `/${lang}/admin`, label: 'Dashboard', icon: LayoutDashboard },
        { href: `/${lang}/admin/products`, label: 'Products', icon: Package },
        { href: `/${lang}/admin/collections`, label: 'Collections', icon: FolderTree },
        { href: `/${lang}/admin/orders`, label: 'Orders', icon: ShoppingBag },
        { href: `/${lang}/admin/users`, label: 'Users', icon: Users },
        { href: `/${lang}/admin/media`, label: 'Media', icon: ImageIcon },
        { href: `/${lang}/admin/settings`, label: 'Settings', icon: Settings },
        { href: `/${lang}/admin/database`, label: 'Database', icon: FolderTree },
    ]

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[var(--panel-bg)] text-[var(--foreground)] backdrop-blur-sm rounded-md border border-[var(--panel-border)]"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full bg-[var(--background)] border-r border-[var(--panel-border)] z-50 transition-all duration-300
                w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-8 border-b border-[var(--panel-border)]">
                    <h2 className="font-serif text-2xl text-[var(--foreground)] tracking-tighter">ALTER <span className="text-[10px] uppercase tracking-widest text-brand-crimson block">Admin Panel</span></h2>
                </div>

                <nav className="p-4 space-y-2 mt-4">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-widest transition-colors
                                    ${isActive
                                        ? 'bg-brand-crimson text-white'
                                        : 'text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)]'}
                                `}
                            >
                                <Icon size={18} strokeWidth={1} />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <Link
                        href={`/${lang}`}
                        className="flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)] w-full transition-colors"
                    >
                        <LogOut size={18} strokeWidth={1} className="rotate-180" />
                        Back to Website
                    </Link>
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-widest text-brand-crimson hover:bg-brand-crimson/10 w-full transition-colors"
                    >
                        <LogOut size={18} strokeWidth={1} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                />
            )}
        </>
    )
}
