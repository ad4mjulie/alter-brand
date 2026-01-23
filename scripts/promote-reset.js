
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
    const email = 'ad4msjullie@gmail.com'
    const newPassword = 'admin'
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    try {
        const user = await prisma.user.update({
            where: { email },
            data: {
                role: 'ADMIN',
                password: hashedPassword
            }
        })
        console.log(`Successfully updated user ${user.username} (${user.email}) to ADMIN with new password.`)
    } catch (error) {
        console.error('Error updating user:', error)
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
