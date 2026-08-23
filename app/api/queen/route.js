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
  const seasonId = searchParams.get("seasonId")

  const page = Number(searchParams.get("page")) || 1
  const pageSize = 20

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from("participate")
    .select(`
      image_url,
      season: season_id(
        id,
        name,
        franchise
      ),
      queen: queen_id (
        id,
        name
      )
    `, { count: "exact" })
     .order('queen(name)', { ascending: true })
     .range(from, to)

  if (seasonId) {
    query = query.eq("season_id", seasonId)
  }

  const { data, count, error: dbError } = await query

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    totalPages: Math.ceil(count / pageSize)
  })
}

export async function POST(request) {
  const { supabase, response } = await getAuthenticatedAdmin()

  if (response) {
      return response
  }

  const body = await request.json()
  const { data, error: dbError } = await supabase.rpc(
    'create_queen_participate',
    {
      p_name: body.name,
      p_season_id: body.seasonId,
      p_image_url: body.image_Url
    }
  )

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

export async function DELETE(request) {
  const { supabase, user, error: authError } = await getAuthenticatedUser()

    if (!user) {
        return Response.json(
            { error: authError.message },
            { status: 401 }
        )
    }

  const body = await request.json()

  const { data, error: dbError } = await supabase
    .from('queen')
    .delete()
    .eq('id', body.id)

  if (dbError) {
    return NextResponse.json(
      { error: dbError.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}