import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const seasonId = searchParams.get("seasonId")

  const page = Number(searchParams.get("page")) || 1
  const pageSize = 20

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabaseAdmin
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

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    totalPages: Math.ceil(count / pageSize)
  })
}

export async function POST(request) {
  const body = await request.json()
  const { data, error } = await supabaseAdmin.rpc(
    'create_queen_participate',
    {
      p_name: body.name,
      p_season_id: body.seasonId,
      p_image_url: body.image_Url
    }
  )

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

export async function DELETE(request) {
  const body = await request.json()

  const { data, error } = await supabaseAdmin
    .from('queen')
    .delete([body])
    .eq('id', body.id)

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}