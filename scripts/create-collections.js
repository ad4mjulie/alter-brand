const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const collections = [
        {
            name: 'SEASON 01: GENESIS',
            slug: 'season-01-genesis',
            description: 'The first manifestation. Where darkness began.'
        },
        {
            name: 'ESSENTIALS: VOID',
            slug: 'essentials-void',
            description: 'The fundamental echoes of the brand.'
        }
    ]

    for (const c of collections) {
        await prisma.collection.upsert({
            where: { slug: c.slug },
            update: {},
            create: c
        })
        console.log(`Collection created: ${c.name}`)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
