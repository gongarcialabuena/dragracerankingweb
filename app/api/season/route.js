import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'


export async function GET() {
    const { data, error } = await supabaseAdmin
        .from('season')
        .select('*')
        .order('year', { ascending: false })
        
    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
    return NextResponse.json(data)
}

export async function POST(request) {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
        .from('season')
        .insert({
            name: body.name,
            franchise: body.franchise,
            year: body.year
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