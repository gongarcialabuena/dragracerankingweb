import { createClient } from '@/lib/supabase/server'

export async function getAuthenticatedUser(){
    const supabase = await createClient()

    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    if (error || !user) {
        return {
            supabase,
            user: null,
            error: error ?? new Error('Usuario no autenticado')
        }
    }
    return {
        supabase,
        user,
        error: null
    }
}

export async function getAuthenticatedAdmin() {
    const { supabase, user, error } = await getAuthenticatedUser()

    if (!user) {
        return {
            supabase,
            user: null,
            profile: null,
            response: NextResponse.json(
                { error: error?.message ?? 'Usuario no autenticado' },
                { status: 401 }
            )
        }
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, username, role')
        .eq('id', user.id)
        .single()

    if (profileError) {
        return {
            supabase,
            user,
            profile: null,
            response: NextResponse.json(
                { error: profileError.message },
                { status: 500 }
            )
        }
    }

    if (profile.role !== 'admin') {
        return {
            supabase,
            user,
            profile,
            response: NextResponse.json(
                { error: 'No tienes permisos de administrador' },
                { status: 403 }
            )
        }
    }

    return {
        supabase,
        user,
        profile,
        response: null
    }
}
