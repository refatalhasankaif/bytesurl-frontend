import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
    title:       'BytesURL — Smart URL Shortener',
    description: 'Shorten URLs, track analytics, and manage links with BytesURL',
    icons: {
        icon: '/logo.png',
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={geist.className}>
                <Analytics/>
                <Providers>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: '#1a0f3a',
                                color:      '#fff',
                                border:     '1px solid #7C3AED',
                            }
                        }}
                    />
                </Providers>
            </body>
        </html>
    )
}