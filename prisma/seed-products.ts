import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Clearing existing products...')
    await prisma.productImage.deleteMany()
    await prisma.product.deleteMany()

    const products = [
        {
            slug: 'void-hoodie',
            name: 'Void Hoodie',
            description: 'A heavyweight hoodie forged in the deepest shadows. Featuring an oversized fit and reinforced stitching for the eternal wanderer.',
            price: 18000,
            category: 'Outerwear',
            sizes: 'S,M,L,XL,XXL',
            colors: '#050505,#1f1f1f,#8a0303', // Black, Charcoal, Crimson
            images: [
                '/placeholder.jpg',
                '/placeholder.jpg',
            ]
        },
        {
            slug: 'ritual-tee',
            name: 'Ritual Tee',
            description: 'The foundation of every ritual. Premium cotton with a silken finish, featuring the ALTER sigil in tonal embroidery.',
            price: 8500,
            category: 'Tops',
            sizes: 'S,M,L,XL',
            colors: '#050505,#FFFFFF', // Black, White
            images: [
                '/placeholder.jpg',
            ]
        },
        {
            slug: 'shadow-cargo',
            name: 'Shadow Cargo',
            description: 'Tactical utility meets streetwear elegance. Multiple hidden compartments for your artifacts.',
            price: 22000,
            category: 'Bottoms',
            sizes: '30,32,34,36',
            colors: '#050505,#1f1f1f',
            images: [
                '/placeholder.jpg',
            ]
        },
        {
            slug: 'eclipse-jacket',
            name: 'Eclipse Jacket',
            description: 'Water-resistant technical shell designed to withstand the void. Laser-cut details and waterproof zippers.',
            price: 35000,
            category: 'Outerwear',
            sizes: 'M,L,XL',
            colors: '#050505',
            images: [
                '/placeholder.jpg',
                '/placeholder.jpg',
            ]
        }
    ]

    console.log('Seeding products...')

    for (const p of products) {
        const { images, ...productData } = p
        await prisma.product.create({
            data: {
                ...productData,
                images: {
                    create: images.map(url => ({ url }))
                }
            }
        })
    }

    console.log('Seed complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
