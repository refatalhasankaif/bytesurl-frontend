'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Contact() {
    const [name,    setName]    = useState('')
    const [email,   setEmail]   = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                {
                    name,          
                    sender_email: email, 
                    message,            
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
            )
            toast.success('Message sent!')
            setName('')
            setEmail('')
            setMessage('')
        } catch {
            toast.error('Failed to send. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="contact" className="w-full py-40 px-4 bg-gray-50">
            <div className="mx-auto max-w-lg">

                <div className="text-center mb-10">
                    <p className="text-brand-primary text-xs font-semibold tracking-widest uppercase mb-3">
                        Contact
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Get in touch
                    </h2>
                    <p className="text-gray-500 text-sm mt-3">
                        Have a question? We&apos;d love to hear from you.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
                >
                    <div>
                        <label className="text-sm text-gray-700 mb-1 block font-medium">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition"
                        />
                    </div>

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

                    <div>
                        <label className="text-sm text-gray-700 mb-1 block font-medium">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="How can we help you?"
                            required
                            rows={4}
                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition text-sm"
                    >
                        <Send className="w-4 h-4" />
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

            </div>
        </section>
    )
}