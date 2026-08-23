'use client'

import { seasonService } from '@/lib/services/seasonService'
import { episodeService } from '@/lib/services/episodeService'
import { ppeService } from '@/lib/services/ppeService'
import { useEffect, useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'
import styles from './seasons.module.css'
import EpisodeEditModal from './EpisodeEditModal'
import EpisodeNewModal from './EpisodeNewModal'
import SeasonNewModal from './SeasonNewModal'
import SeasonEditModal from './SeasonEditModal'

export default function SeasonsAdmin() {

    const [seasonsMap, setSeasonsMap] = useState(new Map())
    const [selectedSeason, setSelectedSeason] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [editingEpisode, setEditingEpisode] = useState(null)
    const [newEpisode, setNewEpisode] = useState(null)
    const [newSeason, setNewSeason] = useState(null)
    const [editSeason, setEditSeason] = useState(null)

    const fetchSeasons = async (selectSeason) => {
        try {
            const map = await seasonService.getSeasonsWithEpisodes()

            setSeasonsMap(map)

            if(selectSeason){
                const selected = Array.from(map.keys()).find(season => season.id === selectSeason.id)

                if (selected) {
                    setSelectedSeason(selected)
                }
            }else{
                const firstSeason = map.keys().next().value

                if (firstSeason) {
                    setSelectedSeason(firstSeason)
                }
            }
        } catch (error) {
            console.error('Error fetching seasons:', error)
        }
    }

    useEffect(() => {
        fetchSeasons()
    }, [])

    const updateEpisodesList = async () => {
        try {
            const updatedEpisodes = await episodeService.getEpisodes(selectedSeason.id)
            setSeasonsMap(prev => {
                const newMap = new Map(prev)
                newMap.set(selectedSeason, updatedEpisodes)
                return newMap
            })
        } catch (error) {
            console.error('Error fetching episodes for the season:', error)
        }
    }

    const handleSeasonChange = (season) => {
        setSelectedSeason(season)
        setDropdownOpen(false)
    }

    const selectedEpisodes = selectedSeason
        ? seasonsMap.get(selectedSeason)
        : []

    return (
        <div className={styles.container}>

            <h2>Administrar temporadas</h2>

            {/* Selector de temporada */}

            <div className={styles.selector}>

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

                <button
                    type="button"
                    className={styles.addEpisode}
                    onClick={() => {
                        setNewSeason(true)
                    }}
                >
                    Añadir nueva temporada
                </button>

                <button
                    type="button"
                    className={styles.addEpisode}
                    disabled={!selectedSeason}
                    onClick={() => {
                        setEditSeason(true)
                    }}
                >
                    Editar temporada
                </button>

                <button
                    type="button"
                    className={styles.addEpisode}
                    disabled={!selectedSeason}
                    onClick={ async () => {
                        await ppeService.publishRanking(selectedSeason)
                        alert("Temporada " + selectedSeason.name + " publicada correctamente")
                    }}
                >
                    Publicar temporada
                </button>
                {dropdownOpen && (
                    <div className={styles.dropdown}>

                        {Array.from(seasonsMap.keys()).map(season => (
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

            {/* Temporada seleccionada */}

            {selectedSeason && (
                <div className={styles.seasonContent}>

                    <div className={styles.seasonHeader}>
                        <h3>{selectedSeason.name}</h3>

                        <p>
                            {selectedSeason.franchise} ·{' '}
                            {selectedSeason.year}
                        </p>
                    </div>

                    <div className={styles.episodes}>

                        <div className={styles.episodesHeader}>
                            <h4>Episodios</h4>

                            <button
                                type="button"
                                className={styles.addEpisode}
                                onClick={() => {
                                    setNewEpisode(true)
                                }}
                            >
                                Añadir episodio
                            </button>

                            <button
                                type="button"
                                className={styles.addEpisode}
                                onClick={ async () => {
                                    await episodeService.deleteLastEpisode(selectedSeason.id);
                                    updateEpisodesList();
                                }}
                            >
                                Eliminar ultimo episodio
                            </button>
                        </div>

                        {selectedEpisodes.map(episode => (
                            <button
                                key={episode.id}
                                type="button"
                                className={styles.episode}
                                onClick={() => setEditingEpisode(episode)}
                            >
                                <span className={styles.episodeNumber}>
                                    {episode.number}
                                </span>

                                <span>
                                    {episode.title}
                                </span>
                            </button>
                        ))}

                    </div>

                </div>
            )}

            {editingEpisode && (
                <EpisodeEditModal
                    episode={editingEpisode}
                    onClose={() => setEditingEpisode(null)}

                    onSave={(updatedEpisode) => {
                        console.log(
                            'Episodio modificado:',
                            updatedEpisode
                        )

                        setEditingEpisode(null)
                    }}
                />
            )}

            {newEpisode && (
                <EpisodeNewModal
                    onClose={() => setNewEpisode(null)}

                    onSave={ async (title) => {
                        await episodeService.createEpisode(selectedSeason.id, title);
                        updateEpisodesList();
                        setNewEpisode(null)
                    }}
                />
            )}

            {newSeason && (
                <SeasonNewModal
                    onClose={() => setNewSeason(null)}

                    onSave={ async ({ name, franchise, year }) => {
                        const newSeason = await seasonService.createSeason(name, franchise, year)
                        setNewSeason(null)
                        fetchSeasons(newSeason)
                    }}
                />
            )}

            {editSeason && (
                <SeasonEditModal
                    season = {selectedSeason}
                    onClose={() => setEditSeason(null)}
                    onSave={ async ({ name, franchise, year }) => {
                        const response = await seasonService.updateSeason(selectedSeason.id, name, franchise, year)
                        if(response.success){
                            setEditSeason(null)
                            fetchSeasons(response.data)
                        }
                    }}
                />
            )}
        </div>
    )
}