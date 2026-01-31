"use server"

import { db } from '@/lib/db'

export async function getDatabaseData(model: 'User' | 'Product' | 'Order' | 'Collection') {
    try {
        let data: any[] = []

        switch (model) {
            case 'User':
                data = await db.user.findMany({
                    orderBy: { createdAt: 'desc' }
                })
                break
            case 'Product':
                data = await db.product.findMany({
                    orderBy: { createdAt: 'desc' },
                    include: { images: true }
                })
                break
            case 'Order':
                data = await db.order.findMany({
                    orderBy: { createdAt: 'desc' },
                    include: { items: true }
                })
                break
            case 'Collection':
                data = await db.collection.findMany({
                    orderBy: { createdAt: 'desc' }
                })
                break
        }

        return { success: true, data: JSON.parse(JSON.stringify(data)) }
    } catch (error: any) {
        console.error("Database fetch error:", error)
        return { success: false, error: error.message }
    }
}
