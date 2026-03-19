'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Image from 'next/image'
import toast from 'react-hot-toast'

function AuthActionContent() {
    const searchParams = useSearchParams()
    const router       = useRouter()
    const mode         = searchParams.get('mode')
    const oobCode      = searchParams.get('oobCode')

    const [password, setPassword] = useState('')
    const [confirm,  setConfirm]  = useState('')
    const [loading,  setLoading]  = useState(false)
    const [email,    setEmail]    = useState('')
    const [done,     setDone]     = useState(false)

    useEffect(() => {
        if (mode === 'resetPassword' && oobCode) {
            verifyPasswordResetCode(auth, oobCode)
                .then((email) => setEmail(email))
                .catch(() => {
                    toast.error('Invalid or expired reset link')
                    router.push('/forgot-password')
                })
        }
    }, [mode, oobCode, router])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirm) {
            toast.error('Passwords do not match')
            return
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        if (!oobCode) return

        setLoading(true)
        try {
            await confirmPasswordReset(auth, oobCode, password)
            setDone(true)
            toast.success('Password reset successfully!')
        } catch {
            toast.error('Failed to reset password. Link may have expired.')
        } finally {
            setLoading(false)
        }
    }

    if (mode !== 'resetPassword') {
        return (
            <div className="text-center text-gray-500 text-sm">
                Invalid action link.
            </div>
        )
    }

    return (
        <div className="w-full max-w-md px-6">

            <div className="flex flex-col items-center mb-8">
                <Image src="/logo.png" alt="BytesURL" width={48} height={48} />
                <h1 className="text-xl font-bold text-gray-900 mt-3">BytesURL</h1>
                <p className="text-gray-400 text-sm mt-1">Set new password</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                {done ? (
                    <div className="text-center space-y-4">
                        <div className="text-4xl">✅</div>
                        <h2 className="text-gray-900 font-semibold text-base">
                            Password Reset!
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Your password has been reset successfully.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-brand-primary hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition text-sm"
                        >
                            Back to Home
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-4">
                        {email && (
                            <p className="text-gray-500 text-sm">
                                Resetting password for{' '}
                                <span className="text-brand-primary font-medium">{email}</span>
                            </p>
                        )}

                        <div>
                            <label className="text-sm text-gray-700 mb-1 block font-medium">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 mb-1 block font-medium">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-primary hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default function AuthActionPage() {
    return (
        <Suspense fallback={
            <div className="text-gray-500 text-sm text-center">Loading...</div>
        }>
            <AuthActionContent />
        </Suspense>
    )
}