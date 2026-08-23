'use client'

import { useEffect, useState } from 'react'
import styles from './modal.module.css'

export default function SeasonNewModal({
    onClose,
    onSave
}) {
    const [name, setName] = useState('')
    const [franchise, setFranchise] = useState('')
    const [year, setYear] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        onSave({name: name.trim(), franchise: franchise.trim(), year: Number(year)})
    }

    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Añadir nuevo temporada</h3>

                <form onSubmit={handleSubmit}>

                    <div className={styles.formGroup}>
                        <label htmlFor="seasonName">
                            Nombre
                        </label>

                        <input
                            id="seasonName"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="franchise">
                            Franquicia (abreviada)
                        </label>

                        <input
                            id="franchise"
                            type="text"
                            onChange={(e) => setFranchise(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="year">
                            Año
                        </label>

                        <input
                            id="year"
                            type="text"
                            onChange={(e) => setYear(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className={styles.modalActions}>

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={!name.trim() || !franchise.trim() || !year}
                        >
                            Guardar
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}