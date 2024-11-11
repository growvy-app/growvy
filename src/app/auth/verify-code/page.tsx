'use client'

import { inter } from '@/app/ui/fonts'
import { verifyCode } from '@/app/(auth)/actions'
import { useState, useRef, useEffect } from 'react'

export default function VerifyCode() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const inputs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ]

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value

        if (value && index < 3) {
            inputs[index + 1].current?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
            inputs[index - 1].current?.focus()
        }
    }

    async function handleSubmit(formData: FormData) {
        setError(null)
        setLoading(true)

        const result = await verifyCode(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
                <h2 className={`${inter.className} text-3xl font-bold text-gray-900`}>
                    Enter verification code
                </h2>
                <p className="text-gray-600">
                    We've sent a 4-digit code to your email
                </p>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" action={handleSubmit}>
                    <div className="flex justify-center gap-4">
                        {inputs.map((ref, i) => (
                            <input
                                key={i}
                                ref={ref}
                                type="text"
                                maxLength={1}
                                name={`code-${i}`}
                                className="w-12 h-12 text-center text-2xl border-2 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                                onChange={(e) => handleInput(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </div>
    )
} 