'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Message {
    role: 'user' | 'ai'
    content: string
}

export default function AIPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'Hi 👋 I am your BytesURL assistant. Ask me anything!' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMessage = input

        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            })

            const data = await res.json()

            setMessages(prev => [
                ...prev,
                { role: 'ai', content: data?.data || 'No response' },
            ])
        } catch {
            setMessages(prev => [
                ...prev,
                { role: 'ai', content: 'Something went wrong. Try again.' },
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="w-full h-screen flex flex-col bg-gray-50">

            <div className="w-full border-b bg-white px-4 py-3 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-sm border border-brand-primary text-brand-primary px-4 py-1.5 rounded-md hover:bg-purple-50 transition"
                >
                    ← Home
                </Link>

                <h1 className="text-sm font-semibold text-gray-900">
                    AI Assistant
                </h1>

                <div />
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto flex flex-col gap-4">

                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${
                                msg.role === 'user'
                                    ? 'justify-end'
                                    : 'justify-start'
                            }`}
                        >
                            <div
                                className={`px-4 py-2 rounded-xl text-sm max-w-[80%] leading-relaxed shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-brand-primary text-white'
                                        : 'bg-white border text-gray-800'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="text-xs text-gray-400">
                            AI is thinking...
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>


            <div className="w-full border-t bg-white px-4 py-3">
                <div className="max-w-3xl mx-auto flex gap-2">

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask something..."
                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand-primary"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="bg-brand-primary text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                        Send
                    </button>

                </div>
            </div>
        </section>
    )
}