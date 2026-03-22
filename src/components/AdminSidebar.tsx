'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Link2,
    BarChart2,
    CreditCard,
    Home,
    Menu,
    X,
} from 'lucide-react'

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'URLs', href: '/admin/urls', icon: Link2 },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
]


interface SidebarContentProps {
    pathname: string
    onNavigate: () => void
}

function SidebarContent({ pathname, onNavigate }: SidebarContentProps) {
    const isActive = (href: string) =>
        href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

    return (
        <div className="flex flex-col h-full">


            <div className="px-5 py-5 border-b border-gray-100">
                <p className="text-base font-bold text-gray-900">BytesURL</p>
                <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
            </div>



            <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                                ? 'bg-purple-50 text-brand-primary'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-primary' : 'text-gray-400'}`} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>


            <div className="px-3 py-4 border-t border-gray-100">
                <Link
                    href="/"
                    onClick={onNavigate}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    <Home className="w-4 h-4 text-gray-400 shrink-0" />
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default function AdminSidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <>

            <aside className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200">
                <SidebarContent pathname={pathname} onNavigate={() => { }} />
            </aside>

            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
                <p className="text-sm font-bold text-gray-900">BytesURL Admin</p>
                <button
                    onClick={() => setOpen(true)}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>


            {open && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/40"
                    onClick={() => setOpen(false)}
                />
            )}


            <aside className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">Admin Panel</p>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="h-[calc(100%-57px)]">
                    <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
                </div>
            </aside>
        </>
    )
}