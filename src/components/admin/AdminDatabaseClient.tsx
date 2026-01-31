"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, Search, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { getDatabaseData } from '@/app/actions/admin-db'

export default function AdminDatabaseClient() {
    const [activeModel, setActiveModel] = useState<'User' | 'Product' | 'Order' | 'Collection'>('Product')
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchData = async () => {
        setLoading(true)
        const res = await getDatabaseData(activeModel)
        if (res.success) {
            setData(res.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [activeModel])

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    const columns = data.length > 0 ? Object.keys(data[0]) : []

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">Core Database</h1>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Direct Interface with the digital foundation</p>
                </div>
                <div className="flex gap-2">
                    {['Product', 'Order', 'User', 'Collection'].map((model) => (
                        <button
                            key={model}
                            onClick={() => setActiveModel(model as any)}
                            className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all ${activeModel === model
                                    ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                                    : 'border-[var(--panel-border)] text-[var(--text-muted)] hover:border-[var(--foreground)]'
                                }`}
                        >
                            {model}s
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input
                        type="text"
                        placeholder={`Query ${activeModel}s...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--panel-bg)] border border-[var(--panel-border)] pl-12 pr-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors text-xs uppercase tracking-widest"
                    />
                </div>
                <button
                    onClick={fetchData}
                    className="p-3 bg-[var(--panel-bg)] border border-[var(--panel-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--panel-border)] bg-[var(--background)]/50">
                                {columns.map(col => (
                                    <th key={col} className="py-4 px-4 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-normal border-r border-[var(--panel-border)] last:border-0">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--panel-border)]/50 font-sans text-[11px]">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {columns.map(col => (
                                            <td key={col} className="py-4 px-4"><div className="h-2 bg-[var(--panel-border)] rounded w-full" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-[var(--foreground)]/5 transition-colors">
                                        {columns.map(col => (
                                            <td key={col} className="py-3 px-4 text-[var(--foreground)]/70 border-r border-[var(--panel-border)]/30 last:border-0 whitespace-nowrap overflow-hidden max-w-[200px] text-ellipsis">
                                                {typeof item[col] === 'object' ? JSON.stringify(item[col]) : String(item[col])}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="py-20 text-center text-[var(--text-muted)] uppercase tracking-widest text-xs">
                                        No data found in this sector
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
