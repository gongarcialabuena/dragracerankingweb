'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import styles from './Header.module.css'
import { profileService } from '@/lib/services/profileService'

export default function Header() {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        getProfile()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                getProfile()
            } else {
                setProfile(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const handleGoogleLogin = async () => {
        window.location.href = '/login'
    }

    const handleGoogleRegister = async () => {
        window.location.href = '/register'
    }

    const getProfile = async () => {
        const profileData = await profileService.getProfileData()
        setProfile(profileData)
    }

    return (
        <header className={styles.header}>
            <div className={styles.container}>

                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    DragRaceRanking
                </Link>

                {/* Navegación */}
                <nav className={styles.nav}>
                    <Link href="/ranking" className={styles.buttonHeader}>Ranking</Link>
                    <Link href="/test" className={styles.buttonHeader}>Testing</Link>
                    <Link href="/admin" className={styles.buttonHeader}>Administrador</Link>
                </nav>

                {/* Usuario */}
                <div className={styles.auth}>
                    {profile ? (
                        <>
                            <Link href="/profile" className={styles.profile}>
                               {profile.username}
                            </Link>
                        </>
                    ) : (
                        <>
                            <button onClick={handleGoogleLogin} className={styles.login}>
                               Login
                            </button>

                            <button onClick={handleGoogleRegister} className={styles.register}>
                                Register
                            </button>
                        </>
                    )}
                </div>

            </div>
        </header>
    )
}