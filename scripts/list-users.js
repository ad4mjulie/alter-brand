
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log("USERS_LIST_START")
    if (users.length === 0) {
        console.log("No users found")
    } else {
        users.forEach((u) => {
            console.log(`${u.id} | ${u.email} | ${u.username} | ${u.role}`)
        })
    }
    console.log("USERS_LIST_END")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
