'use client'

import { queenService } from '@/lib/services/queenService'
import { useEffect, useState } from 'react'
import styles from './queens.module.css'
import QueenNewModal from './QueenNewModal'
import { participateService } from '@/lib/services/participateService'
import { supabaseStorageService } from '@/lib/services/supabaseStorageService'
import { wikiImgService} from '@/lib/services/wikiImgService'

export default function QueensAdmin() {

    const [queens, setQueens] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [newQueen, setNewQueen] = useState(null)

    const fetchQueens = async (currentPage) => {
        try {
            setLoading(true)

            const queensList = await queenService.listQueens(null, currentPage)

            setQueens(queensList.data)
            setTotalPages(queensList.totalPages)

        } catch (error) {
            console.error('Error fetching queens list:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQueens(page)
    }, [page])

    const handleDownload = async (name, season) => {
        const urlQueenName = name.replace(/\s+/g, '')  
        const imgBlob = await wikiImgService.getQueenImgWiki(urlQueenName, season)
        console.log(imgBlob)
        const imgPath = await supabaseStorageService.uploadImgQueen(season, urlQueenName, imgBlob)
        console.log(imgPath)
        const imgUrl = await supabaseStorageService.getQueenImg(imgPath)
        console.log(imgUrl)
        return imgUrl
    };

    return (
        <div>
            <div className={styles.queensHeader}>

                <button
                    type="button"
                    className={styles.addQueen}
                    onClick={() => {
                        setNewQueen(true)
                    }}
                >
                    Añadir Reina
                </button>

                <button
                    type="button"
                    className={styles.addQueen}
                    onClick={async () => {
                        // Eliminar reina
                    }}
                >
                    Eliminar Reina
                </button>
            </div>

            <div className={styles.queensList}>
                {loading ? (
                    <p className={styles.loading}>Cargando...</p>
                ) : queens.length === 0 ? (
                    <p className={styles.empty}>No hay reinas.</p>
                ) : (
                    queens.map(queen => (
                        <button
                            key={queen.queen.id + '-' + queen.season.name}
                            type="button"
                            className={styles.queen}
                        >
                            <img
                                src={queen.image_url}
                                alt={queen.queen.name}
                            />

                            <span>
                                {queen.queen.name}
                            </span>

                            <small>
                                {queen.season.name}
                            </small>
                        </button>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className={styles.pagination}>

                    <button
                        type="button"
                        disabled={page === 1 || loading}
                        onClick={() => setPage(page - 1)}
                    >
                        ←
                    </button>

                    <span>
                        Página {page} de {totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={page === totalPages || loading}
                        onClick={() => setPage(page + 1)}
                    >
                        →
                    </button>

                </div>
            )}
            {newQueen && (
                <QueenNewModal
                    onClose={() => setNewQueen(false)}

                    onSave={ async ({ name, season }) => {
                        const imgQueenUrl = await handleDownload(name, season)
                        if (!imgQueenUrl) throw new Error('No image found')

                        const queenFound = await queenService.existsQueen(name)
                        if(!queenFound){
                            if(!await queenService.createQueen(name, season.id, imgQueenUrl)){
                            throw new Error(`Creating queen ${name} went wrong`)
                            }
                        }else{
                            //Ya existe una reina con ese nombre, saltamos ese paso y añadimos solo otra participacion
                            if(!await participateService.addParticipation(queenFound.id, season.id, imgQueenUrl)){
                            throw new Error(`Creating participation of queen ${queenFound.name} went wrong`)
                            }
                        }
                        fetchQueens(1)
                        setNewQueen(false)
                    }}
                />
            )}
        </div>
    )
}