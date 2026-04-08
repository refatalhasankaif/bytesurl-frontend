'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function StatusPage() {
    const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading')

    useEffect(() => {
const checkStatus = async (retry = 0) => {
    try {
        const res = await fetch('https://bytesurl.onrender.com/')
        const data = await res.json()

        if (data?.success) {
            setStatus('online')
        } else {
            throw new Error()
        }

    } catch {
        if (retry < 2) {
            setTimeout(() => checkStatus(retry + 1), 1500)
        } else {
            setStatus('offline')
        }
    }
}

        checkStatus()
    }, [])

    return (
        <section className="w-full min-h-screen flex items-center justify-center bg-white px-4">

            <div className="w-full max-w-md flex flex-col items-center text-center gap-6">


                <p className="text-brand-primary text-xs font-semibold tracking-widest uppercase">
                    Service Status
                </p>


                <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-sm font-semibold border ${
                        status === 'loading'
                            ? 'border-gray-200 bg-gray-50 text-gray-500'
                            : status === 'online'
                            ? 'border-green-200 bg-green-50 text-green-600'
                            : 'border-red-200 bg-red-50 text-red-500'
                    }`}
                >
                    {status === 'loading' && 'Checking...'}
                    {status === 'online' && 'Online'}
                    {status === 'offline' && 'Offline'}
                </div>


                <h1 className="text-2xl font-bold text-gray-900">
                    {status === 'loading' && 'Checking server...'}
                    {status === 'online' && 'All systems operational'}
                    {status === 'offline' && 'Service unavailable'}
                </h1>

                <p className="text-gray-500 text-sm  max-w-[80%]">
                    {status === 'online'
                        ? 'Your backend is running smoothly and ready to handle requests.'
                        : status === 'offline'
                        ? 'We are unable to reach the backend server right now.'
                        : 'Please wait while we check the system status.'}
                </p>


                <Link
                    href="/"
                    className="mt-2 border border-brand-primary text-brand-primary hover:bg-purple-50 px-6 py-2.5 rounded-lg text-sm font-medium transition"
                >
                    Back to Home
                </Link>

            </div>

        </section>
    )
}