"use client"

import { useState } from 'react'
import { updateOrderStatus } from '@/app/actions/admin'
import { ChevronDown, ExternalLink } from 'lucide-react'

export default function OrderRow({ order }: { order: any }) {
    const [status, setStatus] = useState(order.status)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true)
        const res = await updateOrderStatus(order.id, newStatus)
        if (res.success) {
            setStatus(newStatus)
        } else {
            alert('Failed to update status')
        }
        setIsUpdating(false)
    }

    return (
        <tr className="hover:bg-brand-charcoal/10 transition-colors group">
            <td className="px-6 py-4">
                <span className="text-xs font-mono text-brand-silver/60">#{order.id.slice(0, 8)}</span>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-sm text-brand-silver font-medium">{order.fullName}</span>
                    <span className="text-[10px] text-brand-silver/40 font-mono">{order.phoneNumber}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <span className="text-sm text-brand-silver">{order.wilaya}</span>
                    <span className="text-[10px] text-brand-silver/40 uppercase tracking-tighter">{order.city}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm text-brand-silver">{order.items.length} items</span>
            </td>
            <td className="px-6 py-4">
                <span className="text-sm font-serif text-brand-silver">{order.total.toLocaleString()} DZD</span>
            </td>
            <td className="px-6 py-4">
                <select
                    value={status}
                    disabled={isUpdating}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`
                        text-[10px] uppercase tracking-widest px-2 py-1 bg-transparent border border-brand-charcoal cursor-pointer outline-none focus:border-brand-crimson transition-colors
                        ${status === 'PENDING' ? 'text-yellow-500 border-yellow-500/30' :
                            status === 'CONFIRMED' ? 'text-blue-500 border-blue-500/30' :
                                status === 'SHIPPED' ? 'text-purple-500 border-purple-500/30' :
                                    status === 'DELIVERED' ? 'text-green-500 border-green-500/30' : 'text-brand-silver/40'}
                    `}
                >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
            </td>
            <td className="px-6 py-4 text-right">
                <button className="text-brand-silver/40 hover:text-brand-crimson transition-colors opacity-0 group-hover:opacity-100">
                    <ExternalLink size={16} strokeWidth={1} />
                </button>
            </td>
        </tr>
    )
}
