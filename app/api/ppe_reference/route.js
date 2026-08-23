import { NextResponse } from 'next/server'
import { getAuthenticatedAdmin } from '@/lib/supabase/auth'

export async function POST(request) {

    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

    const body = await request.json()

    const { data, error } = await supabase.rpc(
        'publish_ranking',
        {
            p_season_id: body.seasonId
        }
    )

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        )
    }

    return NextResponse.json(data)
}