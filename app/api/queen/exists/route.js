import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get("name")
    const { data } = await supabaseAdmin
        .from("queen")
        .select("id, name")
        .ilike("name", name)
        .maybeSingle()

    return NextResponse.json(data)
}