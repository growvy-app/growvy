'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'

export default function EmailConfirmationPage() {
    const searchParams = useSearchParams()
    const success = searchParams.get('success') === 'email-change'
    const error = searchParams.get('error') === 'email-change'
    const message = searchParams.get('message')
    const [emailVerified, setEmailVerified] = useState(false)

    useEffect(() => {
        // Poll for email verification status
        const checkEmailVerification = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user?.email_confirmed_at) {
                setEmailVerified(true)
                // If opener window exists, trigger a refresh
                if (window.opener) {
                    window.opener.location.reload()
                }
            }
        }

        const interval = setInterval(checkEmailVerification, 2000) // Check every 2 seconds

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        {emailVerified ? (
                            <>
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                Email Changed Successfully
                            </>
                        ) : error ? (
                            <>
                                <XCircle className="h-6 w-6 text-red-500" />
                                Email Change Failed
                            </>
                        ) : (
                            <>
                                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                Confirming Email Change
                            </>
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <CardDescription className="text-center text-base">
                        {emailVerified
                            ? "Your email has been successfully updated. You can close this window."
                            : error
                                ? message || "There was an error changing your email. Please try again."
                                : "Please wait while we confirm your email change..."}
                    </CardDescription>

                    <div className="flex justify-center">
                        <Button
                            onClick={() => window.close()}
                            variant="outline"
                        >
                            Close Window
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 