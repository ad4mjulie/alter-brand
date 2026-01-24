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

export async function createProduct(data: {
    name: string
    slug: string
    description: string
    price: number
    category: string
    sizes: string
    colors: string
    stock: number
    collectionId?: string
    images: string[]
}) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    try {
        const product = await db.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                price: data.price,
                category: data.category,
                sizes: data.sizes,
                colors: data.colors,
                stock: data.stock,
                collectionId: data.collectionId,
                images: {
                    create: data.images.map(url => ({ url }))
                }
            }
        })
        revalidatePath('/[lang]/admin/products', 'page')
        revalidatePath('/[lang]/shop', 'page')
        return { success: true, product }
    } catch (error: any) {
        console.error('Failed to create product:', error)
        return { error: `Failed to create product: ${error.message}` }
    }
}

export async function updateProduct(id: string, data: {
    name?: string
    slug?: string
    description?: string
    price?: number
    category?: string
    sizes?: string
    colors?: string
    stock?: number
    collectionId?: string
    images?: string[]
}) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    try {
        const updateData: any = { ...data }

        if (data.images) {
            delete updateData.images
            // Delete old images and add new ones for simplicity in this version
            await db.productImage.deleteMany({ where: { productId: id } })
            await db.productImage.createMany({
                data: data.images.map(url => ({ url, productId: id }))
            })
        }

        const product = await db.product.update({
            where: { id },
            data: updateData
        })
        revalidatePath('/[lang]/admin/products', 'page')
        revalidatePath('/[lang]/shop', 'page')
        revalidatePath(`/[lang]/product/${product.slug}`, 'page')
        return { success: true, product }
    } catch (error: any) {
        console.error('Failed to update product:', error)
        return { error: `Failed to update product: ${error.message}` }
    }
}

export async function deleteProduct(id: string) {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    try {
        await db.product.delete({ where: { id } })
        revalidatePath('/[lang]/admin/products', 'page')
        revalidatePath('/[lang]/shop', 'page')
        return { success: true }
    } catch (error: any) {
        console.error('Failed to delete product:', error)
        return { error: 'Failed to delete product' }
    }
}

export async function getAdminProducts() {
    if (!await checkAdmin()) return { error: 'Unauthorized' }

    return await db.product.findMany({
        include: { images: true },
        orderBy: { createdAt: 'desc' }
    })
}
