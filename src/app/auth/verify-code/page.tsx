'use client'

import { inter } from '@/app/ui/fonts'
import { verifyCode, resendCode } from '@/app/(auth)/actions'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyCode() {
    const [countdown, setCountdown] = useState(30)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const inputs = useRef<(HTMLInputElement | null)[]>([])

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    // Handle input changes and auto-focus
    const handleInput = async (index: number, value: string) => {
        if (value.length > 1) {
            value = value[0] // Only take first character
        }

        // Update input value
        if (inputs.current[index]) {
            inputs.current[index]!.value = value
        }

        // Move to next input if value is entered
        if (value && index < 3) {
            inputs.current[index + 1]?.focus()
        }

        // If last digit entered, submit automatically
        if (index === 3 && value) {
            const code = inputs.current
                .map(input => input?.value)
                .join('')

            if (code.length === 4) {
                await handleVerify(code)
            }
        }
    }

    // Handle backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
            inputs.current[index - 1]?.focus()
        }
    }

    const handleVerify = async (code: string) => {
        setError(null)
        setLoading(true)

        const formData = new FormData()
        for (let i = 0; i < 4; i++) {
            formData.append(`code-${i}`, code[i])
        }

        const result = await verifyCode(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // If successful, the action will handle redirect
    }

    const handleResend = async () => {
        setError(null)
        setLoading(true)

        const result = await resendCode()

        if (result?.error) {
            setError(result.error)
        } else {
            setCountdown(30) // Reset countdown
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
                <h2 className={`${inter.className} text-3xl font-bold text-gray-900`}>
                    Verify your email
                </h2>
                <p className="text-gray-600">
                    We've sent a 4-digit code to your email
                </p>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center gap-4 my-8">
                    {[0, 1, 2, 3].map((i) => (
                        <input
                            key={i}
                            ref={el => inputs.current[i] = el}
                            type="text"
                            maxLength={1}
                            className="w-14 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => handleInput(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            disabled={loading}
                        />
                    ))}
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleResend}
                        disabled={countdown > 0 || loading}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${countdown > 0 || loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            } disabled:opacity-50 transition-colors duration-200`}
                    >
                        {loading ? 'Sending...' : countdown > 0 ? `Resend code (${countdown}s)` : 'Resend code'}
                    </button>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                    Didn't receive the code? Check your spam folder.
                </p>
            </div>
        </div>
    )
} 