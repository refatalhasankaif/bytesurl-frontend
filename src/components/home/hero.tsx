'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface ShortenedUrl {
    shortUrlFull: string
}

interface ApiError {
    response?: {
        data?: {
            message?: string
        }
        status?: number
    }
}

export default function Hero() {
    const { user } = useAuth()

    const [originalUrl, setOriginalUrl] = useState('')
    const [customUrl,   setCustomUrl]   = useState('')
    const [loading,     setLoading]     = useState(false)
    const [result,      setResult]      = useState<ShortenedUrl | null>(null)
    const [copied,      setCopied]      = useState(false)
    const [customError, setCustomError] = useState('')

    const handleCustomChange = (val: string) => {
        const clean = val.replace(/[^a-zA-Z0-9-_]/g, '')
        setCustomUrl(clean)
        if (clean.length === 0)     setCustomError('')
        else if (clean.length < 3)  setCustomError('Minimum 3 characters')
        else if (clean.length > 20) setCustomError('Maximum 20 characters')
        else                        setCustomError('')
    }

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault()
        if (customError) return
        setLoading(true)
        setResult(null)
        try {
            const res = await api.post('/urls', {
                originalUrl,
                ...(customUrl ? { customUrl } : {}),
            })
            setResult(res.data.data)
            setOriginalUrl('')
            setCustomUrl('')
            setCustomError('')
            toast.success('URL shortened!')
        } catch (err) {
            const e    = err as ApiError
            const msg  = e?.response?.data?.message ?? ''
            const code = e?.response?.status

            
            if (
                code === 403 ||
                msg.toLowerCase().includes('limit') ||
                msg.toLowerCase().includes('upgrade')
            ) {
                toast.error('URL limit reached! Upgrade your plan to create more.', { duration: 4000 })
            } else if (msg.toLowerCase().includes('custom') || msg.toLowerCase().includes('already')) {
                toast.error('Custom alias already taken. Try a different one.')
            } else {
                toast.error(msg || 'Failed to shorten URL')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        if (!result) return
        navigator.clipboard.writeText(result.shortUrlFull)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section
            id="home"
            className="w-full min-h-screen flex items-center justify-center px-4 py-20 bg-white"
        >
            <div className="w-full max-w-2xl flex flex-col items-center text-center gap-6">

                <p className="text-brand-primary text-xs font-semibold tracking-widest uppercase">
                    URL Shortener
                </p>

                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                    Short links with
                    <br />
                    <span className="text-brand-primary">real analytics</span>
                </h1>

                <p className="text-gray-500 text-base max-w-md leading-relaxed">
                    Create short, branded links and track every click with
                    device, location, and referrer data.
                </p>

                {user ? (
                    <div className="w-full mt-4 flex flex-col gap-3">
                        <form onSubmit={handleShorten} className="flex flex-col gap-3">

                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="url"
                                    value={originalUrl}
                                    onChange={(e) => setOriginalUrl(e.target.value)}
                                    placeholder="https://your-long-url.com"
                                    required
                                    className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !!customError}
                                    className="border border-brand-primary text-brand-primary hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold px-5 py-3 rounded-lg transition-colors whitespace-nowrap"
                                >
                                    {loading ? 'Shortening...' : 'Shorten'}
                                </button>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-3 gap-2 focus-within:border-brand-primary transition-colors">
                                    <span className="text-gray-400 text-xs shrink-0">
                                        bytesurl.onrender.com/
                                    </span>
                                    <input
                                        type="text"
                                        value={customUrl}
                                        onChange={(e) => handleCustomChange(e.target.value)}
                                        placeholder="custom-alias (optional)"
                                        maxLength={20}
                                        className="flex-1 bg-transparent text-gray-900 text-sm placeholder-gray-400 focus:outline-none min-w-0"
                                    />
                                    {customUrl.length > 0 && (
                                        <span className="text-xs text-gray-400 shrink-0">
                                            {customUrl.length}/20
                                        </span>
                                    )}
                                </div>
                                {customError && (
                                    <p className="text-red-500 text-xs px-1 text-left">
                                        {customError}
                                    </p>
                                )}
                            </div>

                        </form>


                        <div
                            style={{
                                maxHeight:  result ? '120px' : '0px',
                                opacity:    result ? 1 : 0,
                                overflow:   'hidden',
                                transition: 'max-height 0.4s ease, opacity 0.4s ease',
                            }}
                        >
                            <div className="bg-gray-50 border border-purple-200 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-gray-400 text-xs">Short URL</span>
                                    <a
                                        href={result?.shortUrlFull}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-brand-primary text-sm hover:underline truncate"
                                    >
                                        {result?.shortUrlFull}
                                    </a>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-md border transition-all ${
                                        copied
                                            ? 'bg-green-50 text-green-600 border-green-200'
                                            : 'bg-white text-brand-primary border-brand-primary hover:bg-purple-50'
                                    }`}
                                >
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-8 mt-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/register"
                                className="bg-brand-primary hover:bg-[#6D28D9] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/login"
                                className="border border-brand-primary text-brand-primary hover:bg-purple-50 text-sm font-medium px-6 py-3 rounded-lg transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>

                        <div className="flex items-center gap-10">
                            {[
                                { value: '10',  label: 'Free URLs' },
                                { value: '500', label: 'PRO / month' },
                                { value: '∞',   label: 'Ultimate' },
                            ].map((s) => (
                                <div key={s.label} className="flex flex-col items-center gap-1">
                                    <span className="text-xl font-bold text-gray-900">{s.value}</span>
                                    <span className="text-xs text-gray-400">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    )
}