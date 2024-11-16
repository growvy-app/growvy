import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    if (token_hash && type) {
        const supabase = await createClient()

        // Exchange the token hash for a session
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (error) {
            // If there was an error during email change
            return NextResponse.redirect(
                `${requestUrl.origin}/dashboard/settings?error=email-change&message=${error.message}`
            )
        }

        // If it's an email change confirmation
        if (type === 'email_change') {
            return NextResponse.redirect(
                `${requestUrl.origin}/dashboard/settings?success=email-change`
            )
        }

        // For other auth flows (password reset, etc), redirect to the next URL
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }

    // Return the user to an error page if no code is present
    return NextResponse.redirect(`${requestUrl.origin}/error`)
} 