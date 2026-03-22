'use client'

import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Subscription {
    plan:        string
    urlLimit:    number
    urlsCreated: number
}

interface User {
    id:           string
    name:         string | null
    email:        string
    role:         string
    status:       string
    createdAt:    string
    subscription: Subscription | null
}

const planColor = (plan: string) => {
    if (plan === 'ULTIMATE') return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (plan === 'PRO')      return 'text-[#7C3AED] bg-purple-50 border-purple-200'
    return 'text-gray-500 bg-gray-50 border-gray-200'
}

export default function AdminUsersPage() {
    const [users,   setUsers]   = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)
    const [page,    setPage]    = useState(1)
    const [total,   setTotal]   = useState(0)
    const [updating, setUpdating] = useState<string | null>(null)
    const limit = 10

    const load = useCallback(async (p: number) => {
        setLoading(true)
        setError(null)
        try {
            const res   = await api.get(`/admin/users?page=${p}&limit=${limit}`)
            const inner = res.data?.data

            
            setUsers(Array.isArray(inner?.data) ? inner.data : [])
            setTotal(inner?.total ?? 0)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            setError(e?.response?.data?.message ?? 'Failed to load users')
            setUsers([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load(1) }, [load])

    const toggleStatus = async (user: User) => {
        const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        setUpdating(user.id)
        try {
            await api.patch(`/admin/users/${user.id}`, { status: newStatus })
            setUsers((prev) =>
                prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u)
            )
            toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'suspended'}`)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            toast.error(e?.response?.data?.message ?? 'Failed to update status')
        } finally {
            setUpdating(null)
        }
    }

    const totalPages = Math.ceil(total / limit) || 1

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-500 text-sm mt-1">Manage all registered users.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">{total} total users</p>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">No users found.</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">User</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Role</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Plan</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">URLs</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Status</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Joined</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-gray-900 text-sm">{user.name ?? '—'}</p>
                                                <p className="text-gray-400 text-xs">{user.email}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                                    user.role === 'ADMIN'
                                                        ? 'text-brand-primary bg-purple-50 border-purple-200'
                                                        : 'text-gray-500 bg-gray-50 border-gray-200'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${planColor(user.subscription?.plan ?? 'FREE')}`}>
                                                    {user.subscription?.plan ?? 'FREE'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-600 text-xs">
                                                {user.subscription?.urlsCreated ?? 0} / {user.subscription?.urlLimit ?? 10}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                                    user.status === 'ACTIVE'
                                                        ? 'text-green-600 bg-green-50 border-green-200'
                                                        : 'text-red-500 bg-red-50 border-red-200'
                                                }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-400 text-xs">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => toggleStatus(user)}
                                                        disabled={updating === user.id}
                                                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                                                            user.status === 'ACTIVE'
                                                                ? 'border-red-200 text-red-500 hover:bg-red-50'
                                                                : 'border-green-200 text-green-600 hover:bg-green-50'
                                                        }`}
                                                    >
                                                        {updating === user.id
                                                            ? '...'
                                                            : user.status === 'ACTIVE' ? 'Suspend' : 'Activate'
                                                        }
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { const p = page - 1; setPage(p); load(p) }}
                                        disabled={page === 1}
                                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg disabled:opacity-40 hover:border-brand-primary hover:text-brand-primary transition-colors"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={() => { const p = page + 1; setPage(p); load(p) }}
                                        disabled={page === totalPages}
                                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg disabled:opacity-40 hover:border-brand-primary hover:text-brand-primary transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}