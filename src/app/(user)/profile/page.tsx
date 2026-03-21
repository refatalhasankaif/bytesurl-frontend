'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ProfilePage() {
    const { dbUser, refreshDbUser, logout } = useAuth()
    const router = useRouter()

    const [name,      setName]      = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const [saving,    setSaving]    = useState(false)
    const [deleting,  setDeleting]  = useState(false)

    useEffect(() => {
        if (dbUser) {
            setName(dbUser.name ?? '')
            setAvatarUrl(dbUser.avatarUrl ?? '')
        }
    }, [dbUser])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await api.patch('/users/me', { name, avatarUrl: avatarUrl || undefined })
            await refreshDbUser()
            toast.success('Profile updated!')
        } catch {
            toast.error('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure? This will permanently delete your account and all your URLs.')) return
        setDeleting(true)
        try {
            await api.delete('/users/me')
            await logout()
            router.push('/')
            toast.success('Account deleted')
        } catch {
            toast.error('Failed to delete account')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account details.</p>
            </div>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full border-2 border-brand-primary overflow-hidden bg-purple-50 flex items-center justify-center shrink-0">
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt={name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            onError={() => setAvatarUrl('')}
                        />
                    ) : (
                        <span className="text-brand-primary text-xl font-bold">
                            {name?.charAt(0)?.toUpperCase() ?? '?'}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-gray-900 font-semibold">{dbUser?.name}</p>
                    <p className="text-gray-400 text-sm">{dbUser?.email}</p>
                    <span className="text-xs font-medium text-brand-primary bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {dbUser?.subscription?.plan ?? 'FREE'}
                    </span>
                </div>
            </div>

            <form onSubmit={handleUpdate} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4 mb-6">
                <h2 className="text-sm font-semibold text-gray-900">Update Profile</h2>

                <div>
                    <label className="text-sm text-gray-700 mb-1 block font-medium">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-700 mb-1 block font-medium">Email</label>
                    <input
                        type="email"
                        value={dbUser?.email ?? ''}
                        disabled
                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-gray-400 text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                </div>

                <div>
                    <label className="text-sm text-gray-700 mb-1 block font-medium">Avatar URL</label>
                    <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.png"
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-brand-primary transition"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="self-start bg-brand-primary hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Account Info</h2>
                <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Member since</span>
                        <span className="text-gray-900 font-medium">
                            {dbUser?.createdAt
                                ? new Date(dbUser.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                  })
                                : '—'
                            }
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Role</span>
                        <span className="text-gray-900 font-medium">{dbUser?.role ?? '—'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className={`font-medium ${
                            dbUser?.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'
                        }`}>
                            {dbUser?.status ?? '—'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-red-100 rounded-xl p-6">
                <h2 className="text-sm font-semibold text-red-500 mb-2">Danger Zone</h2>
                <p className="text-xs text-gray-400 mb-4">
                    Deleting your account is permanent. All your URLs and data will be removed.
                </p>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
                >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
            </div>

        </div>
    )
}