import { NextResponse } from 'next/server'
import { getAuthenticatedAdmin } from '@/lib/supabase/auth'

export async function GET(request) {
    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

    const { data, error: dbError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }
    return NextResponse.json(data)
}