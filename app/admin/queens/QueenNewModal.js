'use client'

import { useEffect, useState } from 'react'
import styles from './modal.module.css'
import { FaCaretDown } from 'react-icons/fa'
import { seasonService } from '@/lib/services/seasonService'
import { wikiImgService } from "@/lib/services/wikiImgService";

export default function QueenNewModal({
    onClose,
    onSave
}) {
    const [name, setName] = useState('')
    const [selectedSeason, setSelectedSeason] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [seasons, setSeasons] = useState([])
    const [imagePreview, setImagePreview] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        onSave({name: name, season: selectedSeason})
    }

    const handleSeasonChange = (season) => {
        setSelectedSeason(season)
        setDropdownOpen(false)
    }
    

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const seasonList = await seasonService.getAllSeasons()
                setSeasons(seasonList)
            } catch (error) {
                console.error('Error fetching queens list:', error)
            } 
        }

        fetchSeasons()
    }, [])

    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
        >
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <h3>Añadir nueva reina</h3>

                <form onSubmit={handleSubmit}>

                    <div className={styles.formGroup}>
                        <label htmlFor="queenName">
                            Nombre
                        </label>

                        <input
                            id="queenName"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    {imagePreview && (
                        <img className={styles.queenimg}
                            src={imagePreview}
                            alt="Imagen de la reina"
                        />
                    )}
                    <div className={styles.selector}>

                        <label htmlFor="queenName">
                            En temporada
                        </label>

                        <button
                            type="button"
                            className={styles.selectorButton}
                            onClick={() => setDropdownOpen(prev => !prev)}
                        >
                            <span>
                                {selectedSeason
                                    ? `${selectedSeason.name}`
                                    : 'Selecciona una temporada'
                                }
                            </span>

                            <FaCaretDown
                                className={`${styles.caret} ${
                                    dropdownOpen ? styles.caretOpen : ''
                                }`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className={styles.dropdown}>

                                {seasons.map(season => (
                                    <button
                                        key={season.id}
                                        type="button"
                                        className={`${styles.dropdownItem} ${
                                            selectedSeason?.id === season.id
                                                ? styles.selected
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleSeasonChange(season)
                                        }
                                    >
                                        <span>{season.name}</span>
                                    </button>
                                ))}

                            </div>
                        )}

                    </div>

                    <div className={styles.modalActions}>

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            disabled={!name.trim() || !selectedSeason}
                            onClick={async () => {
                                try {
                                    const imgBlob = await wikiImgService.getQueenImgWiki(
                                        name.replace(/\s+/g, ''),
                                        selectedSeason
                                    )

                                    if (!imgBlob) {
                                        return
                                    }
                                    setImagePreview(URL.createObjectURL(imgBlob))
                                } catch (error) {
                                    console.error('Error loading queen image:', error)
                                }
                            }}
                        >
                            Cargar imagen
                        </button>

                        <button
                            type="submit"
                            disabled={!name.trim() || !selectedSeason}
                        >
                            Guardar
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}