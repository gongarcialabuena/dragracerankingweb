import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get("season")

    const { data, error } = await supabaseAdmin
        .from("episode")
        .select("id, number, title")
        .eq("season_id", seasonId)
        .order('number', { ascending: true })
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request) {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
        .from('episode')
        .insert({
            season_id: body.seasonId,
            title: body.title
        })
        .select() // Devuelve el dato insertado

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('season')

    const { data, error } = await supabaseAdmin.rpc('delete_last_episode', {
        p_season_id: seasonId
    })

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}