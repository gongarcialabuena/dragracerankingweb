import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'

export async function GET(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { data, error: dbError } = await supabase
        .from("point_type")
        .select()
        .order('value', { ascending: false })
    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json(data)
}