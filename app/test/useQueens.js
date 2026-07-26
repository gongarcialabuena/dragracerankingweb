import { useEffect, useState } from 'react'
import { queenService } from '@/lib/services/queenService'
import { participateService } from '@/lib/services/participateService'
import { useSupabaseStorage } from "./useSupabaseStorage";

export function useQueens() {
  const [queens, setQueens] = useState([])
  const [queen, setQueen] = useState({ name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [season, setSeason] = useState() 

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const supabaseStorageHook = useSupabaseStorage()
  
  const loadQueens = async (seasonSelected = null, pageParam = page) => {
    try {
      setLoading(true)
      const res= await queenService.listQueens(seasonSelected, pageParam)
      setQueens(res.data)
      setTotalPages(res.totalPages)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQueens(null,null)
  }, [])

  const handleCreate = async (seasonSelected) => {
    try {
      const imgQueenUrl = await supabaseStorageHook.handleDownload(queen.name, seasonSelected)
      if (!imgQueenUrl) throw new Error('No image found')

      const queenFound = await queenService.existsQueen(queen.name)
      console.log(queenFound)
      if(!queenFound){
        if(!await queenService.createQueen(queen.name, seasonSelected.id, imgQueenUrl)){
          throw new Error(`Creating queen ${queen.name} went wrong`)
        }

      }else{
        //Ya existe una reina con ese nombre, saltamos ese paso y añadimos solo otra participacion
        if(!await participateService.addParticipation(queenFound.id, seasonSelected.id, imgQueenUrl)){
          throw new Error(`Creating participation of queen ${queenFound.name} went wrong`)
        }
      }
      setQueen({ name: '' })
      loadQueens(seasonSelected, null)

    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (seasonSelected, queen, season) => {
    try {
      await supabaseStorageHook.handleDelete(queen.name, season)
      //Comprobar si solo participa en 1 o más temporadas
      if(! await participateService.deleteParticipation(queen.id, season.id)){
        //La Queen participaba en 1 sola temporada
        await queenService.deleteQueen(queen.id)
      }
      
      await loadQueens(seasonSelected, null)
      
    } catch (err) {
      setError(err.message)
    }
  }

  const handleNext = () => {
    const next = page + 1
    setPage(next)
    loadQueens(null, next)
  }

  const handlePrev = () => {
    const prev = page - 1
    setPage(prev)
    loadQueens(null, prev)
  }

  return {
    queens,
    queen,
    setQueen,
    handleCreate,
    handleDelete,
    loading,
    error,
    setSeason,
    loadQueens,
    page,
    setPage,
    totalPages,
    handleNext,
    handlePrev
  }
}