"use client"

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, ChevronUp, ChevronDown, Filter } from 'lucide-react'
import { getDatabaseData } from '@/app/actions/admin-db'

export default function AdminDatabaseClient() {
    const [activeModel, setActiveModel] = useState<'User' | 'Product' | 'Order' | 'Collection'>('Product')
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

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
        setSortConfig(null)
    }, [activeModel])

    const sortedData = useMemo(() => {
        let items = [...data]
        if (searchTerm) {
            items = items.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
        }
        if (sortConfig !== null) {
            items.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1
                }
                return 0
            })
        }
        return items
    }, [data, sortConfig, searchTerm])

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const formatValue = (value: any) => {
        if (value === null || value === undefined) return <span className="opacity-20">NULL</span>
        if (typeof value === 'boolean') return <span className={value ? 'text-green-500' : 'text-red-500'}>{String(value)}</span>
        if (typeof value === 'object') {
            if (Array.isArray(value)) return `[Array(${value.length})]`
            return `{Object}`
        }
        if (typeof value === 'string' && (value.includes('T') && !isNaN(Date.parse(value)))) {
            return new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        }
        return String(value)
    }

    const columns = data.length > 0 ? Object.keys(data[0]) : []

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative">
                    <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">Nexus Interface</h1>
                    <p className="text-[var(--text-muted)] text-[9px] uppercase tracking-[0.3em]">Direct Database Access • ReadOnly</p>
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand-crimson opacity-50" />
                </div>
                <div className="flex bg-[var(--panel-bg)] p-1 border border-[var(--panel-border)]">
                    {['Product', 'Order', 'User', 'Collection'].map((model) => (
                        <button
                            key={model}
                            onClick={() => setActiveModel(model as any)}
                            className={`px-4 py-2 text-[9px] uppercase tracking-widest transition-all ${activeModel === model
                                ? 'bg-brand-crimson text-white'
                                : 'text-[var(--text-muted)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            {model}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                    <input
                        type="text"
                        placeholder={`FILTER ${activeModel.toUpperCase()}S...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--panel-bg)] border border-[var(--panel-border)] pl-12 pr-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors text-[10px] uppercase tracking-widest font-mono"
                    />
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-6 bg-[var(--panel-bg)] border border-[var(--panel-border)] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors text-[10px] uppercase tracking-widest"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Sync
                </button>
            </div>

            <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-[var(--panel-border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-10">
                                {columns.map(col => (
                                    <th
                                        key={col}
                                        onClick={() => requestSort(col)}
                                        className="py-4 px-4 text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-bold cursor-pointer hover:bg-[var(--foreground)]/5 transition-colors group"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            {col}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                {sortConfig?.key === col ? (
                                                    sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                                ) : <Filter size={10} />}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--panel-border)]/30 font-mono text-[10px]">
                            {loading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {columns.map(col => (
                                            <td key={col} className="py-4 px-4"><div className="h-1.5 bg-[var(--panel-border)] rounded w-full opacity-50" /></td>
                                        ))}
                                    </tr>
                                ))
                            ) : sortedData.length > 0 ? (
                                sortedData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-brand-crimson/5 transition-colors group">
                                        {columns.map(col => (
                                            <td key={col} className="py-3 px-4 text-[var(--foreground)]/60 border-r border-[var(--panel-border)]/10 last:border-0 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-[var(--foreground)] transition-colors">
                                                {formatValue(item[col])}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="py-32 text-center text-[var(--text-muted)] uppercase tracking-[0.5em] text-xs">
                                        VOID DETECTED
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
