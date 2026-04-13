'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

type Role = 'USER' | 'ADMIN'

const DEMO_ROLES: { role: Role; label: string; email: string; password: string }[] = [
    { role: 'USER',  label: 'User',  email: 'user@shorturl.com',  password: 'User@123456'  },
    { role: 'ADMIN', label: 'Admin', email: 'admin@shorturl.com', password: 'Admin@123456' },
]

export default function LoginPage() {
    const [email,      setEmail]      = useState('')
    const [password,   setPassword]   = useState('')
    const [loading,    setLoading]    = useState(false)
    const [activeDemo, setActiveDemo] = useState<Role | null>(null)
    const { login, googleLogin }      = useAuth()
    const router = useRouter()

    const fillDemo = (role: Role) => {
        const demo = DEMO_ROLES.find((r) => r.role === role)!
        setEmail(demo.email)
        setPassword(demo.password)
        setActiveDemo(role)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await login(email, password)
            toast.success('Welcome back!')
            router.push('/')
        } catch (err: unknown) {
            const error = err as { message?: string }
            toast.error(error?.message ?? 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async () => {
        try {
            await googleLogin()
            toast.success('Welcome!')
            router.push('/')
        } catch (err: unknown) {
            const error = err as { message?: string }
            toast.error(error?.message ?? 'Google login failed')
        }
    }

    return (
        <div className="w-full max-w-md px-6">
            <div className="flex flex-col items-center mb-8">
                <Image src="/logo.png" alt="BytesURL" width={48} height={48} />
                <h1 className="text-xl font-bold text-gray-900 mt-3">BytesURL</h1>
                <p className="text-gray-400 text-sm mt-1">Welcome back</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                
                <div className="mb-5 space-y-2">
                    <p className="text-xs text-gray-400 text-center">Try a demo account</p>
                    <div className="grid grid-cols-2 gap-2">
                        {DEMO_ROLES.map(({ role, label }) => {
                            const isActive = activeDemo === role
                            const isAdmin  = role === 'ADMIN'
                            return (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => fillDemo(role)}
                                    disabled={loading}
                                    className={`
                                        relative py-2 rounded-lg border text-xs font-semibold
                                        transition-all duration-150 cursor-pointer select-none
                                        focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                                        ${isAdmin
                                            ? isActive
                                                ? 'bg-brand-primary text-white border-brand-primary shadow-sm scale-[1.03]'
                                                : 'bg-purple-50 text-brand-primary border-purple-200 hover:border-brand-primary hover:scale-[1.02]'
                                            : isActive
                                                ? 'bg-gray-800 text-white border-gray-800 shadow-sm scale-[1.03]'
                                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400 hover:scale-[1.02]'
                                        }
                                    `}
                                >
                                    {label}
                                    {isActive && (
                                        <span className={`absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full ${isAdmin ? 'bg-brand-primary' : 'bg-gray-800'}`}>
                                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-700 mb-1 block font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setActiveDemo(null) }}
                            placeholder="you@example.com"
                            required
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-700 mb-1 block font-medium">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setActiveDemo(null) }}
                            placeholder="••••••••"
                            required
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm text-brand-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-gray-100" />
                    <span className="px-3 text-gray-400 text-xs">or</span>
                    <div className="flex-1 border-t border-gray-100" />
                </div>

                <button
                    onClick={handleGoogle}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition text-sm"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-brand-primary hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}