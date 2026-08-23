import { NextResponse } from 'next/server'
import { getAuthenticatedUser, getAuthenticatedAdmin } from '@/lib/supabase/auth'

export async function GET(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get("season")

    const { data, error: dbError } = await supabase
        .from("episode")
        .select("id, number, title")
        .eq("season_id", seasonId)
        .order('number', { ascending: true })
    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request) {
    const { supabase, response } = await getAuthenticatedAdmin()

    if (response) {
        return response
    }

    const body = await request.json()

    const { data, error: dbError } = await supabase
        .from('episode')
        .insert({
            season_id: body.seasonId,
            title: body.title
        })
        .select() // Devuelve el dato insertado

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}

export async function DELETE(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('season')

    const { data, error: dbError } = await supabase.rpc('delete_last_episode', {
        p_season_id: seasonId
    })

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}