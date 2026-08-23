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
    
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")
    const { data } = await supabase
        .from("queen")
        .select("id, name")
        .ilike("name", name)
        .maybeSingle()

    return NextResponse.json(data)
}