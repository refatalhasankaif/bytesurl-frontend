import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/auth/action',
]

const adminRoutes = [
    '/admin',
    '/admin/users',
    '/admin/urls',
    '/admin/analytics',
    '/admin/payments',
]

const userRoutes = [
    '/dashboard',
    '/urls',
    '/analytics',
    '/profile',
    '/billing',
    '/payment/success',
    '/payment/cancel',
]

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const token = req.cookies.get('token')?.value
    const role = req.cookies.get('role')?.value


    if (!token) {
        if (
            userRoutes.some(route => pathname.startsWith(route)) ||
            adminRoutes.some(route => pathname.startsWith(route))
        ) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        return NextResponse.next()
    }

    if (authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (adminRoutes.some(route => pathname.startsWith(route))) {
        if (role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)',
    ],
}