// ── FILE: app/(user)/payment/success/page.tsx ──

'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function PaymentSuccessPage() {
    const { refreshDbUser } = useAuth()

    useEffect(() => {

        refreshDbUser()
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Your plan has been upgraded. You can now create more links and access full analytics.
                </p>
                <div className="flex flex-col gap-2">
                    <Link
                        href="/dashboard"
                        className="bg-brand-primary hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition text-sm"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/billing"
                        className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-lg transition text-sm"
                    >
                        View Billing
                    </Link>
                </div>
            </div>
        </div>
    )
}