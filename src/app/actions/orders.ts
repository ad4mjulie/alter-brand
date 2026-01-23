'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function createOrder(data: {
    fullName: string
    wilaya: string
    city: string
    address: string
    phoneNumber: string
    total: number
    items: Array<{
        productId: string
        name: string
        price: number
        quantity: number
        size?: string
        color?: string
    }>
}) {
    try {
        const session = await getSession()
        const userId = session?.userId as string | undefined

        const order = await db.order.create({
            data: {
                userId,
                fullName: data.fullName,
                wilaya: data.wilaya,
                city: data.city,
                address: data.address,
                phoneNumber: data.phoneNumber,
                total: data.total,
                status: 'PENDING',
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                    })),
                },
            },
        })

        return { success: true, orderId: order.id }
    } catch (error: any) {
        console.error('Failed to create order:', error)
        return { success: false, error: `Failed to create order: ${error.message || 'Unknown error'}` }
    }
}

export async function getOrderById(orderId: string) {
    try {
        const order = await db.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
            },
        })

        if (!order) return { error: 'Order not found' }

        return { success: true, order }
    } catch (error: any) {
        console.error('Failed to fetch order:', error)
        return { error: 'Failed to fetch order details' }
    }
}
