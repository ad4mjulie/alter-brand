'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

async function checkAdmin() {
    const session = await getSession()
    if (!session) return false

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    return user?.role === 'admin'
}

export async function uploadImage(formData: FormData) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    const file = formData.get('file') as File
    if (!file) {
        return { error: 'No file uploaded' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure upload directory exists
    const relativeUploadDir = '/uploads'
    const uploadDir = join(process.cwd(), 'public', relativeUploadDir)

    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore error if directory exists
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '') // Sanitize filename
    const uniqueFilename = `${uniqueSuffix}-${filename}`
    const finalPath = join(uploadDir, uniqueFilename)

    try {
        await writeFile(finalPath, buffer)
        return { success: true, url: `${relativeUploadDir}/${uniqueFilename}` }
    } catch (error: any) {
        console.error('Upload error:', error)
        return { error: 'Failed to save file' }
    }
}
