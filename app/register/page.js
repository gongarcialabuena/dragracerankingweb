'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import styles from './page.module.css'

export default function RegisterPage() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()

        setError('')

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                        full_name: username
                    }
                }
            })
            console.log('Usuario creado:', data.user)
            console.log('Sesión:', data.session)
            if (error) {
                throw error
            }

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className={styles.container}>
            <div className={styles.card}>

                <h1>Crear cuenta</h1>

                <form onSubmit={handleRegister}>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">
                            Nombre de usuario
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">
                            Repetir contraseña
                        </label>

                        <div className={styles.passwordContainer}>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className={styles.showPassword}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
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
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>

                </form>

                <p>
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login">
                        Inicia sesión
                    </Link>
                </p>

            </div>
        </main>
    )
}