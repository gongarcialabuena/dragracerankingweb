import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = await createClient()

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('Error intercambiando el código:', error)

            return NextResponse.redirect(
                new URL('/login?error=auth_callback_error', request.url)
            )
        }
    }

    return NextResponse.redirect(new URL('/', request.url))
}