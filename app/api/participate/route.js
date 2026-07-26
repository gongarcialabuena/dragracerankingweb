import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'


export async function POST(request) {
    const body = await request.json()

    const { data, error } = await supabaseAdmin
        .from('participate')
        .insert({
            queen_id: body.queenId,
            season_id: body.seasonId,
            image_url: body.image_url
        })
        .select() // Devuelve el dato insertado

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json({
        exists: !!data
    })
}

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from('participate')
        .select('*')
    
    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}

//Comprueba si Queen tiene mas de 1 participacion. Si tiene mas de 1 la elimina y devuelve TRUE.
//Si solo tiene 1 participacion devuelve false y no elimina ninguna participación, le tocara eliminarse
//con la funcion de QueenAPI
export async function DELETE(request) {
    const body = await request.json()

    const { count } = await supabaseAdmin
        .from("participate")
        .select("*", { count: "exact", head: true })
        .eq("queen_id", body.queenId);

    if (count > 1) {
        await supabaseAdmin
            .from("participate")
            .delete()
            .eq("queen_id", body.queenId)
            .eq("season_id", body.seasonId);

        return NextResponse.json(true)
    }

    return NextResponse.json(false)
}