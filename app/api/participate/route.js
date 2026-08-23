import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'

export async function POST(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const body = await request.json()

    const { data, error: dbError } = await supabase
        .from('participate')
        .insert({
            queen_id: body.queenId,
            season_id: body.seasonId,
            image_url: body.image_url
        })
        .select() // Devuelve el dato insertado

    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }

    return NextResponse.json({
        exists: !!data
    })
}

export async function GET() {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const { data, error: dbError } = await supabase
        .from('participate')
        .select('*')
    
    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data)
}

//Comprueba si Queen tiene mas de 1 participacion. Si tiene mas de 1 la elimina y devuelve TRUE.
//Si solo tiene 1 participacion devuelve false y no elimina ninguna participación, le tocara eliminarse
//con la funcion de QueenAPI
export async function DELETE(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }
    
    const body = await request.json()

    const { count } = await supabase
        .from("participate")
        .select("*", { count: "exact", head: true })
        .eq("queen_id", body.queenId);

    if (count > 1) {
        await supabase
            .from("participate")
            .delete()
            .eq("queen_id", body.queenId)
            .eq("season_id", body.seasonId);

        return NextResponse.json(true)
    }

    return NextResponse.json(false)
}