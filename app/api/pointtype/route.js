import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request) {
    const { data, error } = await supabaseAdmin
        .from("point_type")
        .select()
        .order('value', { ascending: false })
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}