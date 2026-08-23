'use client'

import styles from './page.module.css'
import { useEffect, useState } from 'react'
import { FaCaretDown } from 'react-icons/fa'
import { seasonService } from '@/lib/services/seasonService'
import { pointTypeService } from '@/lib/services/pointTypeService'
import { queenService } from '@/lib/services/queenService'
import { ppeService } from '@/lib/services/ppeService'
import RankingCell from './RankingCell'

export default function RankingPage() {
    const [seasonsMap, setSeasonsMap] = useState(new Map())
    const [selectedSeason, setSelectedSeason] = useState(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [episodes, setEpisodes] = useState([])
    const [pointTypes, setPointTypes] = useState([])
    const [activeCell, setActiveCell] = useState(null)
    const [pointsMap, setPointsMap] = useState(new Map())
    const [queens, setQueens] = useState([])
    const [loading, setLoading] = useState(true)
    const [seasonSearch, setSeasonSearch] = useState('')

    const fetchSeasons = async () => {
        const map = await seasonService.getRankableSeasonsWithEpisodes()
        setSeasonsMap(map)
    }

    const fetchPointTypes = async () => {
        const types = await pointTypeService.getPointTypes()
        setPointTypes(types)
    }

    const fetchQueens = async (season) => {
        const data = await queenService.listQueens(season, null)
        setQueens(data.data)
    }

    const fetchPPE = async (season) => {
        const ppe = await ppeService.getRanking(season)

        const map = new Map()

        ppe.forEach(item => {
            const queenId = item.ppe_reference.queen_id.id
            const episodeId = item.ppe_reference.episode_id.id

            const key = `${queenId}|${episodeId}`

            const pointType = pointTypes.find(
                type => type.id === item.point_type_id.id
            )

            if (pointType) {
                map.set(key, pointType)
            }
        })

        setPointsMap(map)
    }

    const handleSeasonChange = async (season) => {
        setLoading(true)

        setSelectedSeason(season)
        setDropdownOpen(false)
        setEpisodes(seasonsMap.get(season) ?? [])

        try {
            await Promise.all([
                fetchQueens(season),
                fetchPPE(season)
            ])
        } catch (error) {
            console.error('Error loading queens:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateScore = (queenId) => {

        let totalScore = 0
        let totalEpisodes = 0
        for (const [currentKey, point] of pointsMap) {
            
            const currentQueenId = currentKey.split('|')[0]

            if (currentQueenId === queenId) {
                totalScore += point.value 
                totalEpisodes++
            }
        }

        return totalEpisodes > 0 ? (totalScore / totalEpisodes).toFixed(3) : 0.000
    }

    const saveRanking = async () => {
        const rows = queens.flatMap(queen =>
            episodes.map(episode => {
                const key = `${queen.queen.id}|${episode.id}`
                const point = pointsMap.get(key)

                return {
                    queen_id: queen.queen.id,
                    episode_id: episode.id,
                    point_type_id: point?.id ?? null
                }
            })
        )

        await ppeService.saveRanking(
            selectedSeason.id,
            rows
        )
        alert("Ranking guardado correctamente")
    }

    const rankedQueens = [...queens]
        .map(queen => ({
            ...queen,
            score: calculateScore(queen.queen.id)
        }))
        .sort((a, b) => b.score - a.score)

    const getPosition = (index) => {
        if (index === 0) return 1

        const currentScore = rankedQueens[index].score
        const previousScore = rankedQueens[index - 1].score

        if (currentScore === previousScore) {
            return getPosition(index - 1)
        }

        return index + 1
    }

    const filteredSeasons = Array.from(seasonsMap.keys()).filter(season =>
        season.name.toLowerCase().includes(seasonSearch.toLowerCase())
    )

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)

            try {
                await Promise.all([
                    fetchSeasons(),
                    fetchPointTypes()
                ])
            } catch (error) {
                console.error('Error loading ranking:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    return (
        <div className={styles.pageContent}>

            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                    <span>Cargando...</span>
                </div>
            )}

            <div className={styles.selector}>
                <button
                    type="button"
                    className={styles.selectorButton}
                    onClick={() => setDropdownOpen(prev => !prev)}
                >
                    <span>
                        {selectedSeason
                            ? selectedSeason.name
                            : 'Selecciona una temporada'}
                    </span>

                    <FaCaretDown
                        className={`${styles.caret} ${
                            dropdownOpen ? styles.caretOpen : ''
                        }`}
                    />
                </button>
                <button
                    type="button"
                    className={styles.save}
                    onClick={ async () => {
                        await saveRanking()
                    }}
                >
                    Guardar ranking
                </button>          
                {dropdownOpen && (
                    <div className={styles.dropdown}>

                        <div className={styles.searchContainer}>
                            <input
                                type="text"
                                placeholder="Buscar temporada..."
                                value={seasonSearch}
                                onChange={(e) => setSeasonSearch(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        {filteredSeasons.map(season => (
                            <button
                                key={season.id}
                                type="button"
                                className={`${styles.dropdownItem} ${
                                    selectedSeason?.id === season.id
                                        ? styles.selected
                                        : ''
                                }`}
                                onClick={() => {
                                    handleSeasonChange(season)
                                    setSeasonSearch('')
                                }}
                            >
                                <span>{season.name}</span>
                            </button>
                        ))}

                        {filteredSeasons.length === 0 && (
                            <div className={styles.noResults}>
                                No se encontraron temporadas
                            </div>
                        )}

                    </div>
                )}
            </div>

            {selectedSeason && (
                <div className={styles.tableContainer}>
                    <table className={styles.rankingTable}>
                        <thead>
                            <tr>
                                <th className={styles.queenHeader}></th>

                                {episodes.map(episode => (
                                    <th
                                        key={episode.id}
                                        className={styles.episodeHeader}
                                    >
                                        {episode.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {rankedQueens.map((queen, index) => (
                                <tr key={queen.queen.id}>
                                    <td className={styles.queenCell}>
                                        <div className={styles.queenContent}>
                                            <span className={styles.queenPosition}>
                                                {getPosition(index)}º
                                            </span>

                                            <img
                                                src={queen.image_url}
                                                alt={queen.queen.name}
                                                className={styles.queenImage}
                                                draggable={false}
                                            />

                                            <div className={styles.queenInfo}>
                                                <span className={styles.queenName}>
                                                    {queen.queen.name}
                                                </span>

                                                <span className={styles.queenScore}>
                                                    {queen.score}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    {episodes.map(episode => {
                                        const key = `${queen.queen.id}|${episode.id}`

                                        return (
                                            <td
                                                key={episode.id}
                                                className={styles.scoreCell}
                                            >
                                                <RankingCell
                                                    cellId={key}
                                                    activeCell={activeCell}
                                                    setActiveCell={setActiveCell}
                                                    point={pointsMap.get(key)}
                                                    pointTypes={pointTypes}
                                                    setPoint={(point) => {
                                                        setPointsMap(prev => {
                                                            const copy = new Map(prev)

                                                            if (point) {
                                                                copy.set(key, point)
                                                            } else {
                                                                copy.delete(key)
                                                            }

                                                            return copy
                                                        })
                                                    }}
                                                />
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}