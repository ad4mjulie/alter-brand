'use server'

import { db } from '@/lib/db'
import { getSession, hashPassword } from '@/lib/auth'

async function checkAdmin() {
    const session = await getSession()
    if (!session) return false

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    return user?.role === 'admin'
}

export async function updateAdminPassword(password: string) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    // Basic validation
    if (!password || password.length < 6) {
        return { error: 'Password must be at least 6 characters long' }
    }

    try {
        const session = await getSession()
        if (!session) return { error: 'Session expired' }

        const hashedPassword = await hashPassword(password)

        await db.user.update({
            where: { id: session.userId },
            data: { password: hashedPassword }
        })

        return { success: true }
    } catch (error: any) {
        return { error: `Failed to update password: ${error.message}` }
    }
}
