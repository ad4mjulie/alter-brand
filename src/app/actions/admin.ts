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

    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)
    const fourteenDaysAgo = new Date(now)
    fourteenDaysAgo.setDate(now.getDate() - 14)

    const [
        orderCount,
        totalRevenueResult,
        userCount,
        lowStockCount,
        currentPeriodOrders,
        previousPeriodOrders,
        categoryData
    ] = await Promise.all([
        db.order.count(),
        db.order.aggregate({
            _sum: { total: true }
        }),
        db.user.count(),
        db.product.count({
            where: { stock: { lt: 10 } }
        }),
        db.order.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { total: true, createdAt: true }
        }),
        db.order.findMany({
            where: {
                createdAt: {
                    gte: fourteenDaysAgo,
                    lt: sevenDaysAgo
                }
            },
            select: { total: true, createdAt: true }
        }),
        db.product.groupBy({
            by: ['category'],
            _count: { _all: true }
        })
    ])

    // Calculate Trends
    const currentRevenue = currentPeriodOrders.reduce((sum, o) => sum + o.total, 0)
    const previousRevenue = previousPeriodOrders.reduce((sum, o) => sum + o.total, 0)
    const revenueTrend = previousRevenue === 0 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue) * 100

    const currentOrdersCount = currentPeriodOrders.length
    const previousOrdersCount = previousPeriodOrders.length
    const orderTrend = previousOrdersCount === 0 ? 0 : ((currentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100

    // Average Order Value (last 30 days or total)
    const totalRevenue = totalRevenueResult._sum.total || 0
    const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0

    // Aggregate time-series data (for chart)
    const dailyStats = []
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)

        const dayOrders = currentPeriodOrders.filter(o => {
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
        totalRevenue,
        userCount,
        lowStockCount,
        dailyStats,
        revenueTrend,
        orderTrend,
        averageOrderValue,
        categoryStats: categoryData.map(c => ({
            name: c.category,
            value: c._count._all
        })),
        latestOrders: await db.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                fullName: true,
                total: true,
                status: true,
                createdAt: true
            }
        })
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
