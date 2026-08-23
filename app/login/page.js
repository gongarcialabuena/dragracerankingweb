'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import styles from './page.module.css'

export default function LoginPage() {

    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) {
                throw error
            }

            router.push('/')

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setError('')
        setLoading(true)

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (error) {
                throw error
            }

        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <main className={styles.container}>
            <div className={styles.card}>

                <h1>Iniciar sesión</h1>

                <form onSubmit={handleLogin}>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">
                            Contraseña
                        </label>

                        <div className={styles.passwordContainer}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className={styles.showPassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className={styles.error}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Iniciando sesión...'
                            : 'Iniciar sesión'}
                    </button>

                </form>

                <div className={styles.separator}>
                    <span>o</span>
                </div>

                <button
                    type="button"
                    className={styles.googleButton}
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    Continuar con Google
                </button>

                <p className={styles.register}>
                    ¿No tienes una cuenta?{' '}
                    <Link href="/register">
                        Regístrate
                    </Link>
                </p>

            </div>
        </main>
    )
}