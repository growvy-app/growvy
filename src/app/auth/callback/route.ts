import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    if (token_hash && type) {
        const supabase = await createClient()

        if (type === 'email_change') {
            const { error } = await supabase.auth.verifyOtp({
                token_hash,
                type: 'email_change',
            })

            if (error) {
                return NextResponse.redirect(
                    `${requestUrl.origin}/dashboard/settings?error=email-change&message=${error.message}`
                )
            }

            return NextResponse.redirect(
                `${requestUrl.origin}/dashboard/settings?success=email-change`
            )
        }

        // Handle other auth flows
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email',
        })

        if (error) {
            return NextResponse.redirect(
                `${requestUrl.origin}/error?error=${error.message}`
            )
        }

        return NextResponse.redirect(`${requestUrl.origin}${next}`)
    }

    // Return the user to an error page if no token_hash is present
    return NextResponse.redirect(`${requestUrl.origin}/error`)
} 