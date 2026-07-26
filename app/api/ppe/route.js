import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const seasonId = searchParams.get("seasonId")

    const { data, error } = await supabaseAdmin
        .from('points_per_episode')
        .select()
        .eq("client_id", clientId)
        .eq("season_id", seasonId);

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
    return NextResponse.json(data)

}

export async function POST(request) {
    const rows = await request.json();

    const { error } = await supabaseAdmin
        .from("points_per_episode")
        .upsert(rows, {
            onConflict: "client_id,season_id,episode_id,queen_id"
        });

    if (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(request) {
    const rowsToDelete = await request.json()
    const { data, error } = await supabaseAdmin.rpc(
        "delete_points", 
        {
            p_rows: rowsToDelete
        }
    );

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