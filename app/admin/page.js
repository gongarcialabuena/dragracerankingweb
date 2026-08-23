'use client'

import { useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'

import QueensAdmin from './queens/QueensAdmin'
import SeasonsAdmin from './seasons/SeasonsAdmin'
import ProfilesAdmin from './profiles/ProfilesAdmin'

import styles from './page.module.css'

export default function AdminPage() {
    const [modeIsOpen, setModeIsOpen] = useState(false)
    const [mode, setMode] = useState('Reinas')

    const modes = [
        'Reinas',
        'Temporadas',
        'Perfiles'
    ]

    const handleModeChange = (newMode) => {
        setMode(newMode)
        setModeIsOpen(false)
    }

    return (
        <main className={styles.container}>

            <div className={styles.header}>

                <h1>Administración</h1>

                <div className={styles.modeSelector}>

                    <button
                        type="button"
                        className={styles.modeButton}
                        onClick={() => setModeIsOpen(prev => !prev)}
                    >
                        {mode}

                        <FaCaretDown
                            className={
                                modeIsOpen
                                    ? styles.caretOpen
                                    : styles.caret
                            }
                        />
                    </button>

                    {modeIsOpen && (
                        <div className={styles.dropdown}>
                            {modes.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={`${styles.dropdownItem} ${
                                        mode === item
                                            ? styles.selected
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handleModeChange(item)
                                    }
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            <section className={styles.content}>

                {mode === 'Reinas' && <QueensAdmin />}

                {mode === 'Temporadas' && <SeasonsAdmin />}

                {mode === 'Perfiles' && <ProfilesAdmin />}

            </section>

        </main>
    )
}