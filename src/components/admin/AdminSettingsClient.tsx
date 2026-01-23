"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Lock } from 'lucide-react'
import { updateAdminPassword } from '@/app/actions/admin-settings'

export default function AdminSettingsClient() {
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        const res = await updateAdminPassword(password)

        if (res.error) {
            setMessage({ type: 'error', text: res.error })
        } else {
            setMessage({ type: 'success', text: 'Password updated successfully' })
            setPassword("")
        }
        setIsLoading(false)
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">Settings</h1>
                <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Configure access controls</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-6 text-[var(--foreground)]">
                        <Lock size={20} />
                        <h3 className="font-serif text-xl">Admin Security</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-xs p-3 border ${message.type === 'success' ? 'border-green-500/50 text-green-600 bg-green-500/5' : 'border-brand-crimson/50 text-brand-crimson bg-brand-crimson/10'}`}
                            >
                                {message.text}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--foreground)] text-[var(--background)] py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-brand-crimson hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
