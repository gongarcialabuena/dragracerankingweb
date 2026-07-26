import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")
    
    const { data, error } = await supabaseAdmin.storage
        .from('queen-images')
        .getPublicUrl(`${path}`)

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
    return NextResponse.json(data.publicUrl)
}

export async function POST(request) {
    const formData = await request.formData()
    const franchise = formData.get('franchise')
    const name = formData.get('name').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const file = formData.get('file')

    const { data, error } = await supabaseAdmin.storage
        .from('queen-images')
        .upload(
            `${franchise}/${name}CastMug.jpg`,
            file,
            {
                upsert: true
            }
        )

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json(data.path)
}

export async function DELETE(request) {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")

    const { data, error } = await supabaseAdmin.storage
        .from('queen-images')
        .remove(`${path}`);

    if (error) {
        return Response.json(
        { error: error.message },
        { status: 500 }
        );
    }

    return Response.json({ success: true });
}