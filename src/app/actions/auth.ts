'use server'

import { db } from '@/lib/db'
import { hashPassword, verifyPassword, createSession, deleteSession, getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Prisma } from '@prisma/client'

export async function register(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    // Generate a default username from email
    const username = email.split('@')[0] + '_' + Math.floor(Math.random() * 1000)

    try {
        const hashedPassword = await hashPassword(password)

        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
            },
        })

        await createSession(user.id)
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return { error: 'Email already exists' }
            }
        }
        return { error: 'Failed to create account' }
    }

    redirect('/account')
}

export async function login(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email and password are required' }
    }

    const user = await db.user.findUnique({
        where: { email },
    })

    if (!user || !(await verifyPassword(password, user.password))) {
        return { error: 'Invalid credentials' }
    }

    await createSession(user.id)
    redirect('/account')
}

export async function logout(redirectTo: string = '/account') {
    await deleteSession()
    redirect(redirectTo)
}

export async function updateUsername(formData: FormData) {
    const newUsername = formData.get('username') as string
    const sessionUser = await getSession()

    if (!sessionUser || !newUsername) return { error: 'Unauthorized or invalid input' }

    try {
        await db.user.update({
            where: { id: sessionUser.userId },
            data: { username: newUsername },
        })
    } catch (e) {
        return { error: 'Username already taken' }
    }

    // Revalidate or just return success
    return { success: true }
}

export async function getUser() {
    const session = await getSession()
    if (!session) return null

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { id: true, username: true, email: true, role: true, createdAt: true }
    })

    return user
}
