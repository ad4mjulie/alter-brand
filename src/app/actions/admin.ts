'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function checkAdmin() {
    const session = await getSession()
    if (!session) return false

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    return user?.role === 'admin'
}

export async function getOrders() {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    return await db.order.findMany({
        include: {
            items: true,
            user: {
                select: {
                    username: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export async function updateOrderStatus(orderId: string, status: string) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    try {
        await db.order.update({
            where: { id: orderId },
            data: { status }
        })
        return { success: true }
    } catch (error) {
        return { error: 'Failed to update status' }
    }
}

export async function getAdminStats() {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    // Get date range (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [orderCount, totalRevenue, userCount, lowStockCount, recentOrders, categoryData] = await Promise.all([
        db.order.count(),
        db.order.aggregate({
            _sum: {
                total: true
            }
        }),
        db.user.count(),
        db.product.count({
            where: {
                stock: {
                    lt: 10
                }
            }
        }),
        db.order.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            select: {
                total: true,
                createdAt: true
            }
        }),
        db.product.groupBy({
            by: ['category'],
            _count: {
                _all: true
            }
        })
    ])

    // Aggregate time-series data
    const dailyStats = []
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)

        const dayOrders = recentOrders.filter(o => {
            const d = new Date(o.createdAt)
            d.setHours(0, 0, 0, 0)
            return d.getTime() === date.getTime()
        })

        dailyStats.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
            orders: dayOrders.length
        })
    }

    return {
        orderCount,
        totalRevenue: totalRevenue._sum.total || 0,
        userCount,
        lowStockCount,
        dailyStats,
        categoryStats: categoryData.map(c => ({
            name: c.category,
            value: c._count._all
        }))
    }
}

export async function getUsersWithOrders() {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    return await db.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true,
            orders: {
                select: {
                    id: true,
                    total: true,
                    status: true,
                    createdAt: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}
