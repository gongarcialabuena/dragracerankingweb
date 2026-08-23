import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = await createClient()

    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    if (error) {
        return Response.json(
            { error: error.message },
            { status: 500 }
        )
    }

    if (!user) {
        return Response.json(
            { authenticated: false },
            { status: 401 }
        )
    }

    return Response.json({
        authenticated: true,
        user: {
            id: user.id,
            email: user.email
        }
    })
}