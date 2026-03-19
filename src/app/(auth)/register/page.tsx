'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
    const [name,     setName]     = useState('')
    const [email,    setEmail]    = useState('')
    const [password, setPassword] = useState('')
    const [loading,  setLoading]  = useState(false)
    const { register, googleLogin } = useAuth()
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        setLoading(true)
        try {
            await register(email, password, name)
            toast.success('Account created!')
            router.push('/dashboard')
        } catch {
            toast.error('Registration failed')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogle = async () => {
        try {
            await googleLogin()
            toast.success('Welcome!')
            router.push('/dashboard')
        } catch {
            toast.error('Google login failed')
        }
    }

    return (
        <div className="w-full max-w-md px-6">

            <div className="flex flex-col items-center mb-8">
                <Image src="/icon.png" alt="BytesURL" width={56} height={56} />
                <h1 className="text-2xl font-bold text-white mt-3">BytesURL</h1>
                <p className="text-gray-400 text-sm mt-1">Create your account</p>
            </div>


            <div className="bg-[#150d30] border border-[#7C3AED]/30 rounded-2xl p-8">
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            className="w-full bg-[#0F0A1E] border border-[#7C3AED]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full bg-[#0F0A1E] border border-[#7C3AED]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-300 mb-1 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-[#0F0A1E] border border-[#7C3AED]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED] transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>


                <div className="flex items-center my-6">
                    <div className="flex-1 border-t border-[#7C3AED]/20" />
                    <span className="px-3 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-[#7C3AED]/20" />
                </div>


                <button
                    onClick={handleGoogle}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-lg transition"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </button>

                <p className="text-center text-gray-400 text-sm mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#A855F7] hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}