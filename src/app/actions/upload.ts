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

    return user?.role?.toLowerCase() === 'admin'
}

export async function uploadImage(formData: FormData) {
    if (!await checkAdmin()) {
        return { error: 'Unauthorized' }
    }

    try {
        const file = formData.get('file') as File
        if (!file) {
            return { error: 'No file uploaded' }
        }

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

        if (!cloudName || !uploadPreset) {
            throw new Error('Cloudinary configuration missing')
        }

        const cloudinaryFormData = new FormData()
        cloudinaryFormData.append('file', file)
        cloudinaryFormData.append('upload_preset', uploadPreset)

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                body: cloudinaryFormData,
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary')
        }

        const data = await response.json()
        return { success: true, url: data.secure_url }
    } catch (error: any) {
        console.error('Cloudinary upload error:', error)
        return { error: `Upload failed: ${error.message || 'Unknown error'}` }
    }
}
