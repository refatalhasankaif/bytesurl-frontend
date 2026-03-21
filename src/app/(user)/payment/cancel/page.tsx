'use client'

import Link from 'next/link'

export default function PaymentCancelPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-white">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Your payment was cancelled. No charges were made.
                </p>
                <div className="flex flex-col gap-2">
                    <Link
                        href="/billing"
                        className="bg-brand-primary hover:bg-[#6D28D9] text-white font-semibold py-3 rounded-lg transition text-sm"
                    >
                        Try Again
                    </Link>
                    <Link
                        href="/dashboard"
                        className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-lg transition text-sm"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}