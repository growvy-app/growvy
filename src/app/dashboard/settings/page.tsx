'use client'

import { useState, useEffect } from 'react'
import { updateEmail } from '@/app/(auth)/actions'
import { createClient } from '@/utils/supabase/client'
import ConfirmDialog from '@/app/components/ConfirmDialog'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [currentEmail, setCurrentEmail] = useState<string | null>(null)
    const [newEmail, setNewEmail] = useState<string>('')
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    useEffect(() => {
        async function getUser() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email) {
                setCurrentEmail(user.email)
            }
        }
        getUser()
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        // Check if new email is the same as current email
        if (newEmail === currentEmail) {
            setError('New email cannot be the same as your current email')
            return
        }

        setShowConfirmDialog(true)
    }

    async function confirmEmailChange() {
        setError(null)
        setLoading(true)
        setSuccess(false)
        setShowConfirmDialog(false)

        const formData = new FormData()
        formData.append('email', newEmail)

        const result = await updateEmail(formData)

        if (result?.error) {
            setError(result.error)
        } else {
            setSuccess(true)
            setShowForm(false)
            setNewEmail('')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <Link className="text-sm text-gray-500 mb-4 inline-flex items-center gap-2" href="/dashboard">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Settings
                    </h1>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                            <p className="text-sm text-green-700">
                                Email update initiated. Please check your new email for a confirmation link.
                            </p>
                        </div>
                    )}

                    <div className="space-y-6 max-w-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <p className="mt-1 text-sm text-gray-900">{currentEmail}</p>
                            </div>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {showForm ? 'Cancel' : 'Change Email'}
                            </button>
                        </div>

                        {showForm && (
                            <form onSubmit={handleSubmit} className="space-y-6 mt-4 border-t pt-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        New Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Updating...' : 'Update Email'}
                                </button>
                            </form>
                        )}
                    </div>

                    <ConfirmDialog
                        isOpen={showConfirmDialog}
                        onClose={() => setShowConfirmDialog(false)}
                        onConfirm={confirmEmailChange}
                        title="Confirm Email Change"
                        message={
                            <p>
                                Are you sure you want to change your email from{' '}
                                <span className="font-medium">{currentEmail}</span> to{' '}
                                <span className="font-medium">{newEmail}</span>?
                            </p>
                        }
                    />
                </div>
            </div>
        </div>
    )
} 