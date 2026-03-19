'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const [email,   setEmail]   = useState('')
    const [loading, setLoading] = useState(false)
    const [sent,    setSent]    = useState(false)
    const { forgotPassword } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await forgotPassword(email)
            setSent(true)
            toast.success('Reset email sent!')
        } catch {
            toast.error('Failed to send reset email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md px-6">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
                <Image src="/icon.png" alt="BytesURL" width={56} height={56} />
                <h1 className="text-2xl font-bold text-white mt-3">BytesURL</h1>
                <p className="text-gray-400 text-sm mt-1">Reset your password</p>
            </div>

            {/* Card */}
            <div className="bg-[#150d30] border border-[#7C3AED]/30 rounded-2xl p-8">
                {sent ? (
                    <div className="text-center space-y-4">
                        <div className="text-5xl">📧</div>
                        <h2 className="text-white font-semibold text-lg">Check your email</h2>
                        <p className="text-gray-400 text-sm">
                            We sent a password reset link to{' '}
                            <span className="text-[#A855F7]">{email}</span>
                        </p>
                        <Link
                            href="/login"
                            className="block w-full text-center bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition mt-4"
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-gray-400 text-sm mb-4">
                            Enter your email and we&apos;ll send you a reset link.
                        </p>

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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <Link
                            href="/login"
                            className="block text-center text-gray-400 text-sm hover:text-white transition"
                        >
                            ← Back to Login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    )
}
