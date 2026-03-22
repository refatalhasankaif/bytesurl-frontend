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
        } catch (err: unknown) {
            const error   = err as { message?: string }
            const message = error?.message ?? 'Failed to send reset email'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md px-6">

            <div className="flex flex-col items-center mb-8">
                <Image src="/logo.png" alt="BytesURL" width={48} height={48} />
                <h1 className="text-xl font-bold text-gray-900 mt-3">BytesURL</h1>
                <p className="text-gray-400 text-sm mt-1">Reset your password</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                {sent ? (
                    <div className="text-center space-y-4">
                        <div className="text-4xl">📧</div>
                        <h2 className="text-gray-900 font-semibold text-base">Check your email</h2>
                        <p className="text-gray-500 text-sm">
                            We sent a password reset link to{' '}
                            <span className="text-brand-primary font-medium">{email}</span>
                        </p>
                        <Link
                            href="/login"
                            className="block w-full text-center bg-brand-primary hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition text-sm mt-2"
                        >
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-gray-500 text-sm">
                            Enter your email and we&apos;ll send you a reset link.
                        </p>

                        <div>
                            <label className="text-sm text-gray-700 mb-1 block font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {loading ? 'Checking...' : 'Send Reset Link'}
                        </button>

                        <Link
                            href="/login"
                            className="block text-center text-gray-400 text-sm hover:text-gray-700 transition"
                        >
                            Back to Login
                        </Link>
                    </form>
                )}
            </div>
        </div>
    )
}