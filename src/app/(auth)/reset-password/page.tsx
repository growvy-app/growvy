'use client'

import { useState, useEffect } from 'react'
import { inter } from '@/app/ui/fonts'
import { useSearchParams } from 'next/navigation'
import { updatePassword } from '@/app/(auth)/actions'
import PasswordInput from '@/app/components/PasswordInput'

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const searchParams = useSearchParams()
    const code = searchParams.get('code')

    useEffect(() => {
        if (!code) {
            setError('Invalid reset link. Please request a new password reset.')
        }
    }, [code])

    async function handleSubmit(formData: FormData) {
        if (!code) {
            setError('Invalid reset link')
            return
        }

        setError(null)
        setLoading(true)
        setSuccess(false)

        const result = await updatePassword(formData, code)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (!code) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                    <div className="text-center">
                        <h2 className={`${inter.className} text-3xl font-bold text-gray-900`}>
                            Invalid Reset Link
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            This password reset link is invalid or has expired. Please request a new password reset.
                        </p>
                        <div className="mt-4">
                            <a
                                href="/auth/forgot-password"
                                className="text-indigo-600 hover:text-indigo-500"
                            >
                                Request new reset link
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className={`${inter.className} text-3xl font-bold text-gray-900`}>
                        Reset your password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {success ? (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4">
                        <p className="text-sm text-green-700">
                            Password successfully reset. You can now <a href="/login" className="font-medium underline">log in</a> with your new password.
                        </p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" action={handleSubmit}>
                        <div className="space-y-4">
                            <PasswordInput
                                id="password"
                                name="password"
                                label="New password"
                                required
                                minLength={6}
                            />

                            <PasswordInput
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm new password"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
} 