'use client'

import { inter } from '@/app/ui/fonts'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmail() {
    const [countdown, setCountdown] = useState(30)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const supabase = createClient()
    const searchParams = useSearchParams()
    const email = searchParams.get('email')

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleResendEmail = async () => {
        if (!email) {
            setMessage({ type: 'error', text: 'No email address found. Please try signing up again.' })
            return
        }

        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        })

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({ type: 'success', text: 'Confirmation email resent successfully!' })
            setCountdown(30) // Reset countdown
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
                <h2 className={`${inter.className} text-3xl font-bold text-gray-900`}>
                    Check your email
                </h2>
                <p className="text-gray-600">
                    We've sent a verification link to{' '}
                    <span className="font-medium">{email}</span>
                </p>

                {message && (
                    <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="mt-6">
                    <button
                        onClick={handleResendEmail}
                        disabled={countdown > 0 || loading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${countdown > 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            } disabled:opacity-50 transition-colors duration-200`}
                    >
                        {loading
                            ? 'Sending...'
                            : countdown > 0
                                ? `Resend email (${countdown}s)`
                                : 'Resend confirmation email'
                        }
                    </button>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                    Make sure to check your spam folder if you don't see the email in your inbox.
                </p>
            </div>
        </div>
    )
} 