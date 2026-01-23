"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { register, login, logout, updateUsername, getUser } from '@/app/actions/auth'
import Link from 'next/link'

export default function AccountClient({ lang, dict }: { lang: string, dict: any }) {
    const [isLogin, setIsLogin] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        async function loadUser() {
            const u = await getUser()
            setUser(u)
            setLoading(false)
        }
        loadUser()
    }, [])

    const handleSubmit = async (formData: FormData) => {
        setError('')
        const action = isLogin ? login : register
        const result = await action(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            const u = await getUser()
            setUser(u)
        }
    }

    const handleUpdateProfile = async (formData: FormData) => {
        const result = await updateUsername(formData)
        if (result?.error) {
            setError(result.error)
        } else {
            setIsEditing(false)
            const u = await getUser()
            setUser(u)
        }
    }

    const handleLogout = async () => {
        setUser(null)
        await logout(`/${lang}`)
    }

    if (loading) return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-[var(--foreground)] font-serif">
            {dict.loading}
        </div>
    )

    if (user) {
        return (
            <main className="min-h-screen bg-[var(--background)] flex items-center justify-center relative px-6 transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-radial from-[var(--panel-bg)]/20 to-transparent z-0" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md relative z-10 p-12 border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-sm text-center shadow-2xl"
                >
                    <div className="w-24 h-24 bg-[var(--card-bg)] mx-auto rounded-full flex items-center justify-center mb-6 border border-[var(--panel-border)]">
                        <span className="font-serif text-4xl text-[var(--foreground)]">{user.username[0].toUpperCase()}</span>
                    </div>

                    {isEditing ? (
                        <form action={handleUpdateProfile} className="mb-4">
                            <input
                                name="username"
                                defaultValue={user.username}
                                className="bg-transparent border-b border-[var(--panel-border)] text-center text-[var(--foreground)] font-serif text-2xl focus:outline-none focus:border-brand-crimson pb-2 w-full"
                            />
                            <div className="flex justify-center gap-4 mt-4">
                                <button type="submit" className="text-xs uppercase tracking-widest text-brand-crimson">{dict.save}</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{dict.cancel}</button>
                            </div>
                        </form>
                    ) : (
                        <div className="group relative inline-block">
                            <h1 className="font-serif text-3xl text-[var(--foreground)] mb-2">{user.username}</h1>
                            <button onClick={() => setIsEditing(true)} className="absolute -right-4 top-0 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors text-xs opacity-0 group-hover:opacity-100 uppercase">
                                {dict.edit}
                            </button>
                        </div>
                    )}

                    <p className="text-brand-crimson text-xs uppercase tracking-widest mb-8">{user.role || 'Initiate'}</p>

                    <div className="space-y-4 border-t border-[var(--panel-border)] pt-8 text-start">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)] uppercase tracking-widest text-xs">{dict.email}</span>
                            <span className="text-[var(--foreground)]">{user.email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-muted)] uppercase tracking-widest text-xs">{dict.memberSince}</span>
                            <span className="text-[var(--foreground)]">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>

                        {user.role === 'ADMIN' && (
                            <Link
                                href={`/${lang}/admin`}
                                className="block w-full py-4 mt-8 bg-brand-crimson/10 border border-brand-crimson/50 text-brand-crimson hover:bg-brand-crimson hover:text-white transition-all uppercase tracking-[0.2em] text-xs font-bold text-center"
                            >
                                {dict.adminPanel}
                            </Link>
                        )}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="mt-12 text-xs uppercase tracking-widest text-[var(--text-muted)] hover:text-brand-crimson transition-colors"
                    >
                        {dict.signOut}
                    </button>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[var(--background)] flex items-center justify-center relative px-6 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-radial from-[var(--panel-bg)]/20 to-transparent z-0" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md relative z-10 border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-md p-8 md:p-12 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-[var(--foreground)] mb-2">{isLogin ? dict.enter : dict.initiate}</h1>
                    <div className="h-[1px] w-16 bg-brand-crimson mx-auto opacity-50" />

                    {error && (
                        <p className="text-brand-crimson mt-4 text-xs uppercase tracking-widest">{error}</p>
                    )}
                </div>

                <form className="space-y-6" action={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{dict.email}</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors font-sans"
                            placeholder="shadow@alter.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{dict.password}</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors font-sans"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="w-full bg-[var(--foreground)] text-[var(--background)] py-3 uppercase tracking-widest text-xs font-bold hover:bg-brand-crimson hover:text-white transition-colors mt-8">
                        {isLogin ? dict.signIn : dict.join}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        {isLogin ? dict.noAccount : dict.alreadyInitiated}
                    </button>
                </div>
            </motion.div>
        </main>
    )
}
