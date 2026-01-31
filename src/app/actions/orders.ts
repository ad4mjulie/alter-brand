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

        // Use transaction to ensure stock is decremented only if order is created successfully
        const result = await db.$transaction(async (tx) => {
            // 1. Check stock availability for all items first
            for (const item of data.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                    select: { stock: true, name: true }
                })

                if (!product) {
                    throw new Error(`Product ${item.name} not found.`)
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Requested: ${item.quantity}, Available: ${product.stock}`)
                }
            }

            // 2. Create the order
            const order = await tx.order.create({
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

            // 3. Decrement stock for each item
            for (const item of data.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                })
            }

            return order
        })

        return { success: true, orderId: result.id }
    } catch (error: any) {
        console.error('Failed to create order:', error)
        return { success: false, error: error.message || 'Failed to complete the manifestation.' }
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
