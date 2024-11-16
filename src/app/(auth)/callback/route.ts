import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'
    const type = requestUrl.searchParams.get('type')

    if (code) {
        const supabase = await createClient()

        // Exchange the code for a session
        await supabase.auth.exchangeCodeForSession(code)

        // If it's an email change confirmation, redirect to settings
        if (type === 'email_change') {
            return NextResponse.redirect(`${requestUrl.origin}/dashboard/settings?success=email-change`)
        }

        // For other auth flows (password reset, etc), redirect to the next URL
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }

    // Return the user to an error page if no code is present
    return NextResponse.redirect(`${requestUrl.origin}/error`)
} 