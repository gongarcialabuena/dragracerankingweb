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
    console.log("User ", user.id)
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get("seasonId")

    const { data, error: dbError } = await supabase
        .from('points_per_episode')
        .select(`
            point_type_id!inner(id),
            ppe_reference!inner (
                episode_id!inner(id),
                queen_id!inner(id)
            )
        `)
        .eq('client_id', user.id)
        .eq('ppe_reference.season_id', seasonId)

    //console.log("data", data)
    //console.log("error", dbError)
    if (dbError) {
        return NextResponse.json(
            { error: dbError.message },
            { status: 500 }
        );
    }
    return NextResponse.json(data)

}

export async function POST(request) {
    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    try {
        const { season_id, rows } = await request.json()

        if (!season_id || !Array.isArray(rows)) {
                return Response.json(
                    { error: 'season_id and rows are required' },
                    { status: 400 }
                )
            }

        const { data: references, error: referenceError } = await supabase
            .from('ppe_reference')
            .select('id, queen_id, episode_id')
            .eq('season_id', season_id)
            
        if (referenceError) {
            throw referenceError
        }

        const referenceMap = new Map()

        references.forEach(reference => {
            const key = `${reference.queen_id}|${reference.episode_id}`

            referenceMap.set(key, reference.id)
        })

        const toUpsert = []
        const toDelete = []

        for (const row of rows) {
            const key = `${row.queen_id}|${row.episode_id}`
            const referenceId = referenceMap.get(key)

            if (!referenceId) {
                continue
            }

            if (row.point_type_id) {
                toUpsert.push({
                    client_id: user.id,
                    reference_id: referenceId,
                    point_type_id: row.point_type_id
                })
            } else {
                toDelete.push(referenceId)
            }
        }

        if (toUpsert.length > 0) {
            const { error: upsertError } = await supabase
                .from('points_per_episode')
                .upsert(toUpsert, {
                    onConflict: 'client_id,reference_id'
                })

            if (upsertError) {
                throw upsertError
            }
        }

        if (toDelete.length > 0) {
            const { error: deleteError } = await supabase
                .from('points_per_episode')
                .delete()
                .eq('client_id', user.id)
                .in('reference_id', toDelete)

            if (deleteError) {
                throw deleteError
            }
        }

        return Response.json({
            success: true
        })

    } catch (error) {
        console.error('Error saving ranking:', error)

        return Response.json(
            { error: error.message },
            { status: 500 }
        )
    }
}

export async function DELETE(request) {

    const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

    const rowsToDelete = await request.json()
    const rowsWithUser = rowsToDelete.map(row => ({
        ...row,
        client_id: user.id
    }));

    const { data, error: dbError } = await supabase.rpc(
        "delete_points", 
        {
            p_rows: rowsWithUser
        }
    );

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