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

    return user?.role === 'ADMIN'
}

export async function createMedia(url: string) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }
    try {
        const media = await db.productImage.create({
            data: { url }
        })
        revalidatePath('/[lang]/admin/media', 'page')
        return { success: true, media }
    } catch (error: any) {
        return { error: `Failed to save media: ${error.message}` }
    }
}

export async function deleteMedia(id: string) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }
    try {
        await db.productImage.delete({ where: { id } })
        revalidatePath('/[lang]/admin/media', 'page')
        return { success: true }
    } catch (error: any) {
        return { error: 'Failed to delete media' }
    }
}
