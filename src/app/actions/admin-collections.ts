'use server'

import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
    const session = await getSession()
    if (!session) return false

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    return user?.role === 'admin'
}

export async function getCollections() {
    if (!await checkAdmin()) return { error: 'Unauthorized' }
    return await db.collection.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { createdAt: 'desc' }
    })
}

export async function createCollection(data: { name: string, slug: string, description?: string }) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }
    try {
        const collection = await db.collection.create({ data })
        revalidatePath('/[lang]/admin/collections', 'page')
        return { success: true, collection }
    } catch (error: any) {
        return { error: `Failed to create collection: ${error.message}` }
    }
}

export async function updateCollection(id: string, data: { name?: string, slug?: string, description?: string }) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }
    try {
        const collection = await db.collection.update({ where: { id }, data })
        revalidatePath('/[lang]/admin/collections', 'page')
        return { success: true, collection }
    } catch (error: any) {
        return { error: `Failed to update collection: ${error.message}` }
    }
}

export async function deleteCollection(id: string) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }
    try {
        await db.collection.delete({ where: { id } })
        revalidatePath('/[lang]/admin/collections', 'page')
        return { success: true }
    } catch (error: any) {
        return { error: 'Failed to delete collection' }
    }
}
