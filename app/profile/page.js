'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import styles from './page.module.css'
import { profileService } from '@/lib/services/profileService'

export default function ProfilePage() {

    const router = useRouter()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser()

            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }

            if (!data.user) {
                router.push('/login')
                return
            } 
            getProfileData();
        }

        getUser()
    }, [router])

    const getProfileData = async () => {
        const profileData = await profileService.getProfileData()
        setUser(profileData)
        setLoading(false)
    }

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            setError(error.message)
            return
        }

        router.push('/login')
    }

    if (loading) {
        return (
            <main className={styles.container}>
                <p>Cargando perfil...</p>
            </main>
        )
    }

    if (!user) {
        return null
    }

    return (
        <main className={styles.container}>

            <div className={styles.profile}>

                <header className={styles.header}>
                    <h1>Mi perfil</h1>
                </header>

                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}

                <section className={styles.section}>
                    <h2>Datos personales</h2>

                    <div className={styles.info}>
                        <span className={styles.label}>
                            Usuario
                        </span>

                        <span>
                            {user.full_name}
                        </span>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>
                            Nombre Drag
                        </span>

                        <span>
                            {user.username}
                        </span>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>Estadísticas</h2>

                    <div className={styles.comingSoon}>
                        <p>
                            Podrás consultar tus estadísticas.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <h2>Cuenta</h2>

                    <button
                        className={styles.logout}
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </button>
                </section>

            </div>

        </main>
    )
}